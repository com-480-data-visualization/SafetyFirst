// src/components/CrimeTimeline.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default Leaflet icon fix for React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const chicagoCenter = [41.8781, -87.6298];

// Student crime data
const studentCrimeData = [
  {
    id: 1,
    date: "May 2017",
    location: [41.9252, -87.6538],
    title: "DePaul Student Robbed at Knifepoint",
    description:
      "A student was robbed at knifepoint near the Richardson Library early in the morning. The assailant fled north on Kenmore Ave.",
  },
  {
    id: 2,
    date: "Nov 2018",
    location: [41.9241, -87.6459],
    title: "DePaul Student Robbed at Gunpoint",
    description:
      "A male student was approached by 3 individuals near Cortelyou Commons. One displayed a gun and stole his belongings.",
  },
  {
    id: 3,
    date: "Apr 2019",
    location: [41.7890, -87.5857],
    title: "UChicago Student Assaulted",
    description:
      "A first-year student was assaulted with a blunt object and robbed at East 59th & Stony Island Ave.",
  },
  {
    id: 4,
    date: "Feb 2023",
    location: [41.498641, -87.651551],
    title: "International Student Attacked",
    description:
      "An IT master's student from India was attacked and robbed near his residence on Campbell Ave.",
  },
  {
    id: 5,
    date: "Dec 2024",
    location: [41.7904, -87.5909],
    title: "UChicago Students Robbed at Gunpoint",
    description:
      "Three students were robbed by armed assailants at the 5800 block of South Dorchester Avenue.",
  },
];

// Tourist crime data
const touristCrimeData = [
  {
    id: 1,
    date: "Nov 2014",
    location: [41.8758, -87.6189], // Buckingham Fountain
    title: "Photographer Robbed at Buckingham Fountain",
    description:
      "A 36-year-old tourist from New York was robbed at gunpoint while taking photographs at Buckingham Fountain. The robbers took his $5,000 camera, iPhone, and wallet before fleeing south.",
  },
  {
    id: 2,
    date: "Oct 2015",
    location: [41.9032, -87.6267], // Oak Street Beach
    title: "Tourist Stabbed at Oak Street Beach",
    description:
      "A British tourist was stabbed and robbed while defending his girlfriend from three attackers near Oak Street Beach. After being treated at Northwestern Memorial Hospital, he tracked his stolen iPhone and helped police capture one of the suspects.",
  },
  {
    id: 3,
    date: "Sep 2017",
    location: [41.8664, -87.6065], // Shedd Aquarium
    title: "Man Mugged Behind Shedd Aquarium",
    description:
      "A 23-year-old man was robbed, beaten, and thrown into Lake Michigan while walking on a path behind the Shedd Aquarium just after midnight. He managed to get himself out of the water and call for help before being hospitalized.",
  },
  {
    id: 4,
    date: "Jun 2019",
    location: [41.8789, -87.6359], // Willis Tower
    title: "SkyDeck Ledge Cracks Under Tourists",
    description:
      "Visitors to the Willis Tower's SkyDeck were terrified when the protective glass layer cracked under their feet, 1,353 feet above the ground. Officials stated there was no danger as only the protective coating, not the structural glass, had cracked.",
  },
  {
    id: 5,
    date: "May 2022",
    location: [41.8823, -87.6233], // Millennium Park/The Bean
    title: "Deadly Shooting Near The Bean",
    description:
      "A 16-year-old was shot and killed near the Cloud Gate sculpture (The Bean) in Millennium Park, leading to new weekend curfews and restrictions for unaccompanied minors in the area.",
  },
];

const FlyToMarker = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) map.flyTo(location, 15, { duration: 1.2 });
  }, [location]);
  return null;
};

const CrimeTimeline = ({ userType = "student" }) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  // Configure based on user type
  const isStudent = userType === "student";
  const crimeData = isStudent ? studentCrimeData : touristCrimeData;
  const themeColor = isStudent ? "primary" : "accent";
  const title = isStudent ? "Student Safety Timeline" : "Tourist Safety Timeline";
  const description = isStudent 
    ? "Follow the timeline of key campus safety incidents across Chicago."
    : "Follow the timeline of key incidents affecting tourists in Chicago.";

  const current = crimeData[index];

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setIndex((prev) => {
          if (prev === crimeData.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 6000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, crimeData.length]);

  const togglePlay = () => setPlaying(!playing);
  const handleSlider = (e) => setIndex(parseInt(e.target.value));

  return (
    <section className="bg-gray-50 text-slate-800 py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative" id="timeline">
      <div className="text-center mb-8">
        <h2 className={`text-4xl sm:text-5xl font-heading font-bold text-${themeColor} mb-4`}>
          {title}
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className={`rounded-lg overflow-hidden border border-gray-300 shadow-subtle card animate-fadeIn`}>
        <MapContainer
          center={current.location}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {crimeData.map((crime, i) => (
            <Marker key={crime.id} position={crime.location}>
              <Popup>
                <h3 className={`font-bold text-${themeColor}`}>
                  {crime.title}
                </h3>
                <p className="text-sm text-secondary">{crime.date}</p>
                <p className="text-xs text-slate-600">{crime.description}</p>
              </Popup>
            </Marker>
          ))}

          <FlyToMarker location={current.location} />
        </MapContainer>
      </div>

      {/* Timeline Controls */}
      <div className="bg-white p-6 rounded-lg shadow-subtle card mt-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className={`font-medium text-${themeColor} text-lg`}>
            {current.date}: {current.title}
          </div>
          <button
            onClick={togglePlay}
            className={`px-4 py-2 mt-4 md:mt-0 rounded ${
              playing ? "bg-danger" : "bg-success"
            } hover-lift text-white`}
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        <input
          type="range"
          min="0"
          max={crimeData.length - 1}
          value={index}
          onChange={handleSlider}
          className={`w-full accent-${themeColor} h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer`}
        />

        <div className="bg-gray-100 p-4 rounded text-sm text-slate-700">
          {current.description}
        </div>
      </div>
    </section>
  );
};

export default CrimeTimeline;