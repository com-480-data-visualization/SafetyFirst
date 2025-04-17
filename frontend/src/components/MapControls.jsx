// src/components/MapControls.jsx
import React from "react";
import { Car, Bike, Footprints, RotateCcw } from "lucide-react";

const travelModes = [
  { label: "On Foot", value: "WALKING", icon: <Footprints size={20} /> },
  { label: "By Car", value: "DRIVING", icon: <Car size={20} /> },
  { label: "By Bike", value: "BICYCLING", icon: <Bike size={20} /> },
];

const MapControls = ({ travelMode, setTravelMode, onReset }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/80 border border-red-500 rounded-xl text-slate-800 shadow-xl backdrop-blur-md mt-8 animate-fadeIn">
      
      {/* Travel Mode Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <span className="text-sm font-semibold tracking-wide text-gray-600">
          Travel Mode:
        </span>
        <div className="flex gap-2">
          {travelModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setTravelMode(mode.value)}
              aria-pressed={travelMode === mode.value}
              aria-label={`Travel by ${mode.label}`}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all shadow-sm
                ${travelMode === mode.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                  : 'bg-white text-slate-800 border-gray-300 hover:bg-slate-100'}
              `}
            >
              {mode.icon}
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold shadow-md transition-transform duration-200 flex items-center gap-2 hover:scale-105"
        aria-label="Reset origin and destination points"
      >
        <RotateCcw size={16} /> Reset Points
      </button>
    </div>
  );
};

export default MapControls;