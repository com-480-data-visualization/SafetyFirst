import React, { useEffect, useState } from "react";

const YearTimeControls = ({ year, setYear, timeRange, setTimeRange }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  const handleTimeChange = (start, end) => {
    setTimeRange([start, end]);
  };

  // Highlight when timeRange or year changes externally (from scenario selection)
  useEffect(() => {
    setIsHighlighted(true);
    const timer = setTimeout(() => setIsHighlighted(false), 1000);
    return () => clearTimeout(timer);
  }, [timeRange, year]);

  // Calculate if this is an overnight range
  const isOvernightRange = timeRange[0] > timeRange[1];
  return (
    <div
      className={`
        bg-white/90 backdrop-blur-sm border shadow-md 
        rounded-lg px-8 py-4 mb-4 transition-all duration-300
      `}
    >
      <div className="flex justify-center items-center gap-8 w-full">
        
        {/* Time controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            Time
          </span>
          <select
            value={timeRange[0]}
            onChange={e => handleTimeChange(+e.target.value, timeRange[1])}
            className={`
              w-20 px-2 py-1 border rounded text-xs bg-white
              focus:outline-none focus:ring-1 focus:ring-red-500 transition-all
              ${isHighlighted ? 'border-red-500' : 'border-gray-300'}
            `}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}:00
              </option>
            ))}
          </select>
          <select
            value={timeRange[1]}
            onChange={e => handleTimeChange(timeRange[0], +e.target.value)}
            className={`
              w-20 px-2 py-1 border rounded text-xs bg-white
              focus:outline-none focus:ring-1 focus:ring-red-500 transition-all
              ${isHighlighted ? 'border-red-500' : 'border-gray-300'}
            `}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>
  
        {/* Year controls */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            Year
          </span>
  
          {/* fixed 384px slider, never shrinks */}
          <div className="relative w-96 flex-shrink-0">
            <input
              type="range"
              min={2001}
              max={2025}
              step={1}
              value={year}
              onChange={e => setYear(+e.target.value)}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{ background: "#e5e7eb" }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>2001</span>
              <span>2025</span>
            </div>
          </div>
  
          <span
            className={`
              text-sm font-bold text-gray-800 px-3 py-1 rounded border
              min-w-[60px] text-center transition-all
              ${isHighlighted 
                 ? 'bg-red-100 border-red-300' 
                 : 'bg-red-50 border-red-200'}
            `}
          >
            {year}
          </span>
        </div>
      </div>
    </div>
  );
  
  
};

export default YearTimeControls;