import React from "react";

const YearTimeControls = ({ year, setYear, timeRange, setTimeRange }) => {
  return (
    <div className="p-4 bg-white border border-red-300 shadow-lg rounded-lg space-y-6 w-full">
      {/* Year Selector */}
      <div>
        <label className="block font-semibold text-sm text-red-400 mb-1">
          Year: {year}
        </label>
        <input
          type="range"
          min={2001}
          max={2025}
          step={1}
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="w-full accent-red-500 h-3"
        />
      </div>

      {/* Time Range Selector */}
      <div>
        <label className="block font-semibold text-sm text-red-400 mb-1">
          Hour Range: {timeRange[0]}h - {timeRange[1]}h
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={timeRange[0]}
            onChange={(e) =>
              setTimeRange([parseInt(e.target.value), timeRange[1]])
            }
            className="w-full accent-red-500 h-3"
          />
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={timeRange[1]}
            onChange={(e) =>
              setTimeRange([timeRange[0], parseInt(e.target.value)])
            }
            className="w-full accent-red-500 h-3"
          />
        </div>
      </div>
    </div>
  );
};

export default YearTimeControls;