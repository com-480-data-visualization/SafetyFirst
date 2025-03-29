// src/components/MapControls.jsx
import React, { useState } from "react";

const MapControls = ({ travelMode, setTravelMode, onReset }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-black/40 border border-red-500 rounded-xl text-white shadow-xl backdrop-blur-md max-w-4xl mx-auto mt-8">
      
      {/* Travel Mode Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <label className="text-sm text-gray-300 font-semibold tracking-wider">
          Travel Mode:
        </label>
        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="WALKING">On Foot</option>
          <option value="DRIVING">By Car</option>
          <option value="BICYCLING">By Bike</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="px-6 py-2 bg-red-600 hover:bg-red-500 transition rounded-lg text-sm font-semibold tracking-wide shadow-lg"
      >
        Reset Points
      </button>
    </div>
  );
};

export default MapControls;
