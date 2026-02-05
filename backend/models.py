import pickle
import pandas as pd

with open("data/ranked_locations.pkl", "rb") as f:
    ranked_df = pickle.load(f)

with open("data/location_prediction.pkl", "rb") as f:
    location_model = pickle.load(f)

df = pd.read_csv("data/business_revenue final.csv")

if "avg_income" in df.columns:
    df["avg_income"] = (
        df["avg_income"].astype(str)
        .str.replace(",", "", regex=False)
        .astype(float)
    )
