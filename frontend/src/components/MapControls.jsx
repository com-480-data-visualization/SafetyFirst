// src/components/MapControls.jsx
import React from "react";
import { Car, Bike, Footprints, RotateCcw } from "lucide-react";

const travelModes = [
  { label: "On Foot", value: "WALKING", icon: <Footprints size={16} /> },
  { label: "By Car", value: "DRIVING", icon: <Car size={16} /> },
  { label: "By Bike", value: "BICYCLING", icon: <Bike size={16} /> },
];

const MapControls = ({ travelMode, setTravelMode, onReset }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-black/40 border border-red-500 rounded-xl text-white shadow-xl backdrop-blur-md max-w-4xl mx-auto mt-8 animate-fadeIn">
      
      {/* Travel Mode Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <label
          htmlFor="travelModeSelect"
          className="text-sm text-gray-300 font-semibold tracking-wider flex items-center gap-2"
        >
          Travel Mode:
        </label>
        <select
          id="travelModeSelect"
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
        >
          {travelModes.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="px-6 py-2 bg-red-600 hover:bg-red-500 transition rounded-lg text-sm font-semibold tracking-wide shadow-lg flex items-center gap-2 hover:scale-105"
        aria-label="Reset origin and destination points"
      >
        <RotateCcw size={16} /> Reset Points
      </button>
    </div>
  );
};

export default MapControls;