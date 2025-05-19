import React, { useEffect, useRef, useState } from "react";
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
  lng: -87.6298,
};

const MapSection = ({
  origin,
  destination,
  travelMode,
  onMapClick,
  directions,
  setDirections,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const [mapType, setMapType] = useState("hybrid"); // Default to satellite with labels

  // Read the selected display from the Google Maps UI
  const handleMapTypeChange = () => {
    if (mapRef.current) {
      const type = mapRef.current.getMapTypeId();
      setMapType(type);
    }
  };

  // Recalculate route if origin and destination are present
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
          setDirections(result.routes);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [origin, destination, travelMode, isLoaded]);

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
      onLoad={(map) => (mapRef.current = map)}
      onMapTypeIdChanged={handleMapTypeChange}
      options={{
        disableDefaultUI: false,
        mapTypeId: mapType, // Preserve current map type
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
      {Array.isArray(directions) &&
        directions.map((route, index) => (
          <DirectionsRenderer
            key={index}
            directions={{
              routes: [route],
              request: {}, // dummy required structure
              geocoded_waypoints: [],
            }}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: index === 0 ? "#facc15" : "#9ca3af", // highlight main route, gray for alternates
                strokeOpacity: 0.7,
                strokeWeight: index === 0 ? 6 : 4,
              },
            }}
          />
      ))}
    </GoogleMap>
  );
};

export default MapSection;