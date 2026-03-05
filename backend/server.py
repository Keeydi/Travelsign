import os
import base64
import json
import math

from flask import Flask, jsonify, request
import google.generativeai as genai
import requests

try:
  from dotenv import load_dotenv  # type: ignore
  load_dotenv()
except Exception:
  pass

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
  raise RuntimeError("GEMINI_API_KEY env var is required")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)

# ─── Helpers ──────────────────────────────────────────────────────────────────

def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
  """Return distance in meters between two lat/lng points."""
  R = 6371000
  phi1 = math.radians(lat1)
  phi2 = math.radians(lat2)
  dphi = math.radians(lat2 - lat1)
  dlam = math.radians(lng2 - lng1)
  a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
  return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


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


def osm_tag_to_category(tags: dict) -> str:
  """Convert OSM tags to a human-readable category."""
  mapping = {
    "amenity": {
      "restaurant": "Restaurant", "fast_food": "Fast Food", "cafe": "Café",
      "bar": "Bar", "pub": "Pub", "food_court": "Food Court",
      "hospital": "Hospital", "clinic": "Clinic", "pharmacy": "Pharmacy",
      "bank": "Bank", "atm": "ATM", "hotel": "Hotel",
      "supermarket": "Supermarket", "marketplace": "Market",
      "cinema": "Cinema", "theatre": "Theatre", "library": "Library",
      "school": "School", "university": "University",
      "place_of_worship": "Place of Worship", "parking": "Parking",
      "fuel": "Gas Station", "post_office": "Post Office",
    },
    "shop": {
      "supermarket": "Supermarket", "mall": "Shopping Mall",
      "convenience": "Convenience Store", "clothes": "Clothing Store",
      "electronics": "Electronics", "bakery": "Bakery",
      "butcher": "Butcher", "pharmacy": "Pharmacy",
      "hardware": "Hardware Store", "department_store": "Department Store",
    },
    "tourism": {
      "museum": "Museum", "attraction": "Tourist Attraction",
      "viewpoint": "Viewpoint", "hotel": "Hotel",
      "hostel": "Hostel", "gallery": "Art Gallery",
      "zoo": "Zoo", "theme_park": "Theme Park", "information": "Info Center",
    },
    "historic": {
      "monument": "Monument", "memorial": "Memorial",
      "castle": "Castle", "ruins": "Ruins", "building": "Historic Building",
      "archaeological_site": "Archaeological Site",
    },
    "leisure": {
      "park": "Park", "playground": "Playground",
      "stadium": "Stadium", "sports_centre": "Sports Center",
      "swimming_pool": "Swimming Pool", "fitness_centre": "Gym",
      "garden": "Garden", "nature_reserve": "Nature Reserve",
    },
    "natural": {
      "beach": "Beach", "cliff": "Cliff", "waterfall": "Waterfall",
      "cave_entrance": "Cave",
    },
  }
  for key, vals in mapping.items():
    tag_val = tags.get(key, "")
    if tag_val in vals:
      return vals[tag_val]
    # Partial match fallback
    for osm_val, label in vals.items():
      if osm_val in tag_val:
        return label
  return "Place"


def fetch_overpass_nearby(lat: float, lng: float, radius: int) -> list[dict]:
  """Query OpenStreetMap Overpass API for real nearby landmarks and stores."""
  overpass_url = "https://overpass-api.de/api/interpreter"
  query = f"""[out:json][timeout:20];
(
  node["amenity"~"restaurant|fast_food|cafe|bar|hospital|clinic|pharmacy|bank|hotel|supermarket|cinema|theatre|place_of_worship|fuel|post_office"](around:{radius},{lat},{lng});
  node["shop"~"supermarket|mall|convenience|clothes|electronics|bakery|department_store"](around:{radius},{lat},{lng});
  node["tourism"~"museum|attraction|viewpoint|hotel|hostel|gallery|zoo|theme_park"](around:{radius},{lat},{lng});
  node["historic"~"monument|memorial|castle|ruins"](around:{radius},{lat},{lng});
  node["leisure"~"park|stadium|sports_centre|garden|nature_reserve"](around:{radius},{lat},{lng});
  node["natural"~"beach|waterfall"](around:{radius},{lat},{lng});
  way["amenity"~"restaurant|fast_food|cafe|bar|hospital|clinic|pharmacy|bank|hotel|supermarket|cinema|theatre|place_of_worship|fuel|post_office"](around:{radius},{lat},{lng});
  way["shop"~"supermarket|mall|convenience|clothes|electronics|bakery|department_store"](around:{radius},{lat},{lng});
  way["tourism"~"museum|attraction|viewpoint|hotel|hostel|gallery|zoo|theme_park"](around:{radius},{lat},{lng});
  way["leisure"~"park|stadium|sports_centre|garden|nature_reserve"](around:{radius},{lat},{lng});
);
out body center 30;
"""
  headers = {"User-Agent": "linguajourney/1.0 (student project)"}
  resp = requests.post(overpass_url, data={"data": query}, headers=headers, timeout=22)
  resp.raise_for_status()
  data = resp.json()
  elements = data.get("elements", [])

  places: list[dict] = []
  seen_names: set[str] = set()

  for el in elements:
    tags = el.get("tags", {})
    name = tags.get("name") or tags.get("name:en") or tags.get("brand")
    if not name or name in seen_names:
      continue
    seen_names.add(name)

    # Coordinates
    if el.get("type") == "node":
      place_lat = el.get("lat")
      place_lng = el.get("lon")
    else:
      center = el.get("center", {})
      place_lat = center.get("lat")
      place_lng = center.get("lon")

    category = osm_tag_to_category(tags)

    dist = None
    if place_lat is not None and place_lng is not None:
      dist = round(haversine_distance(lat, lng, place_lat, place_lng))

    places.append({
      "id": str(el.get("id", len(places))),
      "name": name,
      "category": category,
      "lat": place_lat,
      "lng": place_lng,
      "distanceMeters": dist,
    })

    if len(places) >= 25:
      break

  # Sort by distance (closest first)
  places.sort(key=lambda p: p.get("distanceMeters") or 999999)
  return places


def ai_suggest_places(location_label: str) -> list[dict]:
  """Use Gemini to suggest places around a location when Overpass returns nothing."""
  if not location_label:
    return []
  prompt = f"""You are helping a traveler explore around {location_label}.

List 10 interesting nearby places such as malls, supermarkets, parks, landmarks,
and tourist attractions that a visitor might want to check out.

Return ONLY a JSON array (no extra text) where each item has:
- id: a short unique slug
- name: place name
- category: short category like "Mall", "Supermarket", "Park", "Tourist Spot"

Example:
[
  {{"id": "sm-north-edsa", "name": "SM North EDSA", "category": "Mall"}},
  {{"id": "rizal-park", "name": "Rizal Park", "category": "Park"}}
]
"""
  try:
    resp = model.generate_content(prompt)
    raw = (resp.text or "").strip()
    if raw.startswith("```"):
      lines = raw.strip("`").strip().splitlines()
      raw = "\n".join(lines[1:] if lines[0].lower().startswith("json") else lines)
    data = json.loads(raw)
    if isinstance(data, list):
      return [
        {
          "id": str(item.get("id") or item.get("name") or i),
          "name": item.get("name") or "Place",
          "category": item.get("category") or "Place",
          "lat": None,
          "lng": None,
          "distanceMeters": None,
        }
        for i, item in enumerate(data)
        if isinstance(item, dict)
      ]
  except Exception:
    pass
  return []


def ai_suggest_places_rich(location_label: str) -> list[dict]:
  """Use Gemini to generate rich suggested place cards for the Suggested Places section."""
  if not location_label:
    return []

  prompt = f"""You are a travel guide AI helping a visitor explore {location_label}.

Generate 6 interesting places a traveler should visit near {location_label}.
Include a variety: one iconic landmark, one market or mall, one park or nature spot,
one restaurant or food area, one museum or cultural site, and one hidden gem.

Return ONLY a valid JSON array. Each item must have:
- id: short unique slug (e.g. "plaza-mayor")
- name: place name (string)
- category: short category (e.g. "Landmark", "Mall", "Park", "Restaurant", "Museum", "Hidden Gem")
- description: 1-2 sentence description of the place (string)
- rating: a realistic rating like "4.5" (string)
- distance: estimated walking/driving distance like "0.8 km" (string)
- imageQuery: a short 2-3 word Unsplash search term for a photo of this type of place (e.g. "japanese temple", "outdoor market", "city park")

Return ONLY the JSON array, no other text.
"""
  try:
    resp = model.generate_content(prompt)
    raw = (resp.text or "").strip()
    # Strip markdown fences if present
    if raw.startswith("```"):
      lines = raw.strip("`").strip().splitlines()
      raw = "\n".join(lines[1:] if lines[0].lower().startswith("json") else lines)
    data = json.loads(raw)
    if isinstance(data, list):
      results = []
      for item in data:
        if not isinstance(item, dict):
          continue
        image_query = item.get("imageQuery", item.get("category", "travel destination"))
        # Use Unsplash with a deterministic seed per place for consistent images
        slug = str(item.get("id") or item.get("name") or len(results))
        image_url = f"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80"
        # Map common categories to curated Unsplash photo IDs
        cat = (item.get("category") or "").lower()
        if "temple" in cat or "worship" in cat or "church" in cat:
          image_url = "https://images.unsplash.com/photo-1570521462033-3015e76e7432?w=400&q=80"
        elif "market" in cat or "mall" in cat or "shop" in cat:
          image_url = "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&q=80"
        elif "park" in cat or "nature" in cat or "garden" in cat:
          image_url = "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80"
        elif "museum" in cat or "gallery" in cat or "cultural" in cat:
          image_url = "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&q=80"
        elif "restaurant" in cat or "food" in cat or "cafe" in cat:
          image_url = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80"
        elif "landmark" in cat or "monument" in cat or "historic" in cat:
          image_url = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80"
        elif "beach" in cat or "ocean" in cat or "sea" in cat:
          image_url = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"
        elif "view" in cat or "panorama" in cat or "skyline" in cat:
          image_url = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80"
        elif "hotel" in cat or "resort" in cat:
          image_url = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"
        elif "hidden" in cat or "gem" in cat:
          image_url = "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80"

        results.append({
          "id": str(item.get("id") or slug),
          "name": item.get("name") or "Place",
          "category": item.get("category") or "Attraction",
          "description": item.get("description") or "",
          "rating": str(item.get("rating") or "4.5"),
          "distance": str(item.get("distance") or "Nearby"),
          "image": image_url,
        })
      return results
  except Exception as e:
    print(f"ai_suggest_places_rich error: {e}")
  return []


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.post("/translate")
def translate():
  data = request.get_json(force=True, silent=True) or {}
  text = data.get("text", "").strip()
  target_lang = data.get("targetLang", "en")

  if not text:
    return jsonify({"error": "text is required"}), 400

  prompt = (
    f"Translate this text into {target_lang} only. "
    "Respond with the translation only, no explanation:\n\n" + text
  )
  try:
    resp = model.generate_content(prompt)
    translated = (resp.text or "").strip()
    return jsonify({"translatedText": translated})
  except Exception as e:
    return jsonify({"error": str(e)}), 500


@app.get("/nearby")
def nearby():
  """Return real nearby places from OpenStreetMap Overpass API.
  Falls back to Gemini AI suggestions if Overpass returns no results.
  """
  try:
    lat = float(request.args.get("lat", ""))
    lng = float(request.args.get("lng", ""))
  except ValueError:
    return jsonify({"error": "lat and lng query params are required"}), 400

  radius = int(request.args.get("radius_m", "5000"))

  try:
    places = fetch_overpass_nearby(lat, lng, radius)
  except Exception as e:
    print(f"/nearby Overpass error: {e}")
    places = []

  # If Overpass returned nothing, fall back to AI
  if not places:
    location_label = reverse_geocode(lat, lng)
    places = ai_suggest_places(location_label)

  return jsonify({"places": places})


@app.get("/suggest")
def suggest():
  """AI-generated rich place suggestions based on user location.
  Used by the Suggested Places section on the Dashboard.
  """
  try:
    lat = float(request.args.get("lat", ""))
    lng = float(request.args.get("lng", ""))
  except ValueError:
    return jsonify({"error": "lat and lng are required"}), 400

  location_label = reverse_geocode(lat, lng)
  if not location_label:
    return jsonify({"places": [], "location": ""})

  places = ai_suggest_places_rich(location_label)
  return jsonify({"places": places, "location": location_label})


@app.post("/ocr")
def ocr():
  """Extract text from an image (optionally focusing on a crop rectangle)."""
  try:
    data = request.get_json(force=True, silent=True) or {}
    image_b64 = data.get("imageBase64", "").strip()
    crop_rect = data.get("cropRect") or {}

    if not image_b64:
      return jsonify({"error": "imageBase64 is required"}), 400

    if "," in image_b64:
      image_b64 = image_b64.split(",")[-1]

    image_b64 = image_b64.replace(" ", "").replace("\n", "").replace("\r", "")

    try:
      image_bytes = base64.b64decode(image_b64)
    except Exception as e:
      return jsonify({"error": f"invalid base64 image: {str(e)}"}), 400

    mime_type = "image/jpeg"
    if len(image_bytes) >= 4:
      if image_bytes[:4] == b'\x89PNG':
        mime_type = "image/png"
      elif image_bytes[:2] == b'\xff\xd8':
        mime_type = "image/jpeg"
      elif image_bytes[:4] == b'RIFF' and image_bytes[8:12] == b'WEBP':
        mime_type = "image/webp"
      elif image_bytes[:6] in (b'GIF87a', b'GIF89a'):
        mime_type = "image/gif"

    hint = ""
    if all(k in crop_rect for k in ("x", "y", "width", "height")):
      try:
        hint = (
          "Only read the text inside the rectangle defined by "
          f"x={crop_rect['x']:.2f}, y={crop_rect['y']:.2f}, "
          f"width={crop_rect['width']:.2f}, height={crop_rect['height']:.2f} (normalized 0-1). "
        )
      except (ValueError, TypeError):
        hint = ""

    prompt = (
      f"{hint}Return exactly the text you see in that area, preserving line breaks. "
      "Do not add explanations or translation, only the raw text."
    )

    try:
      resp = model.generate_content(
        [{"mime_type": mime_type, "data": image_bytes}, {"text": prompt}]
      )
      text = (resp.text or "").strip()
      return jsonify({"text": text})
    except Exception as e:
      import traceback
      traceback.print_exc()
      return jsonify({"error": f"OCR processing failed: {str(e)}"}), 500

  except Exception as e:
    import traceback
    traceback.print_exc()
    return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5000)
