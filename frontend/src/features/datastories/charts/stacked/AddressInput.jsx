import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, X, Navigation } from "lucide-react";

const AddressInput = ({ onAddressSelect, selectedAddress, onClearAddress }) => {
  const [inputMode, setInputMode] = useState("address"); // "address" or "coordinates"
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Update input fields when selectedAddress changes (from scenarios)
  useEffect(() => {
    if (selectedAddress) {
      // Set address field
      setAddress(selectedAddress.address || "");
      
      // Set coordinate fields
      setCoordinates({
        lat: selectedAddress.lat ? selectedAddress.lat.toString() : "",
        lon: selectedAddress.lon ? selectedAddress.lon.toString() : ""
      });
    } else {
      // Clear fields when no address is selected
      setAddress("");
      setCoordinates({ lat: "", lon: "" });
    }
  }, [selectedAddress]);

  // Debounced address search for suggestions
  useEffect(() => {
    if (inputMode === "address" && address.length > 2 && !selectedAddress) {
      // Clear previous timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Set new timeout for debounced search
      debounceRef.current = setTimeout(() => {
        searchAddressSuggestions(address);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [address, inputMode, selectedAddress]);

  // Update dropdown position when scrolling or resizing
  useEffect(() => {
    const updateDropdownPosition = () => {
      if (showSuggestions && suggestionsRef.current && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const dropdown = suggestionsRef.current;
        dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`;
        dropdown.style.left = `${rect.left + window.scrollX}px`;
        dropdown.style.width = `${rect.width}px`;
      }
    };

    if (showSuggestions) {
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [showSuggestions]);

  const searchAddressSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ", Chicago, IL"
        )}&limit=5&countrycodes=us&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const filteredSuggestions = data.filter(item => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          // Check if within Chicago bounds
          return lat >= 41.62 && lat <= 42.08 && lon >= -88.00 && lon <= -87.45;
        });
        
        setSuggestions(filteredSuggestions);
        setShowSuggestions(filteredSuggestions.length > 0);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const geocodeAddress = async (addressString) => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressString + ", Chicago, IL"
        )}&limit=1&countrycodes=us`
      );
      
      if (!response.ok) {
        throw new Error("Failed to geocode address");
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error("Address not found. Please try a different address.");
      }
      
      const result = data[0];
      const coords = {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        address: result.display_name
      };
      
      // Check if the coordinates are within Chicago bounds
      const chicagoBounds = {
        north: 42.08,
        south: 41.62,
        east: -87.45,
        west: -88.00
      };
      
      if (
        coords.lat < chicagoBounds.south ||
        coords.lat > chicagoBounds.north ||
        coords.lon < chicagoBounds.west ||
        coords.lon > chicagoBounds.east
      ) {
        throw new Error("Address is outside Chicago area. Please enter a Chicago address.");
      }
      
      onAddressSelect(coords);
      // Don't clear address here since it should stay visible
      setSuggestions([]);
      setShowSuggestions(false);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(coordinates.lat);
    const lon = parseFloat(coordinates.lon);
    
    if (isNaN(lat) || isNaN(lon)) {
      setError("Please enter valid numeric coordinates");
      return;
    }
    
    // Check if coordinates are within Chicago bounds
    if (lat < 41.62 || lat > 42.08 || lon < -88.00 || lon > -87.45) {
      setError("Coordinates are outside Chicago area");
      return;
    }
    
    setError("");
    onAddressSelect({
      lat,
      lon,
      address: `${lat.toFixed(6)}, ${lon.toFixed(6)}`
    });
    // Don't clear coordinates here since they should stay visible
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      geocodeAddress(address.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const coords = {
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      address: suggestion.display_name
    };
    
    onAddressSelect(coords);
    // Don't clear address here since it should stay visible
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleAddressSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setAddress("");
    setCoordinates({ lat: "", lon: "" });
    setError("");
    setSuggestions([]);
    setShowSuggestions(false);
    onClearAddress();
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    // If user starts typing and there's a selected address, clear it
    if (selectedAddress && e.target.value !== selectedAddress.address) {
      onClearAddress();
    }
  };

  const handleCoordinateChange = (field, value) => {
    setCoordinates(prev => ({ ...prev, [field]: value }));
    // If user changes coordinates and there's a selected address, clear it
    if (selectedAddress) {
      const currentLat = selectedAddress.lat ? selectedAddress.lat.toString() : "";
      const currentLon = selectedAddress.lon ? selectedAddress.lon.toString() : "";
      
      if ((field === 'lat' && value !== currentLat) || 
          (field === 'lon' && value !== currentLon)) {
        onClearAddress();
      }
    }
  };

  return (
    <div className="bg-white border border-blue-200 shadow-lg rounded-xl mb-6 overflow-hidden">
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-blue-50">
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-blue-600">Search by Location</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-gray-500 transition-colors bg-transparent border-none outline-none focus:outline-none"
        >
          {isCollapsed ? (
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
      {!isCollapsed && (
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Enter a Chicago address or coordinates to view crime data within a 1 km radius
          </p>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setInputMode("address")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === "address"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Address
            </button>
            <button
              onClick={() => setInputMode("coordinates")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                inputMode === "coordinates"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Navigation size={14} />
              Coordinates
            </button>
          </div>
          
          {selectedAddress && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Current Location:</p>
                  <p className="text-xs text-gray-600 truncate max-w-md">
                    {selectedAddress.address}
                  </p>
                  <p className="text-xs text-blue-600">
                    Showing crimes within 1 km radius
                  </p>
                </div>
                <button
                  onClick={handleClear}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear location"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Address Input Mode */}
          {inputMode === "address" && (
            <div className="relative">
              <form onSubmit={handleAddressSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    placeholder="Enter address (e.g., 123 Michigan Ave, Chicago)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div 
                      ref={suggestionsRef}
                      className="fixed bg-white border border-gray-300 rounded-lg shadow-2xl z-[10000] max-h-60 overflow-y-auto"
                      style={{
                        top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
                        left: inputRef.current ? inputRef.current.getBoundingClientRect().left + window.scrollX : 0,
                        width: inputRef.current ? inputRef.current.getBoundingClientRect().width : 'auto',
                        backgroundColor: '#ffffff !important'
                      }}
                    >
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.place_id}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-4 py-3 border-b border-gray-200 last:border-b-0 transition-all duration-200`}
                          style={{
                            backgroundColor: index === selectedSuggestionIndex ? '#f1f5f9 !important' : 'transparent',
                            color: index === selectedSuggestionIndex ? '#0f172a !important' : '#374151'
                          }}
                          onMouseEnter={(e) => {
                            if (index !== selectedSuggestionIndex) {
                              e.target.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (index !== selectedSuggestionIndex) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <div 
                            className="text-sm truncate"
                            style={{
                              color: index === selectedSuggestionIndex ? '#0f172a !important' : '#111827',
                              fontWeight: index === selectedSuggestionIndex ? '600' : '500'
                            }}
                          >
                            {suggestion.display_name.split(',')[0]}
                          </div>
                          <div 
                            className="text-xs truncate"
                            style={{
                              color: index === selectedSuggestionIndex ? '#64748b !important' : '#6b7280'
                            }}
                          >
                            {suggestion.display_name}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !address.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </form>
            </div>
          )}

          {/* Coordinates Input Mode */}
          {inputMode === "coordinates" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={coordinates.lat}
                    onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                    placeholder="41.8781"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={coordinates.lon}
                    onChange={(e) => handleCoordinateChange('lon', e.target.value)}
                    placeholder="-87.6298"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={handleCoordinateSubmit}
                disabled={!coordinates.lat || !coordinates.lon}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Navigation size={16} />
                Set Location
              </button>
              <p className="text-xs text-gray-500">
                Chicago bounds: Lat 41.62-42.08, Lon -88.00 to -87.45
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressInput; 