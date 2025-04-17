import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const centerChicago = [41.8781, -87.6298];

const HeatLayer = ({ points }) => {
  const map = useMap();
  

  useEffect(() => {
    const heatPoints = points
      .filter((d) => d.lat && d.lon)
      .map((d) => [d.lat, d.lon, 0.5]); // all weights = 0.5

    const heat = window.L.heatLayer(heatPoints, {
      radius: 25,
      blur: 20,
      minOpacity: 0.4,
      gradient: {
        0.0: "#00ff00",   // Safe (green)
        0.2: "#ffff00",   // Caution (yellow)
        0.5: "#ff9900",   // Warning (orange)
        0.8: "#ff4500",   // Dangerous (deep orange/red)
        1.0: "#ff0000",   // Very dangerous (red)
      },      
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat); // Cleanup
    };
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