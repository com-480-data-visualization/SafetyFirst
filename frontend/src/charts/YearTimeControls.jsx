import React from "react";

const YearTimeControls = ({ year, setYear, timeRange, setTimeRange }) => {
  return (
    <div className="mt-6 p-4 bg-white border border-red-300 shadow-lg rounded-lg max-w-2xl mx-auto space-y-6">
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
          className="w-full accent-red-500"
        />
      </div>

      {/* Time Range Selector */}
      <div>
        <label className="block font-semibold text-sm text-red-400 mb-1">
          Hour Range: {timeRange[0]}h – {timeRange[1]}h
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={timeRange[0]}
            onChange={(e) =>
              setTimeRange([parseInt(e.target.value), timeRange[1]])
            }
            className="w-full accent-red-500"
          />
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={timeRange[1]}
            onChange={(e) =>
              setTimeRange([timeRange[0], parseInt(e.target.value)])
            }
            className="w-full accent-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default YearTimeControls;