import React, { useEffect, useRef } from "react";
import { ArrowRight, MapPin, Users, ChevronDown } from "lucide-react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import logo from "../assets/logo.png";
import { ImStudentButton, ImTouristButton } from "./presets";


// Google Maps Background Component
const GoogleMapsBackground = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  // Define a circular path around Chicago with more points for smoother movement
  const chicagoPath = [
    { lat: 41.8781, lng: -87.6298 }, // Downtown Chicago (start)
    { lat: 41.9028, lng: -87.6317 }, // Lincoln Park
    { lat: 41.9242, lng: -87.6586 }, // DePaul/Lincoln Park
    { lat: 41.9400, lng: -87.6800 }, // North Side (more west)
    { lat: 41.9500, lng: -87.7000 }, // Lakeview (more west)
    { lat: 41.9300, lng: -87.7200 }, // Near North (more west)
    { lat: 41.9000, lng: -87.7100 }, // West Town area
    { lat: 41.8700, lng: -87.6900 }, // Near West Side
    { lat: 41.8400, lng: -87.6700 }, // South Loop (west bias)
    { lat: 41.8200, lng: -87.6600 }, // Chinatown area
    { lat: 41.8000, lng: -87.6800 }, // Pilsen (more west)
    { lat: 41.7886, lng: -87.6500 }, // University of Chicago (less east)
    { lat: 41.8100, lng: -87.6300 }, // Hyde Park (less east)
    { lat: 41.8300, lng: -87.6200 }, // Kenwood (less east)
    { lat: 41.8500, lng: -87.6300 }, // Bronzeville (less east)
    { lat: 41.8600, lng: -87.6400 }, // Near South
    { lat: 41.8781, lng: -87.6298 }, // Back to Downtown (complete circle)
  ];

  const mapOptions = {
    zoom: 12,
    center: chicagoPath[0],
    disableDefaultUI: true,
    gestureHandling: "none",
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    draggable: false,
    keyboardShortcuts: false,
    mapTypeId: "roadmap",
    restriction: {
      latLngBounds: {
        north: 42.1,
        south: 41.6,
        east: -87.3,
        west: -88.0,
      },
    },
    styles: [
      {
        featureType: "all",
        elementType: "all",
        stylers: [
          { saturation: -20 },
          { lightness: 20 },
          { gamma: 0.8 }
        ]
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          { color: "#a2daf2" },
          { visibility: "on" }
        ]
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [
          { color: "#f2f2f2" },
          { visibility: "on" }
        ]
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [
          { saturation: -70 },
          { lightness: 45 },
          { visibility: "on" }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [
          { visibility: "simplified" }
        ]
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [
          { saturation: -55 },
          { lightness: 40 },
          { visibility: "off" }
        ]
      }
    ]
  };

  // Linear interpolation function
  const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
  };

  // Function to interpolate between two coordinates
  const interpolateCoordinates = (coord1, coord2, factor) => {
    return {
      lat: lerp(coord1.lat, coord2.lat, factor),
      lng: lerp(coord1.lng, coord2.lng, factor)
    };
  };

  const startContinuousAnimation = () => {
    if (!mapRef.current) return;

    const ANIMATION_DURATION = 120000; // 2 minutes for complete circle (very slow)
    
    startTimeRef.current = performance.now();

    const animate = (currentTime) => {
      if (!mapRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      
      // Calculate progress through the path (0 to 1, then repeat)
      const progress = (elapsed % ANIMATION_DURATION) / ANIMATION_DURATION;
      
      // Calculate which segment of the path we're on
      const pathLength = chicagoPath.length - 1; // -1 because last point connects to first
      const segmentProgress = progress * pathLength;
      const currentSegmentIndex = Math.floor(segmentProgress);
      const segmentFactor = segmentProgress - currentSegmentIndex;
      
      // Get current and next points (with wraparound)
      const currentPoint = chicagoPath[currentSegmentIndex];
      const nextPoint = chicagoPath[(currentSegmentIndex + 1) % chicagoPath.length];
      
      // Interpolate between current and next point with easing for smoother movement
      const easedFactor = segmentFactor * segmentFactor * (3 - 2 * segmentFactor); // Smooth step function
      const currentPosition = interpolateCoordinates(currentPoint, nextPoint, easedFactor);
      
      // Use moveCamera for smooth animation with constant zoom
      mapRef.current.moveCamera({
        center: currentPosition,
        zoom: 12
      });
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start the animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (loadError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-gray-50" />
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-gray-50" />
    );
  }

  return (
    <div className="absolute inset-0">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={(map) => {
          console.log('Map loaded, starting animation'); // Debug log
          mapRef.current = map;
          
          // Start animation once map is loaded with a small delay
          setTimeout(() => {
            startContinuousAnimation();
          }, 1000); // 1 second delay to ensure map is fully ready
          
          // Suppress error dialogs
          if (window.google && window.google.maps) {
            window.google.maps.event.addDomListener(window, 'load', () => {
              // Hide any error dialogs
              const errorDialogs = document.querySelectorAll('[role="dialog"]');
              errorDialogs.forEach(dialog => {
                if (dialog.textContent && dialog.textContent.includes('Google Maps')) {
                  dialog.style.display = 'none';
                }
              });
            });
          }
        }}
      />
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-white/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-gray-50/60" />
    </div>
  );
};

const LandingPage = ({ onNavigation }) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <section
      className="relative h-screen w-full text-slate-800 overflow-hidden flex flex-col justify-center bg-gray-50 font-sans"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Google Maps Background */}
        <GoogleMapsBackground />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6 flex flex-col justify-center flex-1 animate-fadeIn">
        <img src={logo} alt="Logo" className="mx-auto w-auto" style={{ width: '200px', height: 'auto'}} />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold leading-tight text-slate-900 drop-shadow-md mb-6">
            <span className="text-primary">In Chicago?</span> <br/> SafetyFirst!
          </h1>

          {/*
          <p className="text-slate-700 text-xl sm:text-2xl mt-2 mb-8 font-medium">
            Your safety, our mission. No matter where you are in the city, we've got you covered.
          </p>
          */}

        <div className="space-y-6">
        <div className="bg-white/90 rounded-lg shadow-subtle p-6 flex flex-col gap-4 backdrop-blur-sm">
        <button
              onClick={() => onNavigation("path")}
              className="w-full bg-primary hover:bg-blue-600 transition px-6 py-4 rounded-md font-semibold text-white flex items-center justify-center gap-3 text-lg shadow-md hover-lift"
            >
              <span>Find the Safest Path</span> <MapPin size={20} />
            </button>
            <p className="text-slate-600 text-base -mt-2">Worried about walking home late? Let us guide you with real-time safe route suggestions.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white/90 rounded-lg shadow-subtle p-6 flex flex-col gap-2 backdrop-blur-sm">
            {ImStudentButton({onNavigation})}
            <p className="text-slate-600 text-base -mt-2">New student coming to Chicago? Discover threats and how to stay safe in the streets.</p>
          </div>
          <div className="flex-1 bg-white/90 rounded-lg shadow-subtle p-6 flex flex-col gap-2 backdrop-blur-sm">
            {ImTouristButton({onNavigation})}
            <p className="text-slate-600 text-base -mt-2">Exploring the city? It might not be as safe as you think, find out what has happened recently.</p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage; 