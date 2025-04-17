import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const centerChicago = [41.8781, -87.6298];

const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
  
    try {
      const aggregated = {};
      points.forEach(({ lat, lon }) => {
        if (lat == null || lon == null) return;
        const key = `${lat.toFixed(5)},${lon.toFixed(5)}`;
        if (!aggregated[key]) aggregated[key] = { lat, lon, count: 0 };
        aggregated[key].count += 1;
      });
  
      const aggregatedPoints = Object.values(aggregated);
  
      // Limit to first 20,000 for performance (or tweak as needed)
      const limitedPoints = aggregatedPoints.slice(0, 20000);
      const maxCount = Math.max(...limitedPoints.map((p) => p.count)) || 1;
  
      const heatPoints = limitedPoints.map((p) => [
        p.lat,
        p.lon,
        p.count / maxCount,
      ]);
  
      const heat = window.L.heatLayer(heatPoints, {
        radius: 20,
        blur: 15,
        minOpacity: 0.15,
        gradient: {
          0.0: "#00ff00",
          0.2: "#adff2f",
          0.4: "#ffff00",
          0.6: "#ffa500",
          0.8: "#ff4500",
          1.0: "#ff0000",
        },
      });
  
      heat.addTo(map);
  
      return () => {
        map.removeLayer(heat);
      };
    } catch (err) {
      console.error("❌ Error generating heatmap:", err);
    }
  }, [map, points]);  

  return null;
};

const HeatmapMap = ({ points }) => {
  return (
    <MapContainer
      center={centerChicago}
      zoom={11}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
      />
      <HeatLayer points={points} />
    </MapContainer>
  );
};

export default HeatmapMap;