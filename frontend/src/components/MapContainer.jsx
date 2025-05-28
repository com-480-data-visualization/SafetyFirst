// src/components/MapContainer.jsx
import React, { useState, useCallback } from "react";
import MapSection from "./MapSection";
import MapControls from "./MapControls";
import RouteAddressInput from "./RouteAddressInput";

const MapContainer = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState("WALKING");
  const [directions, setDirections] = useState(null);
  const [mapType, setMapType] = useState("hybrid"); // default to Satellite with labels

  // Handle map click to place origin/destination markers
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

  // Handle address selection for origin
  const handleOriginAddressSelect = useCallback((addressData) => {
    setOrigin({
      lat: addressData.lat,
      lng: addressData.lon,
      address: addressData.address
    });
  }, []);

  // Handle address selection for destination
  const handleDestinationAddressSelect = useCallback((addressData) => {
    setDestination({
      lat: addressData.lat,
      lng: addressData.lon,
      address: addressData.address
    });
  }, []);

  // Clear origin address
  const handleClearOrigin = useCallback(() => {
    setOrigin(null);
    setDirections(null);
  }, []);

  // Clear destination address
  const handleClearDestination = useCallback(() => {
    setDestination(null);
    setDirections(null);
  }, []);

  // Reset markers and route
  const handleReset = useCallback(() => {
    setOrigin(null);
    setDestination(null);
    setDirections(null);
  }, []);

  // Display coordinates in a clean way
  const formatCoords = (coords) =>
    coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "—";

  // Convert origin/destination to format expected by RouteAddressInput
  const getSelectedOriginAddress = () => {
    if (!origin) return null;
    return {
      lat: origin.lat,
      lon: origin.lng,
      address: origin.address || `${origin.lat.toFixed(6)}, ${origin.lng.toFixed(6)}`
    };
  };

  const getSelectedDestinationAddress = () => {
    if (!destination) return null;
    return {
      lat: destination.lat,
      lon: destination.lng,
      address: destination.address || `${destination.lat.toFixed(6)}, ${destination.lng.toFixed(6)}`
    };
  };

  return (
    <>
      {/* Title & Subtitle */}
      <div className="text-center mb-6">
        <h2 className="text-5xl sm:text-6xl font-heading font-bold text-primary mb-2">
          Plan Your Route
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Enter addresses or click the map to select your start and end points. Choose how you want to move. <br />
          We'll find the safest route.
        </p>
      </div>

      {/* Address Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Origin Address Input */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">A</span>
            Starting Point
          </h3>
          <RouteAddressInput
            onAddressSelect={handleOriginAddressSelect}
            selectedAddress={getSelectedOriginAddress()}
            onClearAddress={handleClearOrigin}
            placeholder="Enter starting address..."
          />
        </div>

        {/* Destination Address Input */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">B</span>
            Destination
          </h3>
          <RouteAddressInput
            onAddressSelect={handleDestinationAddressSelect}
            selectedAddress={getSelectedDestinationAddress()}
            onClearAddress={handleClearDestination}
            placeholder="Enter destination address..."
          />
        </div>
      </div>

      {/* Map Controls (transport + reset) */}
      <MapControls
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        onReset={handleReset}
        mapType={mapType}
        setMapType={setMapType} // still useful if you decide to expose type toggles later
      />

      {/* Google Map with directions */}
      <div className="mt-4 rounded-lg overflow-hidden border border-gray-300 shadow-subtle card">
        <MapSection
          origin={origin}
          destination={destination}
          travelMode={travelMode}
          onMapClick={handleMapClick}
          directions={directions}
          setDirections={setDirections}
          mapType={mapType}
        />
      </div>

      {/* Display Coordinates */}
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
          <p className="text-green-600 font-semibold mt-2">
            ✅ Ready to calculate the safest route!
          </p>
        )}
      </div>
    </>
  );
};

export default MapContainer;