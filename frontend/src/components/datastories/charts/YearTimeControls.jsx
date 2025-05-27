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
    <div className={`bg-white/90 backdrop-blur-sm border shadow-md rounded-lg p-2 mb-4 transition-all duration-300 ${
      isHighlighted ? 'border-red-500 bg-red-50/50 shadow-lg' : 'border-red-300'
    }`}>
      <div className="flex items-center gap-4">
        {/* Start Time */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            Start
          </label>
          <select
            value={timeRange[0]}
            onChange={(e) => handleTimeChange(parseInt(e.target.value), timeRange[1])}
            className={`px-2 py-1 border rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none transition-all ${
              isHighlighted ? 'border-red-500 ring-1 ring-red-200' : 'border-gray-300'
            }`}
            style={{ backgroundImage: 'none' }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>

        {/* End Time */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            End
          </label>
          <select
            value={timeRange[1]}
            onChange={(e) => handleTimeChange(timeRange[0], parseInt(e.target.value))}
            className={`px-2 py-1 border rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none transition-all ${
              isHighlighted ? 'border-red-500 ring-1 ring-red-200' : 'border-gray-300'
            }`}
            style={{ backgroundImage: 'none' }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>

        {/* Year Slider */}
        <div className="flex-1 flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            Year
          </label>
          <div className="flex-1 relative">
            <input
              type="range"
              min={2001}
              max={2025}
              step={1}
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((year - 2001) / (2025 - 2001)) * 100}%, #e5e7eb ${((year - 2001) / (2025 - 2001)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>2001</span>
              <span>2025</span>
            </div>
          </div>
          <span className={`text-sm font-bold text-gray-800 px-2 py-1 rounded border min-w-[50px] text-center transition-all ${
            isHighlighted ? 'bg-red-100 border-red-300' : 'bg-red-50 border-red-200'
          }`}>
            {year}
          </span>
        </div>
      </div>
    </div>
  );
};

export default YearTimeControls;