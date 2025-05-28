import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, X, Navigation } from "lucide-react";

const RouteAddressInput = ({ onAddressSelect, selectedAddress, onClearAddress, placeholder = "Enter address" }) => {
  const [inputMode, setInputMode] = useState("address"); // "address" or "coordinates"
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Update input fields when selectedAddress changes
  useEffect(() => {
    if (selectedAddress) {
      setAddress(selectedAddress.address || "");
      setCoordinates({
        lat: selectedAddress.lat ? selectedAddress.lat.toString() : "",
        lon: selectedAddress.lon ? selectedAddress.lon.toString() : ""
      });
    } else {
      setAddress("");
      setCoordinates({ lat: "", lon: "" });
    }
  }, [selectedAddress]);

  // Debounced address search for suggestions
  useEffect(() => {
    if (inputMode === "address" && address.length > 2 && !selectedAddress) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
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
      if (coords.lat < 41.62 || coords.lat > 42.08 || coords.lon < -88.00 || coords.lon > -87.45) {
        throw new Error("Address is outside Chicago area. Please enter a Chicago address.");
      }
      
      onAddressSelect(coords);
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
    if (selectedAddress && e.target.value !== selectedAddress.address) {
      onClearAddress();
    }
  };

  const handleCoordinateChange = (field, value) => {
    setCoordinates(prev => ({ ...prev, [field]: value }));
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
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      <div className="p-4">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setInputMode("address")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              inputMode === "address"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Address
          </button>
          <button
            onClick={() => setInputMode("coordinates")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
              inputMode === "coordinates"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Navigation size={12} />
            Coordinates
          </button>
        </div>

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
                  placeholder={placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                
                {/* Clear button for address input */}
                {selectedAddress && inputMode === "address" && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-2 p-1 text-gray-500"
                    title="Clear address"
                  >
                    <X size={16} />
                  </button>
                )}
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="fixed bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl z-[10000] max-h-48 overflow-y-auto"
                    style={{
                      top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
                      left: inputRef.current ? inputRef.current.getBoundingClientRect().left + window.scrollX : 0,
                      width: inputRef.current ? inputRef.current.getBoundingClientRect().width : 'auto'
                    }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50/80 border-b border-gray-100/50 last:border-b-0 transition-all duration-200 ${
                          index === selectedSuggestionIndex ? 'bg-blue-100/80 border-blue-200/50' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.display_name.split(',')[0]}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
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
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search size={14} />
                )}
              </button>
            </form>
          </div>
        )}

        {/* Coordinates Input Mode */}
        {inputMode === "coordinates" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
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
                  className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleCoordinateSubmit}
              disabled={!coordinates.lat || !coordinates.lon}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Navigation size={14} />
              Set Location
            </button>
            {/* Clear button for coordinates */}
            {selectedAddress && inputMode === "coordinates" && (
              <button
                onClick={handleClear}
                className="w-full px-3 py-2 bg-gray-100 text-gray-600 rounded text-sm"
              >
                <X size={14} className="inline mr-2" />
                Clear Location
              </button>
            )}
          </div>
        )}
        
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteAddressInput; 