// Add at the top or in a separate file
import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 41.8781,
  lng: -87.6298, // Chicago center
};

const MapSection = ({ travelMode }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Handle map click
  const handleClick = useCallback(
    (e) => {
      const clickedPoint = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      if (!origin) {
        setOrigin(clickedPoint);
        setDirections(null);
      } else if (!destination) {
        setDestination(clickedPoint);
      } else {
        // Reset if both points were selected
        setOrigin(clickedPoint);
        setDestination(null);
        setDirections(null);
      }
    },
    [origin, destination]
  );

  // When both are selected, calculate directions
  React.useEffect(() => {
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

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={origin || center}
      zoom={13}
      options={{
        disableDefaultUI: false,
        styles: [
            {
              elementType: "geometry",
              stylers: [{ color: "#1d2c4d" }]
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#8ec3b9" }]
            },
            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#1a3646" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#2c3e50" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }]
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#406d80" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }]
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }]
            },
          ],
      }}
      onClick={handleClick}
    >
      {origin && <Marker position={origin} label="A" />}
      {destination && <Marker position={destination} label="B" />}
      {directions && 
        <DirectionsRenderer
          directions={directions}
          options={{ suppressMarkers: true }} // keep default, OR customize markers
        />      
      }
    </GoogleMap>
  ) : (
    <p className="text-center text-white">Loading Map...</p>
  );
};

export default MapSection;
