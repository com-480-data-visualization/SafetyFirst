import React, { useEffect, useCallback, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

// Styling for the map container
const containerStyle = {
  width: "100%",
  height: "600px",
};

// Default center (Chicago)
const center = {
  lat: 41.8781,
  lng: -87.6298,
};

const MapSection = ({ origin, destination, travelMode, onMapClick }) => {
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Calculate route when both points are selected
  useEffect(() => {
    if (origin && destination && isLoaded && window.google) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [origin, destination, travelMode, isLoaded]);

  // Safety: if Google isn't ready
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
      center={origin || center}
      zoom={13}
      onClick={onMapClick}
      options={{
        disableDefaultUI: false,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c3e50" }] },
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
          { featureType: "transit", elementType: "geometry", stylers: [{ color: "#406d80" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
        ],
      }}
    >
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
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#facc15", // your dangerYellow
              strokeOpacity: 0.8,
              strokeWeight: 5,
            },
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapSection;