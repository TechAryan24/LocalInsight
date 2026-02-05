import requests
from config import SERPAPI_KEY, SERPAPI_URL, gemini_model

# -------- SerpAPI --------
def fetch_top_shops(city, category, top_n=3):
    if not SERPAPI_KEY:
        return []

    params = {
        "engine": "google_maps",
        "q": f"{category} in {city}",
        "type": "search",
        "api_key": SERPAPI_KEY,
    }

    resp = requests.get(SERPAPI_URL, params=params, timeout=10)
    data = resp.json()

    results = []
    for item in data.get("local_results", [])[:top_n]:
        title = item.get("title")
        place_id = item.get("place_id")

        # ✅ FIX: Always generate a valid Google Maps link
        link = (
            item.get("link")
            or item.get("maps_link")
            or (
                f"https://www.google.com/maps/place/?q=place_id:{place_id}"
                if place_id else None
            )
        )

        # ✅ Fallback safety
        if not link or not str(link).startswith("http"):
            link = f"https://www.google.com/maps/search/{title.replace(' ', '+')}"

        results.append({
            "title": title,
            "address": item.get("address"),
            "rating": item.get("rating"),
            "reviews_count": item.get("reviews"),  # ✅ added
            "thumbnail": item.get("thumbnail")
                or "https://via.placeholder.com/400x300?text=No+Image",
            "link": link,  # ✅ guaranteed working link
        })

    return results


# -------- Gemini AI --------
def generate_ai_insights(data):
    if not gemini_model:
        return "AI insights unavailable."

    prompt = f"""
    Analyze business potential using this data:
    {data}

    Respond in 4–5 concise sentences.
    """

    response = gemini_model.generate_content(prompt)
    return getattr(response, "text", "AI response unavailable.")
