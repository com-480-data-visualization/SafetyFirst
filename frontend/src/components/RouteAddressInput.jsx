// src/components/RouteAddressInput.jsx
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

const RouteAddressInput = ({ selectedAddress, onAddressSelect, placeholder = "Enter a location…" }) => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    setAddress(selectedAddress?.address || "");
  }, [selectedAddress]);

  useEffect(() => {
    if (address.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(() => {
      fetchSuggestions(address);
    }, 300);

    return () => clearTimeout(timeout);
  }, [address]);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Chicago")}&limit=5&addressdetails=1`);
      const data = await res.json();
      const filtered = data.filter(d => {
        const lat = parseFloat(d.lat);
        const lon = parseFloat(d.lon);
        return lat >= 41.62 && lat <= 42.08 && lon >= -88.00 && lon <= -87.45;
      });
      setSuggestions(filtered);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestion fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (sugg) => {
    onAddressSelect({
      lat: parseFloat(sugg.lat),
      lon: parseFloat(sugg.lon),
      address: sugg.display_name
    });
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else {
          geocodeAddress(address);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    }
  };

  const geocodeAddress = async (query) => {
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Chicago")}&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        handleSelect(data[0]);
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onKeyDown={handleKeyDown}
        />
        <div className="px-2 text-gray-500">
          {loading ? (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 w-full overflow-hidden">
          {suggestions.map((sugg, idx) => (
            <button
              key={sugg.place_id}
              onClick={() => handleSelect(sugg)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                idx === selectedIndex ? "bg-blue-100" : ""
              }`}
            >
              <div className="font-semibold truncate">{sugg.display_name.split(",")[0]}</div>
              <div className="text-xs text-gray-500 truncate">{sugg.display_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteAddressInput;
