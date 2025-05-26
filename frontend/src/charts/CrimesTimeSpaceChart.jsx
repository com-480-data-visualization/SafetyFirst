import React, { useEffect, useState } from "react";
import HeatmapMap from "./HeatmapMap";
import CrimeStatsPanel from "./CrimeStatsPanel";
import YearTimeControls from "./YearTimeControls";
import ScenarioPresets from "./ScenarioPresets";

const CrimesTimeSpaceChart = ({ userType = "tourist" }) => {
  const [year, setYear] = useState(2023);
  const [timeRange, setTimeRange] = useState([0, 23]); // hour range
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [mapCenter, setMapCenter] = useState([41.8781, -87.6298]);
  const [mapZoom, setMapZoom] = useState(11);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch data for the selected year
  useEffect(() => {
    fetch(`/SafetyFirst/heatmap_data_full/heatmap_full_${year}.json`)
      .then((res) => res.json())
      .then((data) => setRawData(data))
      .catch((err) => {
        console.error("❌ Failed to load JSON:", err);
        setRawData([]);
      });
  }, [year]);

  // Handle scenario selection
  const handleScenarioSelect = (scenario, location = null) => {
    setSelectedScenario(scenario);
    
    if (location) {
      setSelectedLocation(location);
      setMapCenter([location.lat, location.lon]);
      setMapZoom(location.zoom);
      setYear(scenario.year);
      setTimeRange(scenario.timeRange);
    }
  };

  // Clear scenario selection
  const clearScenario = () => {
    setSelectedScenario(null);
    setSelectedLocation(null);
    setMapCenter([41.8781, -87.6298]);
    setMapZoom(11);
  };

  // Filter data based on time range and location
  useEffect(() => {
    let filtered = rawData.filter((d) => {
      const hour = new Date(d.datetime).getHours();
      
      // Handle overnight ranges (e.g., 20:00 to 02:00)
      if (timeRange[0] > timeRange[1]) {
        // Overnight: hour >= start OR hour <= end
        return hour >= timeRange[0] || hour <= timeRange[1];
      } else {
        // Normal range: hour >= start AND hour <= end
        return hour >= timeRange[0] && hour <= timeRange[1];
      }
    });

    // If a specific location is selected, filter by radius
    if (selectedLocation) {
      const radius = 0.02; // Approximately 2.2km radius
      filtered = filtered.filter((d) => {
        const latDiff = Math.abs(d.lat - selectedLocation.lat);
        const lonDiff = Math.abs(d.lon - selectedLocation.lon);
        return latDiff <= radius && lonDiff <= radius;
      });
    }

    setFilteredData(filtered);
  }, [rawData, timeRange, selectedLocation]);

  return (
    <section className="w-full px-4 sm:px-8 md:px-16 lg:px-32 py-12">
      <h2 className="text-4xl text-primary font-extrabold text-center mb-8 text-glow">
      Explore the Crime Landscape, Block by Block
      </h2>
      <p className="text-lg text-gray-700">
        Where is crime concentrated? Which neighborhoods are getting safer — or more dangerous? This interactive heatmap lets you zoom into any part of Chicago to see the density of reported crimes from 2001 to 2025.
      </p>
      <p className="mt-4 text-lg text-gray-700">
        Use the filters to focus on a specific <strong>area, year, or time range</strong>. The dynamic bar chart updates in real time to show which crimes were most common, and how frequently they occurred.
      </p>
      <p className="mt-4 text-lg text-gray-700">
        Whether you're a visitor planning a stay or a local staying informed, this tool helps you visualize trends and hotspots — with data that puts headlines into context.
      </p>
      
      {/* Scenario Presets */}
      <div className="mt-8 mb-6">
        <ScenarioPresets 
          onSelectScenario={handleScenarioSelect}
          selectedScenario={selectedScenario}
          userType={userType}
        />
        {selectedLocation && (
          <div className="mt-4 flex items-center justify-between bg-red-50 border border-red-300 rounded-lg p-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Viewing: {selectedLocation.name}
              </p>
              <p className="text-xs text-gray-600">
                {selectedScenario.name} • {timeRange[0]}:00 - {timeRange[1]}:00
              </p>
            </div>
            <button
              onClick={clearScenario}
              className="px-4 py-2 bg-white border border-red-300 rounded text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Top Section: Controls and Stats side by side */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 h-auto lg:h-[500px]">
          <YearTimeControls
            year={year}
            setYear={setYear}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </div>
        <div className="flex-1 h-auto lg:h-[500px]">
          <CrimeStatsPanel data={filteredData} />
        </div>
      </div>

      {/* Bottom Section: Full-width Map */}
      <div className="w-full h-[600px] border-4 border-red-500 rounded-xl overflow-hidden">
        <HeatmapMap 
          points={filteredData} 
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
    </section>
  );
};

export default CrimesTimeSpaceChart;
