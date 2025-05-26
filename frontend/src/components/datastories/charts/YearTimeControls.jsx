import React, { useState } from "react";
import { Sun, Sunset, Moon, Clock } from "lucide-react";

const timePresets = [
  { id: "all", name: "All Day", range: [0, 23], icon: Clock },
  { id: "morning", name: "Morning", range: [6, 11], icon: Sun },
  { id: "afternoon", name: "Afternoon", range: [12, 17], icon: Sun },
  { id: "evening", name: "Evening", range: [18, 21], icon: Sunset },
  { id: "night", name: "Night", range: [22, 23], icon: Moon },
  { id: "late-night", name: "Late Night", range: [0, 5], icon: Moon }
];

const YearTimeControls = ({ year, setYear, timeRange, setTimeRange }) => {
  const [showCustomTime, setShowCustomTime] = useState(false);
  
  // Find active preset
  const activePreset = timePresets.find(
    preset => preset.range[0] === timeRange[0] && preset.range[1] === timeRange[1]
  );

  const handlePresetClick = (preset) => {
    setTimeRange(preset.range);
    setShowCustomTime(false);
  };

  const handleCustomTimeChange = (start, end) => {
    // Allow overnight ranges (e.g., 20:00 to 02:00)
    setTimeRange([start, end]);
  };

  // Calculate if this is an overnight range
  const isOvernightRange = timeRange[0] > timeRange[1];

  return (
    <div className="bg-white border border-red-200 shadow-lg rounded-xl p-6 h-full flex flex-col">
      {/* Year Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-lg font-semibold text-gray-700">
            Year
          </label>
          <span className="text-3xl font-bold text-gray-800 bg-red-50 px-4 py-2 rounded-lg border border-red-200">{year}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={2001}
            max={2025}
            step={1}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((year - 2001) / (2025 - 2001)) * 100}%, #e5e7eb ${((year - 2001) / (2025 - 2001)) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>2001</span>
            <span>2025</span>
          </div>
        </div>
      </div>

      {/* Time of Day Selector */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <label className="text-lg font-semibold text-gray-700">
            Time of Day
          </label>
          <button
            onClick={() => setShowCustomTime(!showCustomTime)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            {showCustomTime ? "Use Presets" : "Custom Hours"}
          </button>
        </div>

        {/* Time selection area */}
        <div className="flex-1 flex flex-col mb-6">
          {!showCustomTime ? (
            <div className="grid grid-cols-2 gap-3 flex-1 content-start">
              {timePresets.map((preset) => {
                const Icon = preset.icon;
                const isActive = activePreset?.id === preset.id;
                
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all h-14
                      ${isActive 
                        ? 'border-red-500 bg-red-50 text-red-700' 
                        : 'border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700 bg-white'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-gray-500'}`} />
                    <span className="text-sm font-medium">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
                  <select
                    value={timeRange[0]}
                    onChange={(e) => handleCustomTimeChange(parseInt(e.target.value), timeRange[1])}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">To</label>
                  <select
                    value={timeRange[1]}
                    onChange={(e) => handleCustomTimeChange(timeRange[0], parseInt(e.target.value))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Selection Summary */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">
          <span className="font-semibold">Viewing:</span> {year} • {timeRange[0]}:00 - {timeRange[1]}:00
          {isOvernightRange && <span className="font-medium"> (overnight)</span>}
        </p>
      </div>
    </div>
  );
};

export default YearTimeControls;