// src/components/RouteLegend.jsx
import React from "react";

const RouteLegend = () => {
  const legendItems = [
    { color: "#06b6d4", label: "Route 1" },      // cyan
    { color: "#a3e635", label: "Route 2" },  // lime green
    { color: "#2563eb", label: "Route 3" }      // blue
  ];

  return (
    <div className="absolute bottom-4 left-4 z-50 rounded-2xl border border-slate-200 bg-white/80 dark:bg-black/60 backdrop-blur-xl shadow-xl p-4 text-sm text-slate-800 dark:text-slate-100 transition-all duration-300 hover:scale-[1.02]">
      <ul className="space-y-2">
        {legendItems.map(({ color, label }, i) => (
          <li key={i} className="flex items-center space-x-3 group">
            <span className="relative">
              <span
                className="inline-block w-4 h-4 rounded-full shadow-md"
                style={{ backgroundColor: color }}
              />
              <span
                className="absolute inset-0 animate-ping rounded-full"
                style={{
                  backgroundColor: color,
                  opacity: 0.3,
                }}
              />
            </span>
            <span className="group-hover:font-medium transition">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteLegend;
