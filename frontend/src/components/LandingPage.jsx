import React, { useEffect, useRef } from "react";
import { ArrowRight, MapPin, Users, ChevronDown } from "lucide-react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import logo from "../assets/logo.png";

// Google Maps Background Component
const GoogleMapsBackground = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const animationRef = useRef(null);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  // Different Chicago locations for the animation
  const chicagoLocations = [
    { lat: 41.8781, lng: -87.6298 }, // Downtown Chicago
    { lat: 41.9028, lng: -87.6317 }, // Lincoln Park
    { lat: 41.8486, lng: -87.6370 }, // UIC Area
    { lat: 41.7886, lng: -87.5987 }, // University of Chicago
    { lat: 41.9242, lng: -87.6586 }, // DePaul/Lincoln Park
    { lat: 41.8819, lng: -87.6278 }, // The Loop
  ];

  const mapOptions = {
    zoom: 12,
    center: chicagoLocations[0],
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

  const startAnimation = () => {
    if (!mapRef.current) return;

    let currentLocationIndex = 0;
    
    const animateMap = () => {
      if (mapRef.current) {
        currentLocationIndex = (currentLocationIndex + 1) % chicagoLocations.length;
        const nextLocation = chicagoLocations[currentLocationIndex];
        
        console.log('Animating to:', nextLocation); // Debug log
        
        // Smooth pan to next location
        mapRef.current.panTo(nextLocation);
        
        // Occasionally change zoom slightly for variety
        if (Math.random() > 0.7) {
          const currentZoom = mapRef.current.getZoom();
          const newZoom = currentZoom + (Math.random() > 0.5 ? 1 : -1);
          if (newZoom >= 11 && newZoom <= 13) {
            mapRef.current.setZoom(newZoom);
          }
        }
      }
    };

    // Start animation after a short delay
    const initialTimeout = setTimeout(() => {
      animateMap();
      // Continue animation every 6 seconds (faster for testing)
      animationRef.current = setInterval(animateMap, 6000);
    }, 2000);

    return () => {
      clearTimeout(initialTimeout);
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
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
          
          // Start animation once map is loaded
          startAnimation();
          
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
              <button
                onClick={() => onNavigation("student")}
                className="w-full bg-secondary hover:bg-slate-600 transition px-6 py-4 rounded-md font-semibold text-white flex items-center justify-center gap-3 text-lg shadow-md hover-lift"
              >
                <span>I'm a student</span> <Users size={20} />
              </button>
              <p className="text-slate-600 text-base -mt-2">New student coming to Chicago? Discover threats and how to stay safe in the streets.</p>
            </div>
            <div className="flex-1 bg-white/90 rounded-lg shadow-subtle p-6 flex flex-col gap-2 backdrop-blur-sm">
              <button
                onClick={() => onNavigation("tourist")}
                className="w-full bg-accent hover:bg-blue-500 transition px-6 py-4 rounded-md font-semibold text-white flex items-center justify-center gap-3 text-lg shadow-md hover-lift"
              >
                <span>I'm a tourist</span> <Users size={20} />
              </button>
              <p className="text-slate-600 text-base -mt-2">Exploring the city? It might not be as safe as you think, find out what has happened recently.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage; 