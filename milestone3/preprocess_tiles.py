import os
import json
import math
from collections import defaultdict

# === Parameters ===
LAT_STEP = 0.002
LON_STEP = 0.002
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "frontend", "public", "heatmap_data_full")
OUTPUT_FILE = os.path.join(BASE_DIR, "crime_tiles_summary.json")

# === Tile Key Helper ===
def get_tile_key(lat, lon):
    lat_tile = math.floor(lat / LAT_STEP) * LAT_STEP
    lon_tile = math.floor(lon / LON_STEP) * LON_STEP
    return (round(lat_tile, 5), round(lon_tile, 5))

# === Data Structure ===
tile_counts = defaultdict(int)
tile_types = defaultdict(lambda: defaultdict(int))  # tile → type → count

# === Process Files ===
for filename in os.listdir(DATA_DIR):
    if filename.endswith(".json"):
        with open(os.path.join(DATA_DIR, filename), "r") as f:
            data = json.load(f)
            for entry in data:
                lat, lon = entry["lat"], entry["lon"]
                crime_type = entry["primary_type"]
                tile = get_tile_key(lat, lon)

                tile_counts[tile] += 1
                tile_types[tile][crime_type] += 1

# === Format Output ===
output = []
for tile, count in tile_counts.items():
    lat, lon = tile
    types = tile_types[tile]
    output.append({
        "lat": lat,
        "lon": lon,
        "count": count,
        "types": types  # example: {"THEFT": 12, "BATTERY": 5}
    })

# === Save as JSON ===
with open(OUTPUT_FILE, "w") as f:
    json.dump(output, f, indent=2)

print(f"✅ Preprocessing done. Saved {len(output)} tiles to {OUTPUT_FILE}")