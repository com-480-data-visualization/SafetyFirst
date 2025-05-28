// src/components/MapContainer.jsx
import React, { useState, useEffect, useCallback } from "react";
import MapSection from "./MapSection";
import MapControls from "./MapControls";
import RiskBadge from "./RiskBadge";
import {
  buildCrimeIndex,
  computeRiskScoreForRoute,
} from "../../../milestone3/crimeUtils";

const MapContainer = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState("WALKING");
  const [routes, setRoutes] = useState([]);
  const [crimeIndex, setCrimeIndex] = useState(null);
  const [mapType, setMapType] = useState("hybrid");

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

      setRoutes(enrichedRoutes);
    },
    [crimeIndex]
  );

  const formatCoords = (coords) =>
    coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "—";

  return (
    <section
      id="map"
      className="bg-gray-50 text-slate-800 py-8 px-4 sm:px-8 md:px-16 lg:px-32 relative animate-fadeIn"
    >
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-5xl sm:text-6xl font-heading font-bold text-primary mb-2">
          Plan Your Route
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Click the map to select your start and end points. Choose how you want to move. <br />
          We'll show you your options with safety and efficiency in mind.
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
            ✅ Routes loaded. Below are your options with detailed scores.
          </p>
        )}
      </div>

      {/* All Routes Displayed */}
      {routes.length > 0 && (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div
              key={`route-summary-${index}`}
              className="rounded-2xl border bg-white px-6 py-4 shadow-md flex flex-col items-center gap-3 text-center hover:shadow-lg transition"
            >
              <h4 className="font-bold text-lg text-slate-700">Route {index + 1}</h4>
              <RiskBadge risk={route.risk} />
              <div className="flex gap-6 text-sm text-slate-700">
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
