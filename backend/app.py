from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import numpy as np

from models import ranked_model, feature_names, categorical_columns, location_model, df
from services import fetch_top_shops, generate_ai_insights
from market_gap import get_market_analysis_logic
from business_logic import PlanGenerator
from utils import make_json_safe
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/")
def health_check():
    return jsonify({"status": "running", "message": "LocalInsight Backend API"})

# -------- Location Prediction --------
@app.route("/api/predict_location", methods=["POST"])
def predict_location():
    # Get user Input
    data = request.get_json()
    category = data.get("business_category")
    target_customer = data.get("target_customer", "")
    
    raw_investment = data.get("investment_max", 0)
    investment_in_lakhs = float(raw_investment) / 100000

    dataset = df.copy()
    
    if target_customer == "youth":
        dataset["target_ratio"] = dataset["Youth_Pop_%"]
        dataset["target_type"] = "youth"
    elif target_customer == "female":
        dataset["target_ratio"] = dataset["Female_Pop_%"]
        dataset["target_type"] = "female"
    else:
        dataset["target_ratio"] = dataset["Male_Pop_%"]
        dataset["target_type"] = "male"
        
    candidates =  dataset[
        (dataset["Business_Category"] == category) & 
        (dataset["target_type"] == target_customer)
    ].copy()
    
    if candidates.empty:
        return jsonify({"status": "error", "message": "No matching locations found"})
        
    candidates['Investment_Lakhs'] = investment_in_lakhs
    
    # 3. Dynamic Feature Engineering
    candidates['Residential_density'] = candidates['Population'] / candidates['Total_Area']
    candidates['Market_Saturation_Index'] = candidates['Population'] / (candidates['Competitor_Count'] + 1)
    
    # 4. Critical: Ensure Categorical Dtypes
    for col in categorical_columns:
        if col in candidates.columns:
            candidates[col] = candidates[col].astype('category')
            
    candidates['rank_score'] = ranked_model.predict(candidates[feature_names])

    # 6. Get Top 3
    top_3 = candidates.sort_values(by='rank_score', ascending=False).head(3)
    return jsonify(make_json_safe(top_3.to_dict(orient="records")))


# Make sure your label encoder classes match training
label_encoder = LabelEncoder()
label_encoder.classes_ = np.array(["Low", "Medium", "High"])

# -------- City Prediction by Pincode --------
@app.route("/api/predict_city", methods=["POST"])
def predict_city():
    data = request.get_json()
    pincode = data.get("pincode")
    category = data.get("business_category")

    if not pincode or not category:
        return jsonify({"error": "Both 'pincode' and 'business_category' are required"}), 400

    # Lookup the row by pincode
    city_data = df[df["Pincode"] == int(pincode)]
    if city_data.empty:
        return jsonify({"error": f"Pincode '{pincode}' not found in database"}), 404
    
    row = city_data.iloc[0]
    city = row["City"]

    # Prepare input features for the model
    input_df = pd.DataFrame([{
        "Competitor_Count": row.get("similar_shop", 0),
        "Mall_Proximity": row.get("Mall_Proximity", 0),  # adjust if column name differs
        "Footfall_Proxy": row.get("FootFalls_per_month", 0),
        "Rent": row.get("Rent", 0),
        "Avg_Income": row.get("avg_income", 0),
        "Residential_density": row.get("Population", 0) / max(row.get("Total_Area", 1), 1),
        "Youth_Pop_%": row.get("Youth_Ratio", 0),
        "Business_Category": category
    }])

    # Predict using the pipeline
    prediction_encoded = location_model.predict(input_df)
    
    prediction_encoded = np.array(prediction_encoded)
    prediction = label_encoder.inverse_transform(prediction_encoded)[0]

    # Optionally, generate insights / fetch top shops
    insights = generate_ai_insights(row.to_dict())
    shops = fetch_top_shops(city, category)

    return jsonify({
        "city": city,
        "pincode": pincode,
        "product_type": category,
        "predicted_category": prediction,
        "insights": insights,
        "shops": shops
    })

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


# -------- Get All Locations --------
@app.route("/api/locations", methods=["GET"])
def get_all_locations():
    try:
        # Return all unique cities or all location data
        # For the map, we need lat/lon or city names to geocode
        results = df.copy()
        # Ensure we have opportunity scores if not already present
        if 'opportunity_score' not in results.columns:
            results['opportunity_score'] = 0.5 # Default or calculate if needed
            
        return jsonify(make_json_safe(results.to_dict(orient="records")))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
