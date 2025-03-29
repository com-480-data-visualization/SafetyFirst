// src/components/MapContainer.jsx
import React, { useState } from "react";
import MapSection from "./MapSection";
import MapControls from "./MapControls";

const MapContainer = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState("WALKING");

  const handleMapClick = (e) => {
    const clicked = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    if (!origin) {
      setOrigin(clicked);
    } else if (!destination) {
      setDestination(clicked);
    } else {
      // If both are set, do nothing or prompt reset
    }
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
  };

  return (
    <section
      id="map"
      className="bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-red-500 mb-4">
          Plan Your Escape
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Click the map to select your start and end points. Choose how you want to move. We'll find the safest route.
        </p>
      </div>

      {/* Map Controls */}
      <MapControls
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        onReset={handleReset}
      />

      {/* Interactive Map */}
      <div className="mt-8 rounded-xl overflow-hidden border-4 border-red-500 shadow-lg">
        <MapSection
          origin={origin}
          destination={destination}
          travelMode={travelMode}
          onMapClick={handleMapClick}
        />
      </div>
    </section>
  );
};

export default MapContainer;
