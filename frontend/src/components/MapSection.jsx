// src/components/MapSection.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  Polyline,
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
  safestIndex,
  selectedIndex,
  setSelectedIndex,
  mapType,
  setMapType,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef(null);

  // Recalculate directions when origin/destination are selected
  useEffect(() => {
    if (origin && destination && isLoaded && window.google) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
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

  // Handle map type change via UI buttons
const handleMapTypeChange = () => {
  if (mapRef.current) {
    const newType = mapRef.current.getMapTypeId();
    setMapType?.(newType); // propagate change to parent
  }
};

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
      center={origin || defaultCenter}
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
          position={origin}
          label="A"
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
        />
      )}
      {destination && (
        <Marker
          position={destination}
          label="B"
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
        />
      )}

      {/* Route Renderers */}
      {Array.isArray(routes) &&
        routes.map((route, index) => {
          const isSelected = index === selectedIndex;
          const isSafest = index === safestIndex;

          const baseColor = isSelected
            ? "#16a34a" // Green
            : isSafest
            ? "#3b82f6" // Blue
            : "#facc15"; // Yellow

          const glowColor = isSafest ? "0 0 12px rgba(59, 130, 246, 0.7)" : "none";

          return (
            <React.Fragment key={`route-${index}`}>
              <DirectionsRenderer
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
                    strokeColor: baseColor,
                    strokeOpacity: isSelected ? 1 : 0.7,
                    strokeWeight: isSelected ? 7 : isSafest ? 6 : 4,
                    zIndex: isSelected ? 100 : isSafest ? 50 : 10,
                  },
                }}
              />

              {/* Transparent clickable Polyline */}
              <Polyline
                path={route.overview_path}
                options={{
                  strokeOpacity: 0,
                  strokeWeight: 30,
                  clickable: true,
                  zIndex: 999,
                }}
                onClick={() => setSelectedIndex(index)}
                onMouseOver={(e) => {
                  e.domEvent.target.style.cursor = "pointer";
                }}
              />

              {/* Optional Glow Layer (if needed, use CSS or shadow polyline later) */}
            </React.Fragment>
          );
        })}

        <RouteLegend />
    </GoogleMap>
  );
};

export default MapSection;