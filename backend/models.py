import pickle
import pandas as pd

with open("data/ranker_full.pkl", "rb") as f:
    bundle = pickle.load(f)
    
ranked_model = bundle["ranker"]
feature_names = bundle["features"]
categorical_columns = bundle["cat_cols"]

with open("data/evaluation.pkl", "rb") as f:
    location_model = pickle.load(f)

df = pd.read_csv("data/business_data_final.csv")

if "avg_income" in df.columns:
    df["avg_income"] = (
        df["avg_income"].astype(str)  
        .str.replace(",", "", regex=False)
        .astype(float)
    )
