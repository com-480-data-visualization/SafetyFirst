import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const chicagoCenter = {
  lat: 41.8781,
  lng: -87.6298,
};

// Crime data in chronological order with refined coordinates
const crimeData = [
  {
    id: 1,
    date: "May 2017",
    timestamp: new Date("2017-05-01").getTime(),
    location: { lat: 41.9252, lng: -87.6538 }, // DePaul University Richardson Library
    title: "DePaul University Student Robbed at Knifepoint",
    description: "A DePaul University student was robbed at knifepoint near the Richardson Library on the Lincoln Park campus. The student was leaving the library around 7 a.m. when an individual dressed in black displayed a knife and demanded her laptop. The assailant fled north on Kenmore Avenue after the robbery. The student was unharmed."
  },
  {
    id: 2,
    date: "November 2018",
    timestamp: new Date("2018-11-01").getTime(),
    location: { lat: 41.9241, lng: -87.6459 }, // Belden and Fremont, near Cortelyou Commons
    title: "DePaul University Student Robbed at Gunpoint",
    description: "A 19-year-old male DePaul University student was walking near Belden and Fremont, in front of Cortelyou Commons, around 11:45 p.m. when he was approached by three individuals. One of the assailants displayed a gun and demanded the student's personal belongings. The offenders took an undetermined amount of cash and fled the scene."
  },
  {
    id: 3,
    date: "April 2019",
    timestamp: new Date("2019-04-01").getTime(),
    location: { lat: 41.7890, lng: -87.5857 }, // East 59th Street and South Stony Island Avenue
    title: "University of Chicago Student Assaulted and Robbed",
    description: "A first-year student at the University of Chicago was assaulted and robbed near the intersection of East 59th Street and South Stony Island Avenue. Around 3:15 a.m., the student was approached by three individuals who attacked him with a blunt metal object, resulting in facial lacerations, a head injury, and significant blood loss. The assailants stole his laptop, iPhone, and wallet before fleeing."
  },
  {
    id: 4,
    date: "February 2023",
    timestamp: new Date("2023-02-01").getTime(),
    location: { lat: 41.498641, lng: -87.651551 }, // Campbell Avenue, Chicago - corrected coordinates
    title: "International Student Attacked and Robbed",
    description: "Syed Mazahir Ali, an international student from Hyderabad, India, pursuing a master's degree in Information Technology at Indiana Wesleyan University, was attacked and robbed near his residence on Campbell Avenue. While returning home around 1:18 AM, he was accosted by four armed individuals who assaulted him, resulting in significant injuries. The assailants stole his mobile phone and wallet."
  },
  {
    id: 5,
    date: "December 2024",
    timestamp: new Date("2024-12-01").getTime(),
    location: { lat: 41.7904, lng: -87.5909 }, // 5800 block of South Dorchester Avenue
    title: "University of Chicago Students Robbed at Gunpoint",
    description: "Three University of Chicago students were walking around 5:15 a.m. in the 5800 block of South Dorchester Avenue when they were approached by four or five individuals who exited a white Alfa Romeo SUV. The assailants, armed with guns, demanded the students' belongings. After the students complied, the offenders fled south on Dorchester."
  }
];

const CrimeTimeline = () => {
  const [currentCrimeIndex, setCurrentCrimeIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapZoom, setMapZoom] = useState(14);
  const timerRef = useRef(null);
  const mapRef = useRef(null);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Animation sequence for transitioning between crimes
  const animateToCrime = (index) => {
    if (!mapRef.current) return;
    
    // First zoom out
    setMapZoom(10);
    
    // Then after a delay, change location and zoom in
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.panTo(crimeData[index].location);
        setSelectedMarker(crimeData[index]);
        
        // Zoom in after panning to location
        setTimeout(() => {
          setMapZoom(15);
        }, 500);
      }
    }, 700);
  };

  useEffect(() => {
    // Trigger animation when current crime index changes
    if (isLoaded && mapRef.current) {
      animateToCrime(currentCrimeIndex);
    }
  }, [currentCrimeIndex, isLoaded]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setCurrentCrimeIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= crimeData.length) {
            setPlaying(false);
            return prevIndex;
          }
          return nextIndex;
        });
      }, 6000); // Increased to 6 seconds to allow for animation
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [playing]);

  const handleSliderChange = (e) => {
    const newIndex = parseInt(e.target.value);
    setCurrentCrimeIndex(newIndex);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleMarkerClick = (crime) => {
    setSelectedMarker(crime);
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
    // Initial zoom animation
    setTimeout(() => {
      animateToCrime(currentCrimeIndex);
    }, 500);
  };

  const currentCrime = crimeData[currentCrimeIndex];

  return (
    <section className="bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative">
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-red-500 mb-4">
          Campus Safety Timeline
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Explore major campus safety incidents in Chicago over time. The timeline shows where and when significant crimes occurred around university campuses.
        </p>
      </div>

      {isLoaded ? (
        <div className="flex flex-col gap-8">
          <div className="rounded-xl overflow-hidden border-4 border-red-500 shadow-lg">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentCrime?.location || chicagoCenter}
              zoom={mapZoom}
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
              onLoad={onMapLoad}
            >
              {crimeData.map((crime, index) => (
                <Marker
                  key={crime.id}
                  position={crime.location}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(
                      index === currentCrimeIndex ? 50 : 30, 
                      index === currentCrimeIndex ? 50 : 30
                    ),
                  }}
                  animation={index === currentCrimeIndex ? window.google.maps.Animation.BOUNCE : null}
                  onClick={() => handleMarkerClick(crime)}
                />
              ))}

              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker.location}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="bg-gray-900 text-white p-2 max-w-md">
                    <h3 className="font-bold text-lg text-red-500">{selectedMarker.title}</h3>
                    <p className="text-sm mb-1 text-yellow-400">{selectedMarker.date}</p>
                    <p className="text-xs">{selectedMarker.description}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="text-xl font-bold text-red-500">
                {currentCrime.date}: {currentCrime.title}
              </div>
              <button
                onClick={handlePlayPause}
                className={`px-4 py-2 rounded font-bold ${
                  playing ? "bg-red-600" : "bg-green-600"
                }`}
              >
                {playing ? "Pause" : "Play"}
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max={crimeData.length - 1}
                value={currentCrimeIndex}
                onChange={handleSliderChange}
                className="w-full accent-red-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="mt-4 bg-gray-800 p-4 rounded">
              <p className="text-sm">{currentCrime.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading Map...</p>
      )}
    </section>
  );
};

export default CrimeTimeline; 