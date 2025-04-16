// src/components/MapContainer.jsx
import React, { useState, useCallback } from "react";
import MapSection from "./MapSection";
import MapControls from "./MapControls";

const MapContainer = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState("WALKING");

  const handleMapClick = useCallback((e) => {
    const clicked = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    if (!origin) {
      setOrigin(clicked);
    } else if (!destination) {
      setDestination(clicked);
    }
  }, [origin, destination]);

  const handleReset = useCallback(() => {
    setOrigin(null);
    setDestination(null);
  }, []);

  const formatCoords = (coords) =>
    coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "—";

  return (
    <section
      id="map"
      className="bg-gray-50 text-slate-800 py-8 px-4 sm:px-8 md:px-16 lg:px-32 relative animate-fadeIn"
    >
      {/* Title & Subtitle */}
      <div className="text-center mb-4">
        <h2 className="text-5xl sm:text-6xl font-heading font-bold text-primary mb-2">
          Plan Your Route
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Click the map to select your start and end points. Choose how you want to move.
          We'll find the safest route.
        </p>
      </div>

      {/* Map Controls */}
      <MapControls
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        onReset={handleReset}
        className="bg-gray-200 text-slate-800 py-2 px-4 rounded-lg shadow-md"
      />

      {/* Interactive Map */}
      <div className="mt-4 rounded-lg overflow-hidden border border-gray-300 shadow-subtle card">
        <MapSection
          origin={origin}
          destination={destination}
          travelMode={travelMode}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Coordinates Display (Optional UX) */}
      <div className="mt-4 text-center text-sm text-slate-600 space-y-1">
        <p>
          <span className="text-slate-800 font-medium">Origin:</span>{" "}
          {formatCoords(origin)}
        </p>
        <p>
          <span className="text-slate-800 font-medium">Destination:</span>{" "}
          {formatCoords(destination)}
        </p>
        {origin && destination && (
          <p className="text-success font-medium mt-2">Ready to calculate the safest route!</p>
        )}
      </div>
    </section>
  );
};

export default MapContainer;