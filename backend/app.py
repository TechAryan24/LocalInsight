from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

from models import ranked_df, location_model, df
from services import fetch_top_shops, generate_ai_insights
from market_gap import get_market_analysis_logic
from business_logic import PlanGenerator
from utils import make_json_safe

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/")
def health_check():
    return jsonify({"status": "running", "message": "LocalInsight Backend API"})

# -------- Location Prediction --------
@app.route("/api/predict_location", methods=["POST"])
def predict_location():
    data = request.get_json()
    category = data.get("business_category")
    district = data.get("preferred_district", "")

    filtered = ranked_df[
        ranked_df["product_type"].str.lower() == category.lower()
    ]

    if district:
        filtered = filtered[
            filtered["District"].str.lower() == district.lower()
        ]

    top = filtered.sort_values("opportunity_score", ascending=False).head(5)
    return jsonify(make_json_safe(top.to_dict(orient="records")))


# -------- City Prediction --------
@app.route("/api/predict_city", methods=["POST"])
def predict_city():
    data = request.get_json()
    city = data["city"]
    category = data["business_category"]

    city_data = df[df["City"].str.lower() == city.lower()]
    if city_data.empty:
        return jsonify({"error": f"City '{city}' not found in database"}), 404
    
    row = city_data.iloc[0]

    
    input_df = pd.DataFrame([{
        "avg_income": row["avg_income"],
        "population": row["population"],
        "Rent": row["Rent"],
        "similar_shop": row["similar_shop"],
        "Youth_Ratio": row["Youth_Ratio"],
        "FootFalls_per_month": row["FootFalls_per_month"],
        "product_type": category
    }])

    prediction = location_model.predict(input_df)[0]

    insights = generate_ai_insights(row.to_dict())
    shops = fetch_top_shops(city, category)

    return jsonify(make_json_safe({
        "city": city,
        "product_type": category,
        "predicted_category": prediction,
        "insights": insights,
        "shops": shops
    }))

# -------- Strategy & Business Plan Generator --------
@app.route("/api/generate_strategy", methods=["POST"])
def generate_strategy():
    data = request.get_json()
    domain = data.get("domain")
    location = data.get("location")

    if not domain or not location:
        return jsonify({"error": "Domain and location are required"}), 400

    try:
        # 1. Get Market Data (Member A Logic)
        market_package = get_market_analysis_logic(domain, location)

        # 2. Generate AI Business Plan (Member B Logic)
        api_key = os.getenv("GEMINI_API_KEY")
        generator = PlanGenerator(api_key=api_key)
        
        # Use the PlanGenerator logic to create the structured plan
        business_plan_obj = generator.create_plan(market_package)
        
        # 3. Consolidate everything for the Frontend
        response_data = {
            "market_gap_score": market_package["gap_score"],
            "best_opportunity": market_package["niche"],
            "status": market_package["status"],
            "location": market_package["location"],
            "area_sq_km": market_package["area_sq_km"],
            "business_plan": business_plan_obj.dict() # Convert Pydantic to Dict for JSON
        }

        return jsonify(make_json_safe(response_data))

    except Exception as e:
        print(f"Error generating strategy: {str(e)}")
        return jsonify({"error": "Failed to generate business plan", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)