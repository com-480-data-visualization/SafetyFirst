import csv
import json
from datetime import datetime
import os

# Configuration
CSV_FILE = "Crimes_-_2001_to_Present.csv"  # Replace with your actual file name
OUTPUT_DIR = "heatmap_data_full"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Format in the CSV file
DATE_FORMAT = "%m/%d/%Y %I:%M:%S %p"

# Range of years
START_YEAR = 2001
END_YEAR = 2025

# Read and filter the CSV
filtered_by_year = {year: [] for year in range(START_YEAR, END_YEAR + 1)}

with open(CSV_FILE, encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        try:
            # Parse datetime
            raw_date = row["Date"]
            dt = datetime.strptime(raw_date, DATE_FORMAT)

            # Filter year
            year = dt.year
            if not (START_YEAR <= year <= END_YEAR):
                continue

            # Check coordinates
            lat = row["Latitude"]
            lon = row["Longitude"]
            if not lat or not lon:
                continue

            # Append relevant info
            filtered_by_year[year].append({
                "lat": float(lat),
                "lon": float(lon),
                "datetime": dt.strftime("%Y-%m-%d %H:%M:%S"),
                "primary_type": row["Primary Type"].strip().upper()
            })

        except Exception as e:
            continue  # skip malformed rows

# Save one file per year
for year, data in filtered_by_year.items():
    path = os.path.join(OUTPUT_DIR, f"heatmap_full_{year}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f)

print(f"✅ Export complete. Files saved to `{OUTPUT_DIR}`.")
