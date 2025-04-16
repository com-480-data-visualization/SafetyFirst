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
    // Optionally add an else clause to notify user or auto-reset
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
      className="bg-midnight text-gray-100 py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative animate-fadeIn"
    >
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-red-500 mb-4 text-glow">
          Plan Your Escape
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Click the map to select your start and end points. Choose how you want to move.
          We’ll find the safest route.
        </p>
      </div>

      {/* Map Controls */}
      <MapControls
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        onReset={handleReset}
      />

      {/* Interactive Map */}
      <div className="mt-8 rounded-xl overflow-hidden border-4 border-red-500 shadow-lg hover:shadow-red-700 transition-all">
        <MapSection
          origin={origin}
          destination={destination}
          travelMode={travelMode}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Coordinates Display (Optional UX) */}
      <div className="mt-6 text-center text-sm text-gray-400 space-y-1">
        <p>
          <span className="text-white font-semibold">Origin:</span>{" "}
          {formatCoords(origin)}
        </p>
        <p>
          <span className="text-white font-semibold">Destination:</span>{" "}
          {formatCoords(destination)}
        </p>
        {origin && destination && (
          <p className="text-green-400 font-medium mt-2">Ready to calculate the safest route!</p>
        )}
      </div>
    </section>
  );
};

export default MapContainer;