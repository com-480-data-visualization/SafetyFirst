// src/components/MapContainer.jsx
import React, { useState, useEffect, useCallback } from "react";
import MapSection from "./MapSection";
import RiskBadge from "./RiskBadge";
import RouteAddressInput from "./RouteAddressInput";
import {
  Car,
  Bike,
  Footprints,
  RotateCcw,
  CircleChevronRight,
  MapPinX,
} from "lucide-react";
import {
  buildCrimeIndex,
  computeRiskScoreForRoute,
} from "../../../milestone3/crimeUtils";

const travelModes = [
  { icon: <Footprints size={18} />, value: "WALKING" },
  { icon: <Car size={18} />, value: "DRIVING" },
  { icon: <Bike size={18} />, value: "BICYCLING" },
];

const MapContainer = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState("WALKING");
  const [routes, setRoutes] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [crimeIndex, setCrimeIndex] = useState(null);
  const [mapType, setMapType] = useState("hybrid");

  const routeColors = ["#06b6d4", "#a3e635", "#2563eb"]; // cyan, lime, blue

  useEffect(() => {
    fetch(`/SafetyFirst/crime_tiles_summary.json`)
      .then((res) => res.json())
      .then((data) => setCrimeIndex(buildCrimeIndex(data)))
      .catch((err) => console.error("Failed to load crime index:", err));
  }, []);

  const handleMapClick = useCallback((e) => {
    const clicked = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (!origin) setOrigin(clicked);
    else if (!destination) setDestination(clicked);
  }, [origin, destination]);

  const handleOriginAddressSelect = useCallback((addressData) => {
    setOrigin({ lat: addressData.lat, lng: addressData.lon, address: addressData.address });
  }, []);

  const handleDestinationAddressSelect = useCallback((addressData) => {
    setDestination({ lat: addressData.lat, lng: addressData.lon, address: addressData.address });
  }, []);

  const handleReset = useCallback(() => {
    setOrigin(null);
    setDestination(null);
    setRoutes([]);
    setHighlightedIndex(null);
  }, []);

  const handleRoutesReceived = useCallback((googleRoutes) => {
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
  }, [crimeIndex]);

  const getSelectedOriginAddress = () => origin && ({
    lat: origin.lat,
    lon: origin.lng,
    address: origin.address || `${origin.lat.toFixed(6)}, ${origin.lng.toFixed(6)}`
  });

  const getSelectedDestinationAddress = () => destination && ({
    lat: destination.lat,
    lon: destination.lng,
    address: destination.address || `${destination.lat.toFixed(6)}, ${destination.lng.toFixed(6)}`
  });

  return (
    <section className="bg-gray-50 text-slate-800 py-4 px-4 sm:px-8 md:px-16 lg:px-32 animate-fadeIn">

      {/* Travel + Input Panel */}
      <div className="bg-white/90 border border-gray-200 shadow-md rounded-2xl px-4 py-4 mb-4 animate-fadeIn">

        {/* Travel Modes + Reset Button */}
        <div className="flex justify-center items-center gap-3 mb-4">
          {travelModes.map(({ icon, value }) => (
            <button
              key={value}
              onClick={() => setTravelMode(value)}
              className={`rounded-full p-2 border transition-all duration-200 ${
                travelMode === value
                  ? "bg-blue-600 text-white border-blue-600 scale-110 shadow-md"
                  : "bg-white text-slate-700 border-gray-300 hover:bg-slate-100"
              }`}
              title={value.toLowerCase()}
            >
              {icon}
            </button>
          ))}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-md transition-all duration-150"
            title="Reset Points"
            aria-label="Reset Points"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Input Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Origin */}
          <div className="flex items-center gap-2 w-full">
            <CircleChevronRight className="text-green-600" size={18} />
            <RouteAddressInput
              onAddressSelect={handleOriginAddressSelect}
              selectedAddress={getSelectedOriginAddress()}
              placeholder="Starting point"
            />
          </div>

          {/* Destination */}
          <div className="flex items-center gap-2 w-full">
            <MapPinX className="text-red-600" size={18} />
            <RouteAddressInput
              onAddressSelect={handleDestinationAddressSelect}
              selectedAddress={getSelectedDestinationAddress()}
              placeholder="Destination"
            />
          </div>
        </div>
      </div>

      {/* Map and Route Cards Side-by-Side */}
      <div className="mt-4 flex flex-col lg:flex-row gap-4">
        {/* Route Cards on the left */}
        {routes.length > 0 && (
          <div className="w-full lg:w-[320px] flex flex-col gap-4">
            {routes.map((route, index) => {
              const color = routeColors[index % routeColors.length];

              return (
                <div
                  key={`route-summary-${index}`}
                  onClick={() => setHighlightedIndex(index)}
                  className={`cursor-pointer rounded-2xl border px-6 py-4 shadow-md flex flex-col items-center gap-3 text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white ${
                    index === highlightedIndex ? "ring-2 ring-green-500 shadow-lg" : ""
                  }`}
                >
                  {/* Color-coded Route Label */}
                  <span
                    className="px-4 py-1 rounded-full font-semibold text-white text-sm"
                    style={{ backgroundColor: color }}
                  >
                    Route {index + 1}
                  </span>

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
              );
            })}
          </div>


        )}

        {/* Map on the right */}
        <div className="flex-1 rounded-lg overflow-hidden border border-gray-300 shadow-subtle">
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
      </div>

      {/* Score Legend */}
      <div className="text-center text-sm text-slate-500 mt-4">
        <p>Risk Score ranges from 0 (safest) to 1 (most dangerous).</p>
        <p>
          <span className="text-green-600 font-semibold">0.00-0.20</span> = Safe,{" "}
          <span className="text-yellow-500 font-semibold">0.21-0.40</span> = Moderate,{" "}
          <span className="text-red-600 font-semibold">0.41-1.00</span> = Dangerous
        </p>
      </div>
    </section>
  );
};

export default MapContainer;
