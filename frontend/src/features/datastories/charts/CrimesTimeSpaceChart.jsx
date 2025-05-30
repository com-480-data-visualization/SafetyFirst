import React, { useEffect, useState } from "react";
import HeatmapMap from "../../heatmap/HeatmapMap";
import CrimeStatsPanel from "./CrimeStatsPanel";
import YearTimeControls from "./YearTimeControls";
import ScenarioPresets from "./ScenarioPresets";
import AddressInput from "./stacked/AddressInput";
import InstructionParagraph from "../../landing/presets";

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const CrimesTimeSpaceChart = ({ userType = "tourist" }) => {
  const [year, setYear] = useState(2023);
  const [timeRange, setTimeRange] = useState([0, 23]); // hour range
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [mapCenter, setMapCenter] = useState([41.8781, -87.6298]);
  const [mapZoom, setMapZoom] = useState(10.2);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [scenariosCollapsed, setScenariosCollapsed] = useState(false);

  // Fetch data for the selected year
  useEffect(() => {
    fetch(`/SafetyFirst/data/heatmap_data_full/heatmap_full_${year}.json`)
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
      // Set both scenario location and address when a specific location is selected
      setYear(scenario.year);
      setTimeRange(scenario.timeRange);
      setSelectedLocation(location);
      
      // Also set as selected address for the address input
      setSelectedAddress({
        lat: location.lat,
        lon: location.lon,
        address: location.name
      });
      
      setMapCenter([location.lat, location.lon]);
      setMapZoom(location.zoom);
    } else {
      // Just selecting scenario without location - only expand the box, don't change settings
      setSelectedLocation(null);
      // Keep current map view and settings unchanged
    }
  };

  // Handle address selection
  const handleAddressSelect = (addressData) => {
    // Clear scenario selection when address is selected manually
    setSelectedScenario(null);
    setSelectedLocation(null);
    
    setSelectedAddress(addressData);
    setMapCenter([addressData.lat, addressData.lon]);
    setMapZoom(14); // Zoom in closer for address view
  };

  // Clear address selection
  const handleClearAddress = () => {
    setSelectedAddress(null);
    // Also clear scenario if it was set
    setSelectedScenario(null);
    setSelectedLocation(null);
    setMapCenter([41.8781, -87.6298]);
    setMapZoom(10.2);
  };

  // Filter data based on time range, location, and address
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

    // If a specific location is selected (from scenarios), filter by radius
    if (selectedLocation) {
      const radius = 0.02; // Approximately 2.2km radius
      filtered = filtered.filter((d) => {
        const latDiff = Math.abs(d.lat - selectedLocation.lat);
        const lonDiff = Math.abs(d.lon - selectedLocation.lon);
        return latDiff <= radius && lonDiff <= radius;
      });
    }
    
    // If an address is selected, filter by 1km radius using precise distance calculation
    if (selectedAddress) {
      filtered = filtered.filter((d) => {
        const distance = calculateDistance(
          selectedAddress.lat, 
          selectedAddress.lon, 
          d.lat, 
          d.lon
        );
        return distance <= 1; // 1 km radius
      });
    }

    setFilteredData(filtered);
  }, [rawData, timeRange, selectedLocation, selectedAddress]);

  return (
    <div className="bg-gray-50 text-slate-800 py-6 px-4 sm:px-8 md:px-16 lg:px-32 relative">
      <h2 class="text-2xl font-bold mb-4">
        🗺️ 📸 Explore the Crime Landscape, Block by Block
      </h2>
      <p className="mb-6 italic">
      Armed with trends and headlines, you can't shake the feeling that you need more detail—exactly where should you watch your back?
      </p>
      <p className="mb-4">
      First, you wonder about <strong>O'Hare</strong> and <strong>Midway</strong> — does airport bustle bring more thefts? 
      Then there's <strong>Navy Pier</strong>, the <strong>Art Institute</strong>, and the <strong>Magnificent Mile</strong>: 
      each a magnet for visitors, but also potential crime hotspots. You decide to drill into the data to see which 
      offenses strike most often at these landmarks and shopping districts.</p>

    {/* Interaction instruction call-out */}
      <InstructionParagraph>
        👉 Use the filters to focus on a specific{" "}
        <span className="inline-block bg-primary text-secondary px-2 py-0 rounded-full border">
          area
        </span>,{' '}
        <span className="inline-block bg-primary text-secondary px-2 py-0 rounded-full border">
          year
        </span>, or{' '}
        <span className="inline-block bg-primary text-secondary px-2 py-0 rounded-full border">
          time range
        </span>.<br/>
        📊 The dynamic bar chart updates live to show which crimes were most common, and how frequently they occurred.<br/>
        🗺️ The map highlights the locations of these crimes, allowing you to see patterns and hotspots in real-time.
      </InstructionParagraph>

      {/* Quick Scenarios Section - Now above address input */}
      <div className="mb-6">
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
                    onClick={handleClearAddress}
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

      {/* Address Input Section - Now below scenarios */}
      <AddressInput 
        onAddressSelect={handleAddressSelect}
        selectedAddress={selectedAddress}
        onClearAddress={handleClearAddress}
      />

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
          <div className="w-full h-[500px] rounded-xl overflow-hidden">
            <HeatmapMap 
              points={filteredData} 
              center={mapCenter}
              zoom={mapZoom}
              selectedAddress={selectedAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimesTimeSpaceChart;
