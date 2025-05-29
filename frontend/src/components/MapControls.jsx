// src/components/MapControls.jsx
import React from "react";
import {
  Car,
  Bike,
  Footprints,
  RotateCcw,
  CircleChevronRight,
  MapPinX,
} from "lucide-react";

const travelModes = [
  { label: "WALKING", value: "WALKING", icon: <Footprints size={18} /> },
  { label: "DRIVING", value: "DRIVING", icon: <Car size={18} /> },
  { label: "BICYCLING", value: "BICYCLING", icon: <Bike size={18} /> },
];

const MapControls = ({ travelMode, setTravelMode, onReset, originInput, destInput }) => {
  return (
    <div className="w-full bg-white shadow-xl border rounded-xl p-4 backdrop-blur-sm animate-fadeIn">

      {/* Travel Modes Row */}
      <div className="flex justify-center gap-3 mb-4">
        {travelModes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => setTravelMode(mode.value)}
            className={`p-2 rounded-full border transition-all duration-200 ${
              travelMode === mode.value
                ? "bg-blue-600 text-white border-blue-600 scale-110 shadow-md"
                : "bg-white text-slate-700 border-gray-300 hover:bg-slate-100"
            }`}
            aria-label={`Travel mode: ${mode.label}`}
          >
            {mode.icon}
          </button>
        ))}
      </div>

      {/* Origin & Destination Inputs Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Origin */}
        <div className="flex items-center gap-2 w-full">
          <CircleChevronRight size={18} className="text-green-600" />
          {originInput}
        </div>

        {/* Destination */}
        <div className="flex items-center gap-2 w-full">
          <MapPinX size={18} className="text-red-600" />
          {destInput}
        </div>
      </div>

      {/* Reset Button Centered Below */}
      <div className="flex justify-center mt-4">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold shadow-md transition-all duration-150 flex items-center gap-2"
          aria-label="Reset Points"
        >
          <RotateCcw size={16} />
          Reset Points
        </button>
      </div>
    </div>
  );
};

export default MapControls;
