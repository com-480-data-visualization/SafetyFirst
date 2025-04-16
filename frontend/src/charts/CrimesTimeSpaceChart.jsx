import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";

const chicagoCenter = [41.8781, -87.6298];

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 18,
      maxZoom: 15,
      gradient: {
        0.0: "#1e3a8a",   // deep blue
        0.1: "#3b82f6",   // sky blue
        0.2: "#facc15",   // golden yellow
        0.4: "#f59e0b",   // amber orange
        0.6: "#f97316",   // vibrant orange
        0.7: "#ef4444",   // red
        0.9: "#b91c1c",   // blood red
        1.0: "#7f1d1d",   // dark burgundy
      }            
    });

    heatLayer.addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
};

const CrimesTimeSpaceChart = () => {
  const [year, setYear] = useState(2023);
  const [heatData, setHeatData] = useState([]);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await fetch(`/heatmap_data/heatmap_${year}.json`);
        const json = await res.json();

        const valid = json.filter((item) => item.count > 1);
        const maxCount = Math.max(...valid.map((d) => d.count), 1);

        const points = valid.map((item) => [
          parseFloat(item.lat),
          parseFloat(item.lon),
          item.count / maxCount, // normalized [0, 1]
        ]);

        setHeatData(points);
      } catch (err) {
        console.error(`Failed to load heatmap_${year}.json`, err);
        setHeatData([]);
      }
    };

    fetchHeatmap();
  }, [year]);

  return (
    <section
      id="heatmap"
      className="bg-black text-white py-20 px-4 sm:px-8 md:px-16 lg:px-32"
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-red-500 mb-4 text-glow">
          Chicago Crime Heatmap
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Explore how Chicago's crime hotspots evolve from 2001 to 2025. The colors represent
          relative intensity within each year.
        </p>
      </div>

      <div className="h-[600px] rounded-xl overflow-hidden border-4 border-red-500 shadow-xl">
        <MapContainer
          center={chicagoCenter}
          zoom={11}
          scrollWheelZoom={true}
          className="w-full h-full z-10"
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />
          <HeatmapLayer points={heatData} />
        </MapContainer>
      </div>

      <div className="mt-10 max-w-3xl mx-auto bg-gray-900/80 p-6 rounded-xl border border-red-500 shadow-md backdrop-blur">
        <label className="block text-center text-sm font-semibold text-red-400 mb-2">
          Year: {year}
        </label>
        <input
          type="range"
          min={2001}
          max={2025}
          step={1}
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="w-full accent-red-500"
        />
      </div>
    </section>
  );
};

export default CrimesTimeSpaceChart;