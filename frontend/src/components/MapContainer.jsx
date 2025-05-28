// src/components/MapContainer.jsx
import React, { useState, useEffect, useCallback } from "react";
import MapSection from "./MapSection";
import MapControls from "./MapControls";
import RiskBadge from "./RiskBadge";
import CrimePieChart from "./CrimePieChart";
import {
  buildCrimeIndex,
  computeRiskScoreForRoute,
} from "../../../milestone3/crimeUtils";

const MapContainer = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState("WALKING");
  const [routes, setRoutes] = useState([]);
  const [safestIndex, setSafestIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [crimeIndex, setCrimeIndex] = useState(null);
  const [mapType, setMapType] = useState("hybrid");
  const [optimizeBy, setOptimizeBy] = useState("safest"); // or "shortest"

  // Load crime index once
  useEffect(() => {
    fetch(`/SafetyFirst/crime_tiles_summary.json`)
      .then((res) => res.json())
      .then((data) => setCrimeIndex(buildCrimeIndex(data)))
      .catch((err) => console.error("Failed to load crime index:", err));
  }, []);

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

  const handleReset = useCallback(() => {
    setOrigin(null);
    setDestination(null);
    setRoutes([]);
    setSafestIndex(null);
    setSelectedIndex(null);
  }, []);

  const handleRoutesReceived = useCallback(
    (googleRoutes) => {
      if (!crimeIndex || !googleRoutes?.length) return;

      const enrichedRoutes = googleRoutes.map((route) => {
        const { risk, riskDetails } = computeRiskScoreForRoute(route, crimeIndex);
        return {
          ...route,
          risk: typeof risk === 'number' ? risk : 0, // ensure it's valid
          riskDetails: riskDetails || {},
        };
      });

      let safest = 0;
      let shortest = 0;

      enrichedRoutes.forEach((route, index) => {
        if (route.risk < enrichedRoutes[safest].risk) safest = index;
        if (route.legs[0].distance.value < enrichedRoutes[shortest].legs[0].distance.value)
          shortest = index;
      });

      setRoutes(enrichedRoutes);
      setSafestIndex(safest);

      // Default selected based on current toggle
      setSelectedIndex(optimizeBy === "shortest" ? shortest : safest);
    },
    [crimeIndex]
  );

  const formatCoords = (coords) =>
    coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "—";

  const selectedRoute = routes[selectedIndex];

  return (
    <>
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-5xl sm:text-6xl font-heading font-bold text-primary mb-2">
          Plan Your Route
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Click the map to select your start and end points. Choose how you want to move. <br />
          We'll find the safest route.
        </p>
      </div>

      {/* Map Controls */}
      <MapControls
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        onReset={handleReset}
        mapType={mapType}
        setMapType={setMapType}
      />

      {/* Map Section */}
      <div className="mt-4 rounded-lg overflow-hidden border border-gray-300 shadow-subtle card">
        <MapSection
          origin={origin}
          destination={destination}
          travelMode={travelMode}
          onMapClick={handleMapClick}
          routes={routes}
          safestIndex={safestIndex}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          mapType={mapType}
          setMapType={setMapType}
          onRoutesReady={handleRoutesReceived}
        />
      </div>

      {/* Coordinates Display */}
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
            ✅ Routes loaded. Click a route to see crime risk and breakdown.
          </p>
        )}
      </div>

      {/* Toggle for Safest/Shortest */}
      {origin && destination && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <span className="text-slate-700 font-medium">Choose:</span>
          <div className="flex items-center space-x-2 bg-white shadow border rounded-xl px-2 py-1">
            <button
              onClick={() => {
                setOptimizeBy("safest");
                setSelectedIndex(safestIndex);
              }}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                optimizeBy === "safest"
                  ? "bg-green-500 text-white shadow"
                  : "text-slate-100 hover:bg-slate-100"
              }`}
            >
              Safest
            </button>
            <button
              onClick={() => {
                const shortest = routes.reduce((minIdx, r, idx, arr) =>
                  r.legs[0].distance.value < arr[minIdx].legs[0].distance.value
                    ? idx
                    : minIdx
                , 0);
                setOptimizeBy("shortest");
                setSelectedIndex(shortest);
              }}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                optimizeBy === "shortest"
                  ? "bg-blue-500 text-white shadow"
                  : "text-slate-100 hover:bg-slate-100"
              }`}
            >
              Shortest
            </button>
          </div>
        </div>
      )}


      {/* Route Score Display */}
      {selectedRoute && (
        <div className="mt-6 flex justify-center flex-wrap gap-4 items-center">
          {/* Risk Score */}
          <RiskBadge risk={selectedRoute.risk} />

          {/* Distance & ETA */}
          <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-5 py-3 border rounded-2xl shadow text-slate-800 text-sm sm:text-base">
            <div className="flex flex-col items-center">
              <span className="text-slate-500 text-xs">Distance</span>
              <span className="font-bold text-slate-700">
                {selectedRoute.legs[0].distance.text}
              </span>
            </div>
            <div className="w-px bg-slate-300 h-6" />
            <div className="flex flex-col items-center">
              <span className="text-slate-500 text-xs">ETA</span>
              <span className="font-bold text-slate-700">
                {selectedRoute.legs[0].duration.text}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Crime Pie Chart */}
      {selectedRoute?.riskDetails && (
        <CrimePieChart data={selectedRoute.riskDetails} />
      )}
    </>
  );
};

export default MapContainer;