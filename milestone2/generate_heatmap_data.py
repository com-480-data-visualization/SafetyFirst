import pandas as pd
import os
import json
from collections import defaultdict
from tqdm import tqdm

INPUT_CSV = "Crimes_-_2001_to_Present.csv"
OUTPUT_DIR = "heatmap_data"
CHUNK_SIZE = 100_000  # Adjust for memory use

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Store aggregated results by year
heatmap_by_year = defaultdict(lambda: defaultdict(int))

# Define column mapping
LAT_COL = "Latitude"
LON_COL = "Longitude"
YEAR_COL = "Year"

# Process CSV in chunks
print("Processing CSV in chunks...")
for chunk in tqdm(pd.read_csv(INPUT_CSV, chunksize=CHUNK_SIZE)):
    # Filter rows with valid lat/lon and copy to avoid SettingWithCopyWarning
    chunk = chunk.dropna(subset=[LAT_COL, LON_COL, YEAR_COL]).copy()

    # Round coordinates safely
    chunk.loc[:, "lat_r"] = chunk[LAT_COL].round(3)
    chunk.loc[:, "lon_r"] = chunk[LON_COL].round(3)

    for _, row in chunk.iterrows():
        year = int(row[YEAR_COL])
        key = (row["lat_r"], row["lon_r"])
        heatmap_by_year[year][key] += 1

# Export each year as a JSON
print("Exporting JSONs...")
for year, loc_dict in heatmap_by_year.items():
    output = [
        {"lat": lat, "lon": lon, "count": count}
        for (lat, lon), count in loc_dict.items()
    ]
    with open(os.path.join(OUTPUT_DIR, f"heatmap_{year}.json"), "w") as f:
        json.dump(output, f)

print("✅ Done! JSON files are saved in:", OUTPUT_DIR)