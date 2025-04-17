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
      .map((d) => [d.lat, d.lon, 0.1]); // all weights = 0.1    

    const heat = window.L.heatLayer(heatPoints, {
      radius: 20,
      blur: 25,
      minOpacity: 0.2,
      gradient: {
        0.1: "#3498db",   // blue
        0.2: "#9b59b6",   // purple
        0.6: "#f1c40f",   // yellow
        0.9: "#e67e22",   // orange
        1.0: "#e74c3c",   // red
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