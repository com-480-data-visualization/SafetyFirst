// src/components/RouteLegend.jsx
import React from "react";

const RouteLegend = () => {
  const legendItems = [
    { color: "#16a34a", label: "Route 1" },     // green
    { color: "#facc15", label: "Route 2" },         // yellow
    { color: "#ef4444", label: "Route 3" } // red
  ];

  return (
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md shadow-md border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-800 z-50">
      <ul className="space-y-1">
        {legendItems.map(({ color, label }, i) => (
          <li key={i} className="flex items-center space-x-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteLegend;
