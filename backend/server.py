import os
import base64
import json

from flask import Flask, jsonify, request
import google.generativeai as genai
import requests

try:
  # Load variables from a local .env file if present
  from dotenv import load_dotenv  # type: ignore
  load_dotenv()
except Exception:
  # If python-dotenv isn't installed, we just rely on real env vars
  pass

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
  raise RuntimeError("GEMINI_API_KEY env var is required")

genai.configure(api_key=GEMINI_API_KEY)
# Use latest Gemini Flash model (2.5) as requested
model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)


@app.post("/translate")
def translate():
  data = request.get_json(force=True, silent=True) or {}
  text = data.get("text", "").strip()
  target_lang = data.get("targetLang", "en")

  if not text:
    return jsonify({"error": "text is required"}), 400

  prompt = f"Translate this text into {target_lang} only. Respond with the translation only, no explanation:\n\n{text}"
  try:
    resp = model.generate_content(prompt)
    translated = (resp.text or "").strip()
    return jsonify({"translatedText": translated})
  except Exception as e:
    return jsonify({"error": str(e)}), 500


def reverse_geocode(lat: float, lng: float) -> str:
  """Best-effort reverse geocode using OpenStreetMap Nominatim (no key required)."""
  try:
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
      "format": "jsonv2",
      "lat": lat,
      "lon": lng,
      "zoom": 12,
      "addressdetails": 1,
    }
    headers = {"User-Agent": "linguajourney/1.0 (student project)"}
    resp = requests.get(url, params=params, headers=headers, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    addr = data.get("address", {})
    city = addr.get("city") or addr.get("town") or addr.get("village")
    state = addr.get("state")
    country = addr.get("country")
    parts = [p for p in [city, state, country] if p]
    return ", ".join(parts) if parts else data.get("display_name", "")
  except Exception:
    return ""


def ai_suggest_places(location_label: str) -> list[dict]:
  """Use Gemini to suggest interesting places around a city/region name."""
  if not location_label:
    return []

  prompt = f"""
You are helping a traveler explore around {location_label}.

List 10 interesting nearby places such as malls, supermarkets, parks, landmarks,
and tourist attractions that a visitor might want to check out.

Return ONLY a JSON array (no extra text) where each item has:
- id: a short unique string (can be slugified name)
- name: place name
- category: short category like "Mall", "Supermarket", "Park", "Tourist spot"

Example:
[
  {{"id": "sm-north-edsa", "name": "SM North EDSA", "category": "Mall"}},
  {{"id": "puregold-xyz", "name": "Puregold XYZ", "category": "Supermarket"}}
]
"""
  try:
    resp = model.generate_content(prompt)
    raw = (resp.text or "").strip()
    # Gemini sometimes wraps JSON in markdown fences; strip them if present.
    if raw.startswith("```"):
      raw = raw.strip("`")
      # Remove possible json language tag
      if "\n" in raw:
        raw = raw.split("\n", 1)[1]
    data = json.loads(raw)
    if isinstance(data, list):
      cleaned: list[dict] = []
      for item in data:
        if not isinstance(item, dict):
          continue
        cleaned.append(
          {
            "id": str(item.get("id") or item.get("name") or len(cleaned)),
            "name": item.get("name") or "Place",
            "category": item.get("category") or "Place",
            # No lat/lng from AI; these will still show in list, not map.
            "lat": None,
            "lng": None,
          }
        )
      return cleaned
  except Exception:
    pass

  return []


@app.post("/ocr")
def ocr():
  """Extract text from an image (optionally focusing on a crop rectangle)."""
  data = request.get_json(force=True, silent=True) or {}
  image_b64 = data.get("imageBase64", "").strip()
  crop_rect = data.get("cropRect") or {}

  if not image_b64:
    return jsonify({"error": "imageBase64 is required"}), 400

  try:
    image_bytes = base64.b64decode(image_b64)
  except Exception:
    return jsonify({"error": "invalid base64 image"}), 400

  # Build a short hint about the crop rectangle (values are 0–1)
  hint = ""
  if all(k in crop_rect for k in ("x", "y", "width", "height")):
    hint = (
      "Only read the text inside the rectangle defined by "
      f"x={crop_rect['x']:.2f}, y={crop_rect['y']:.2f}, "
      f"width={crop_rect['width']:.2f}, height={crop_rect['height']:.2f} (normalized 0-1). "
    )

  prompt = (
    f"{hint}Return exactly the text you see in that area, preserving line breaks. "
    "Do not add explanations or translation, only the raw text."
  )

  try:
    resp = model.generate_content(
      [
        {
          "mime_type": "image/jpeg",
          "data": image_bytes,
        },
        {"text": prompt},
      ]
    )
    text = (resp.text or "").strip()
    return jsonify({"text": text})
  except Exception as e:
    return jsonify({"error": str(e)}), 500


@app.get("/nearby")
def nearby():
  """Return nearby places (e.g., markets) within a radius of the given location.

  This uses Google Places Nearby Search. You must set PLACES_API_KEY in your env.
  """
  places_api_key = os.getenv("PLACES_API_KEY")
  if not places_api_key:
    return jsonify({"error": "PLACES_API_KEY env var is required for /nearby"}), 500

  try:
    lat = float(request.args.get("lat", ""))
    lng = float(request.args.get("lng", ""))
  except ValueError:
    return jsonify({"error": "lat and lng query params are required"}), 400

  # Radius around the capture location (defaults to 5000m ≈ 5km)
  radius = int(request.args.get("radius_m", "5000"))

  # Focus on markets / stores and interesting nearby places.
  url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
  params = {
    "location": f"{lat},{lng}",
    "radius": radius,
    # Use a broad keyword so we also get malls, supermarkets, and attractions.
    "keyword": "supermarket grocery mall market tourist attraction",
    "key": places_api_key,
  }

  try:
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()
  except Exception as e:
    return jsonify({"error": f"Places API request failed: {e}"}), 500

  results = data.get("results", [])[:20]
  places: list[dict] = []
  for r in results:
    loc = r.get("geometry", {}).get("location", {})
    places.append(
      {
        "id": r.get("place_id"),
        "name": r.get("name"),
        "category": ", ".join(r.get("types", [])[:3]) if r.get("types") else "Market",
        "lat": loc.get("lat"),
        "lng": loc.get("lng"),
      }
    )

  # If Places API returned nothing, ask Gemini to suggest places around the city/region.
  if not places:
    location_label = reverse_geocode(lat, lng)
    ai_places = ai_suggest_places(location_label)
    places.extend(ai_places)

  return jsonify({"places": places})


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5000)

