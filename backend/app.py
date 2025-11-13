from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np
from flask_cors import CORS
import os
from dotenv import load_dotenv  
import google.generativeai as genai
import requests

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

#load environment in file
load_dotenv()

# -------- Configuration --------
SERPAPI_KEY = os.getenv("SERP_API_KEY")  
SERPAPI_URL = "https://serpapi.com/search"

# 🔹 Configure Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

# -------- Helper: call SerpAPI for local results --------
def fetch_top_shops_from_serpapi(city: str, category: str, top_n: int = 3):
    """
    Query SerpAPI (Google Maps engine) for 'category in city' and return a list of shop dicts.
    Each shop dict: { title, address, rating, reviews_count, thumbnail, link, reviews[] }
    """
    if not SERPAPI_KEY:
        return {"error": "SERPAPI_KEY not configured on server."}

    params = {
        "engine": "google_maps",
        "q": f"{category} in {city}",
        "type": "search",
        "api_key": SERPAPI_KEY,
    }

    try:
        resp = requests.get(SERPAPI_URL, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        return {"error": f"SerpAPI request failed: {str(e)}"}

    results = []
   
    local_results = data.get("local_results") or data.get("local_results", []) or data.get("places_results") or []

  
    if not local_results:
        local_results = data.get("maps_results") or data.get("places") or []

    # Parse top results
    for item in (local_results or [])[:top_n]:
        title = item.get("title") or item.get("name") or item.get("position") or "Unknown"
        address = item.get("address") or item.get("snippet") or item.get("vicinity") or item.get("locality") or ""
        rating = item.get("rating") or item.get("gps_rating") or None

        reviews_list = item.get("reviews") or item.get("reviews_snippet") or []
        if isinstance(reviews_list, list):
            reviews_count = len(reviews_list)
        else:
            reviews_count = item.get("review_count") or item.get("reviews_count") or None
            if isinstance(reviews_count, str) and reviews_count.isdigit():
                reviews_count = int(reviews_count)

        # Thumbnail/photo: SerpAPI might provide 'thumbnail' or 'photo' or 'thumbnail_src'
        thumbnail = (
            item.get("thumbnail")
            or item.get("thumbnail_src")
            or (item.get("photos") and item.get("photos")[0].get("src") if item.get("photos") else None)
            or item.get("image")
        )

        # Link to maps (if available)
        link = item.get("link") or item.get("maps_link") or item.get("place_id")
        # If place_id present but not link, create google maps URL
        if link and link.startswith("ChI") and not link.startswith("http"):
            link = f"https://www.google.com/maps/search/?api=1&query=google&query_place_id={link}"

        parsed_reviews = []
        if isinstance(reviews_list, list):
            for r in reviews_list[:5]:  
                parsed_reviews.append({
                    "author": r.get("author") or r.get("user") or None,
                    "rating": r.get("rating"),
                    "text": r.get("text") or r.get("snippet") or None,
                })
                
        # ✅ Ensure thumbnail is valid
        if not thumbnail or not str(thumbnail).startswith("http"):
           thumbnail = "https://via.placeholder.com/400x300?text=No+Image+Available"
        
        print(f"✅ {title} → {thumbnail}")
        
        results.append({
            "title": title,
            "address": address,
            "rating": rating,
            "reviews_count": reviews_count,
            "thumbnail": thumbnail,
            "link": link,
            "reviews": parsed_reviews,
        })

    return {"results": results}

if api_key:
    try:
        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel("gemini-2.5-flash")  
        print("✅ Gemini API configured successfully.")
    except Exception as e:
        print(f"Gemini configuration error: {e}")
        gemini_model = None
else:
    print("GEMINI_API_KEY not found in .env file.")
    gemini_model = None

# 🔹 Load datasets and ML model
with open("ranked_locations.pkl", "rb") as file:
    ranked_df = pickle.load(file)

with open("location_prediction.pkl", "rb") as f:
    model_prediction = pickle.load(f)

df = pd.read_csv("business_revenue final.csv")

if "avg_income" in df.columns:
    df["avg_income"] = (
        df["avg_income"]
        .astype(str)
        .str.replace(",", "", regex=False)
        .astype(float)
    )


# 🔧 Helper: recursively convert numpy & pandas objects to JSON-safe types
def make_json_serializable(obj):
    if isinstance(obj, dict):
        return {k: make_json_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_json_serializable(v) for v in obj]
    elif isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64)):
        return float(obj)
    elif isinstance(obj, (np.bool_)):
        return bool(obj)
    elif isinstance(obj, pd.Series):
        return make_json_serializable(obj.to_dict())
    elif pd.isna(obj):
        return None
    return obj


# Route 1: Predict top 5 locations
@app.route("/api/predict_location", methods=["POST"])
def predict_location():
    data = request.get_json()
    business_category = data.get("business_category")
    investment_min = float(data.get("investment_min", 0))
    investment_max = float(data.get("investment_max", 0))
    preferred_district = data.get("preferred_district", "")

    # Filter dataset based on category
    filtered = ranked_df[ranked_df["product_type"].str.lower() == business_category.lower()]
    
    # Filter based on district
    if preferred_district:
        filtered = filtered[filtered["District"].str.lower() == preferred_district.lower()]
        
    # Sort the filtered result
    filtered = filtered.sort_values(by="opportunity_score", ascending=False)
    top_locations = filtered.head(5).to_dict(orient="records")

    if not top_locations:
        return jsonify({"message": "No suitable locations found for your input."}), 404

    return jsonify(make_json_serializable(top_locations))


#Route 2: Predict city success + AI insights
@app.route("/api/predict_city", methods=["POST"])
def predict_city():
    data = request.get_json()
    product_type = data.get("business_category")
    city = data.get("city")

    # Find city in dataset
    city_data = df[df["City"].str.lower() == city.lower()]
    if city_data.empty:
        return jsonify({"error": f"City '{city}' not found in dataset."}), 404

    city_row = city_data.iloc[0]
    
    # print("City row: ", city_row)
    # Prepare input for ML model
    input_data = pd.DataFrame([{
        "avg_income": city_row["avg_income"],
        "population": city_row["population"],
        "Rent": city_row["Rent"],
        "similar_shop": city_row["similar_shop"],
        "Youth_Ratio": city_row["Youth_Ratio"],
        "FootFalls_per_month": city_row["FootFalls_per_month"],
        "product_type": product_type
    }])
    
    # print("input data: \n", input_data)
    # Predict success level
    prediction = model_prediction.predict(input_data)[0]

    # Data summary for AI
    data_for_ai = {
        "city": city,
        "product_type": product_type,
        "avg_income": float(city_row["avg_income"]),
        "population": int(city_row["population"]),
        "rent": float(city_row["Rent"]),
        "similar_shops": int(city_row["similar_shop"]),
        "youth_ratio": float(city_row["Youth_Ratio"]),
        "footfalls": int(city_row["FootFalls_per_month"]),
        "predicted_category": str(prediction),
    }

    #  Generate Gemini AI insights
    ai_summary = "AI summary unavailable."
    if gemini_model:
        try:
            prompt = f"""
            You are a smart business analyst.
            Analyze the success potential of a {product_type} business in {city}
            using the following data:

            {data_for_ai}

            Explain briefly in 4-5 sentences why this business might succeed
            or face challenges here, focusing on factors like income levels,
            rent, youth ratio, and customer footfall.
            """
            response = gemini_model.generate_content(prompt)
            ai_summary = getattr(response, "text", "AI summary unavailable.")
        except Exception as e:
            print(f"Error during Gemini generation: {e}")
            ai_summary = "AI summary unavailable due to generation issue."
            
    # Fetch top shops via SerpAPI
    serp_res = fetch_top_shops_from_serpapi(city=city, category=product_type, top_n=3)
    if "error" in serp_res:

        response_payload = {
            "city": city,
            "product_type": product_type,
            "predicted_category": prediction,
            "shops": [],
            "serpapi_error": serp_res["error"]
        }
        return jsonify(response_payload), 200

    shops = serp_res.get("results", [])


    # Final response
    final_response = {
        "city": city,
        "product_type": product_type,
        "predicted_category": prediction,
        "insights": ai_summary,
        "shops": shops
    }

    return jsonify(make_json_serializable(final_response))


if __name__ == "__main__":
    app.run(debug=True)

# package name 
# flask 
# flask-cors 
# flask-restful 
# scikit-learn 1.6.1
# dotenv
# google
# google-generativeai
# requests