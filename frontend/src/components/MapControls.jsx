// src/components/MapControls.jsx
import React from "react";
import { Car, Bike, Footprints, RotateCcw } from "lucide-react";

const travelModes = [
  { label: "On Foot", value: "WALKING", icon: <Footprints size={24} /> },
  { label: "By Car", value: "DRIVING", icon: <Car size={24} /> },
  { label: "By Bike", value: "BICYCLING", icon: <Bike size={24} /> },
];

const MapControls = ({ travelMode, setTravelMode, onReset }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/80 border border-red-500 rounded-xl text-slate-800 shadow-xl backdrop-blur-md mt-8 animate-fadeIn">
      
      {/* Travel Mode Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <span className="text-sm text-gray-400 font-semibold tracking-wider mr-2">Travel Mode:</span>
        <div className="flex gap-2">
          {travelModes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setTravelMode(mode.value)}
              className={`flex items-center justify-center px-4 py-2 rounded-lg border transition shadow-subtle font-semibold text-base
                ${travelMode === mode.value
                  ? 'bg-primary text-white border-primary scale-110 shadow-lg'
                  : 'bg-white text-slate-800 border-gray-300 hover:bg-slate-100'}
              `}
              aria-pressed={travelMode === mode.value}
            >
              {mode.icon}
            </button>
          ))}
        </div>
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