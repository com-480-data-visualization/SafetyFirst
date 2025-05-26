import React from "react";
import { MapPin, Plane, GraduationCap, ShoppingBag, Coffee, Train, Moon, Camera } from "lucide-react";

const touristScenarios = [
  {
    id: "airport",
    name: "Airport Arrival",
    description: "Just landed at O'Hare or Midway",
    icon: Plane,
    locations: {
      ohare: { name: "O'Hare Airport", lat: 41.9742, lon: -87.9073, zoom: 14 },
      midway: { name: "Midway Airport", lat: 41.7868, lon: -87.7522, zoom: 14 }
    },
    timeRange: [6, 23], // Most flights during daytime
    year: 2024
  },
  {
    id: "tourist-attractions",
    name: "Sightseeing",
    description: "Visiting Chicago's famous attractions",
    icon: Camera,
    locations: {
      millenniumPark: { name: "Millennium Park / The Bean", lat: 41.8826, lon: -87.6226, zoom: 15 },
      navyPier: { name: "Navy Pier", lat: 41.8919, lon: -87.6051, zoom: 15 },
      willis: { name: "Willis Tower", lat: 41.8789, lon: -87.6359, zoom: 15 }
    },
    timeRange: [9, 18], // Tourist hours
    year: 2024
  },
  {
    id: "shopper",
    name: "Shopping Trip",
    description: "Shopping on Michigan Ave",
    icon: ShoppingBag,
    locations: {
      magnificentMile: { name: "Magnificent Mile", lat: 41.8946, lon: -87.6246, zoom: 15 },
      stateStreet: { name: "State Street Shopping", lat: 41.8819, lon: -87.6278, zoom: 15 },
      waterTower: { name: "Water Tower Place", lat: 41.8977, lon: -87.6230, zoom: 15 }
    },
    timeRange: [10, 20], // Shopping hours
    year: 2024
  }
];

const studentScenarios = [
  {
    id: "campus-life",
    name: "Campus Safety",
    description: "Around university campuses",
    icon: GraduationCap,
    locations: {
      uic: { name: "UIC Campus", lat: 41.8708, lon: -87.6505, zoom: 15 },
      uchicago: { name: "UChicago Campus", lat: 41.7886, lon: -87.5987, zoom: 15 },
      depaul: { name: "DePaul Loop Campus", lat: 41.8789, lon: -87.6254, zoom: 15 },
      loyola: { name: "Loyola University", lat: 42.0010, lon: -87.6606, zoom: 15 }
    },
    timeRange: [8, 17], // Class hours
    year: 2024
  },
  {
    id: "late-study",
    name: "Late Night Study",
    description: "Libraries and study spots after dark",
    icon: Moon,
    locations: {
      haroldWashington: { name: "Harold Washington Library", lat: 41.8767, lon: -87.6283, zoom: 15 },
      uicLibrary: { name: "UIC Library", lat: 41.8662, lon: -87.6475, zoom: 15 },
      depaul: { name: "DePaul Library", lat: 41.8789, lon: -87.6254, zoom: 15 }
    },
    timeRange: [18, 23], // Evening study hours
    year: 2024
  },
  {
    id: "student-hangouts",
    name: "Student Hangouts",
    description: "Popular spots near campuses",
    icon: Coffee,
    locations: {
      wickerPark: { name: "Wicker Park", lat: 41.9088, lon: -87.6796, zoom: 15 },
      lincolnPark: { name: "Lincoln Park", lat: 41.9214, lon: -87.6513, zoom: 15 },
      hydepark: { name: "Hyde Park", lat: 41.7943, lon: -87.5907, zoom: 15 }
    },
    timeRange: [14, 22], // Afternoon to evening
    year: 2024
  }
];

const ScenarioPresets = ({ onSelectScenario, selectedScenario, userType = "tourist" }) => {
  const scenarios = userType === "tourist" ? touristScenarios : studentScenarios;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-red-500 mb-4">Quick Scenarios</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isSelected = selectedScenario?.id === scenario.id;
          
          return (
            <div
              key={scenario.id}
              className={`
                border-2 rounded-lg p-4 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-red-300 hover:bg-gray-50'
                }
              `}
              onClick={() => onSelectScenario(scenario)}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon 
                  className={`w-6 h-6 ${isSelected ? 'text-red-500' : 'text-gray-600'}`} 
                />
                <h4 className="font-semibold text-gray-800">{scenario.name}</h4>
              </div>
              <p className="text-sm text-gray-600">{scenario.description}</p>
              
              {isSelected && scenario.locations && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Select location:</p>
                  {Object.entries(scenario.locations).map(([key, loc]) => (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScenario(scenario, loc);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm bg-white border border-red-300 rounded hover:bg-red-50 transition-colors text-gray-700 hover:text-gray-900"
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioPresets; 