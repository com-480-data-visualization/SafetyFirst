import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const defaultCenterChicago = [41.8781, -87.6298];


const chicagoBounds = [
  [41.62, -88.00],  // SW corner (lat, lng)
  [42.08, -87.45],  // NE corner (lat, lng)
];

// Component to update map view when center/zoom changes
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, {
        duration: 1.5
      });
    }
  }, [map, center, zoom]);
  
  return null;
};

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

const HeatmapMap = ({ points, center = defaultCenterChicago, zoom = 11 }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={zoom}               // prevent zooming out past the initial level
      maxBounds={chicagoBounds}    // lock panning to Chicago bounds
      maxBoundsViscosity={1.0}     // no “bounce” past the bounds
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
      />
      <MapViewController center={center} zoom={zoom} />
      <HeatLayer points={points} />
    </MapContainer>
  );
};

export default HeatmapMap;