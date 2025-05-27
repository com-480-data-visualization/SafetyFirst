import React, { useEffect, useState } from "react";
import HeatmapMap from "./HeatmapMap";
import CrimeStatsPanel from "./CrimeStatsPanel";
import YearTimeControls from "./YearTimeControls";
import ScenarioPresets from "./ScenarioPresets";
import InstructionParagraph from "../../presets";

const CrimesTimeSpaceChart = ({ userType = "tourist" }) => {
  const [year, setYear] = useState(2023);
  const [timeRange, setTimeRange] = useState([0, 23]); // hour range
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [mapCenter, setMapCenter] = useState([41.8781, -87.6298]);
  const [mapZoom, setMapZoom] = useState(10.2);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [scenariosCollapsed, setScenariosCollapsed] = useState(false);

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
      // Only apply scenario's year and time range when a specific location is selected
      setYear(scenario.year);
      setTimeRange(scenario.timeRange);
      setSelectedLocation(location);
      setMapCenter([location.lat, location.lon]);
      setMapZoom(location.zoom);
    } else {
      // Just selecting scenario without location - only expand the box, don't change settings
      setSelectedLocation(null);
      // Keep current map view and settings unchanged
    }
  };

  // Clear scenario selection
  const clearScenario = () => {
    setSelectedScenario(null);
    setSelectedLocation(null);
    setMapCenter([41.8781, -87.6298]);
    setMapZoom(10.2);
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
    <>
      <h2 class="text-2xl font-bold mb-4">
        🗺️ 📸 Explore the Crime Landscape, Block by Block
      </h2>
      <p className="mb-6 italic">
      Armed with trends and headlines, you can't shake the feeling that you need more detail—exactly where should you watch your back?
      </p>
      <p className="mb-4">
      First, you wonder about <strong>O'Hare</strong> and <strong>Midway</strong>—does airport bustle bring more thefts? Then there's 
      <strong>Navy Pier</strong>, the <strong>Art Institute</strong>, and the 
      <strong>Magnificent Mile</strong>: each a magnet for visitors, but also 
      potential crime hotspots. You decide to drill into the data to see which 
      offenses strike most often at these landmarks and shopping districts.</p>

    {/* Interaction instruction call-out */}
      <InstructionParagraph>
        👉 Use the filters to focus on a specific{" "}
        <mark className="bg-secondary-light text-secondary px-1 rounded">area</mark>,{" "}
        <mark className="bg-secondary-light text-secondary px-1 rounded">year</mark>, or{" "}
        <mark className="bg-secondary-light text-secondary px-1 rounded">time range</mark>. The{" "}
        <mark className="bg-secondary-light text-secondary px-1 rounded">dynamic bar chart</mark>{" "}
        updates live to show which crimes were most common, and how frequently they occurred.
      </InstructionParagraph>

      {/* Top Section: Scenario Presets full width */}
      <div className="mb-8">
        <div className="bg-white border border-red-200 shadow-lg rounded-xl overflow-hidden">
          {/* Header with toggle button */}
          <div className="flex items-center justify-between p-4 border-b border-red-200 bg-red-50">
            <h3 className="text-lg font-semibold text-red-500">Quick Scenarios</h3>
            <button
              onClick={() => setScenariosCollapsed(!scenariosCollapsed)}
              className="text-gray-400 hover:text-gray-500 transition-colors bg-transparent border-none outline-none focus:outline-none"
            >
              {scenariosCollapsed ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Collapsible content */}
          {!scenariosCollapsed && (
            <div className="p-6">
              <ScenarioPresets 
                onSelectScenario={handleScenarioSelect}
                selectedScenario={selectedScenario}
                selectedLocation={selectedLocation}
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
          )}
        </div>
      </div>

      {/* Time Controls - Horizontal bar just above the map */}
      <YearTimeControls
        year={year}
        setYear={setYear}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      {/* Bottom Section: Crime Stats and Map side by side */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="h-[500px]">
            <CrimeStatsPanel data={filteredData} />
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full h-[500px] border-4 border-red-500 rounded-xl overflow-hidden">
            <HeatmapMap 
              points={filteredData} 
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CrimesTimeSpaceChart;
