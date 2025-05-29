// src/components/MapContainer.jsx
import React, { useState, useEffect, useCallback } from "react";
import MapSection from "./MapSection";
import MapControls from "./MapControls";
import RiskBadge from "./RiskBadge";
import {
  buildCrimeIndex,
  computeRiskScoreForRoute,
} from "../../../milestone3/crimeUtils";
import RouteAddressInput from "./RouteAddressInput";

const MapContainer = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState("WALKING");
  const [routes, setRoutes] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [crimeIndex, setCrimeIndex] = useState(null);
  const [mapType, setMapType] = useState("hybrid");

  // Load crime index once on mount
  useEffect(() => {
    fetch(`/SafetyFirst/crime_tiles_summary.json`)
      .then((res) => res.json())
      .then((data) => setCrimeIndex(buildCrimeIndex(data)))
      .catch((err) => console.error("Failed to load crime index:", err));
  }, []);

  // Click to set origin/destination
  const handleMapClick = useCallback(
    (e) => {
      const clicked = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      if (!origin) setOrigin(clicked);
      else if (!destination) setDestination(clicked);
    },
    [origin, destination]
  );

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

  const handleReset = useCallback(() => {
    setOrigin(null);
    setDestination(null);
    setRoutes([]);
    setHighlightedIndex(null);
  }, []);

  // Once routes are received from Google Maps API, enrich them
  const handleRoutesReceived = useCallback(
    (googleRoutes) => {
      if (!crimeIndex || !googleRoutes?.length) return;

      const enriched = googleRoutes.map((route) => {
        const { risk, riskDetails } = computeRiskScoreForRoute(route, crimeIndex);
        return {
          ...route,
          risk: typeof risk === "number" ? risk : 0.0,
          riskDetails: riskDetails || {},
        };
      });

      setRoutes(enriched);
      setHighlightedIndex(0); // Default highlight
    },
    [crimeIndex]
  );

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
    <section className="bg-gray-50 text-slate-800 py-8 px-4 sm:px-8 md:px-16 lg:px-32 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-5xl sm:text-6xl font-heading font-bold text-primary mb-2">
          Plan Your Route
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Enter addresses or click the map to select your start and end points. Choose how you want to move. <br />
          We'll show you your options with safety and efficiency in mind.
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

      {/* Map Controls */}
      <MapControls
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        onReset={handleReset}
        mapType={mapType}
        setMapType={setMapType}
      />

      {/* Map */}
      <div className="mt-4 rounded-lg overflow-hidden border border-gray-300 shadow-subtle card">
        <MapSection
          origin={origin}
          destination={destination}
          travelMode={travelMode}
          onMapClick={handleMapClick}
          routes={routes}
          highlightedIndex={highlightedIndex}
          mapType={mapType}
          setMapType={setMapType}
          onRoutesReady={handleRoutesReceived}
        />
      </div>

      {/* Info */}
      <div className="mt-4 text-center text-sm text-slate-600 space-y-1">
        <p>
          <span className="text-slate-800 font-medium">Origin:</span> {formatCoords(origin)}
        </p>
        <p>
          <span className="text-slate-800 font-medium">Destination:</span> {formatCoords(destination)}
        </p>
        {origin && destination && (
          <p className="text-green-600 font-semibold mt-2">
            ✅ Routes loaded. Below are your options with detailed scores.
          </p>
        )}
      </div>

      {/* Score Explanation */}
      <div className="text-center text-sm text-slate-500 mt-4">
        <p>Risk Score ranges from 0 (safest) to 1 (most dangerous).</p>
        <p>
          <span className="text-green-600 font-semibold">0.00-0.33</span> = Safe,{" "}
          <span className="text-yellow-500 font-semibold">0.34-0.66</span> = Moderate,{" "}
          <span className="text-red-600 font-semibold">0.67-1.00</span> = Dangerous
        </p>
      </div>

      {routes.length > 0 && (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div
              key={`route-summary-${index}`}
              onClick={() => setHighlightedIndex(index)}
              className={`cursor-pointer rounded-2xl border px-6 py-4 shadow-md flex flex-col items-center gap-3 text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white ${
                index === highlightedIndex ? "ring-2 ring-green-500 shadow-lg" : ""
              }`}
            >
              <h4 className="font-bold text-lg text-slate-700">Route {index + 1}</h4>
              <RiskBadge risk={route.risk} />
              <div className="flex gap-6 text-sm text-slate-700 mt-2">
                <div>
                  <span className="block text-slate-500 text-xs">Distance</span>
                  <span className="font-semibold">{route.legs[0].distance.text}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-xs">ETA</span>
                  <span className="font-semibold">{route.legs[0].duration.text}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MapContainer;