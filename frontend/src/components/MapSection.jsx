// src/components/MapSection.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

import RouteLegend from "./RouteLegend";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 41.8781,
  lng: -87.6298,
};

const MapSection = ({
  origin,
  destination,
  travelMode,
  onMapClick,
  onRoutesReady,
  routes,
  mapType,
  setMapType,
  highlightedIndex,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef(null);

  // Helper function to format coordinates for Google Maps API
  const formatCoordinatesForDirections = (coords) => {
    if (!coords) return null;
    return {
      lat: coords.lat,
      lng: coords.lng
    };
  };

  // Handle map type change via UI buttons
  const handleMapTypeChange = () => {
    if (mapRef.current) {
      const newType = mapRef.current.getMapTypeId();
      setMapType?.(newType); // propagate change to parent
    }
  };

  // Recalculate directions when origin/destination are selected
  useEffect(() => {
    if (origin && destination && isLoaded && window.google) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: formatCoordinatesForDirections(origin),
          destination: formatCoordinatesForDirections(destination),
          travelMode,
          provideRouteAlternatives: true,
        },
        (result, status) => {
          if (status === "OK") {
            onRoutesReady(result.routes);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [origin, destination, travelMode, isLoaded, onRoutesReady]);

  if (!isLoaded) {
    return (
      <div className="text-center text-gray-100 py-12 text-lg animate-pulse">
        Loading Map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={formatCoordinatesForDirections(origin) || defaultCenter}
      zoom={13}
      onClick={onMapClick}
      onLoad={(map) => (mapRef.current = map)}
      onMapTypeIdChanged={handleMapTypeChange}
      options={{
        disableDefaultUI: false,
        mapTypeId: mapType,
      }}
    >
      {/* Markers */}
      {origin && (
        <Marker
          position={formatCoordinatesForDirections(origin)}
          label="A"
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
        />
      )}
      {destination && (
        <Marker
          position={formatCoordinatesForDirections(destination)}
          label="B"
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
        />
      )}

      {/* Route Renderers */}
      {Array.isArray(routes) &&
        routes.map((route, index) => {
          const isHighlighted = highlightedIndex === index;


          const strokeColor = index === 0
            ? "#16a34a" // first route green
            : index === 1
            ? "#facc15" // second yellow
            : "#ef4444"; // third red


          return (
            <DirectionsRenderer
              key={`route-${index}`}
              directions={{
                routes: [route],
                request: {
                  origin,
                  destination,
                  travelMode,
                },
                geocoded_waypoints: [],
              }}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor,
                  strokeOpacity: isHighlighted ? 1.0 : 0.8,
                  strokeWeight: isHighlighted ? 7 : 4,
                  zIndex: isHighlighted ? 100 : 10 + index,
                },
              }}
            />
          );
        })}

      <RouteLegend />
    </GoogleMap>
  );
};

export default MapSection;