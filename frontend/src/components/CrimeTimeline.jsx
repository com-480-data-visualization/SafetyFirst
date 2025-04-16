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

const crimeData = [
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

const FlyToMarker = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) map.flyTo(location, 15, { duration: 1.2 });
  }, [location]);
  return null;
};

const CrimeTimeline = () => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

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
  }, [playing]);

  const togglePlay = () => setPlaying(!playing);
  const handleSlider = (e) => setIndex(parseInt(e.target.value));

  return (
    <section className="bg-midnight text-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative">
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-red-500 mb-4 text-glow">
          Campus Safety Timeline
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Follow the timeline of key campus crime incidents across Chicago.
        </p>
      </div>

      <div className="rounded-xl overflow-hidden border-4 border-red-500 shadow-lg animate-fadeIn">
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
                <h3 className="font-bold text-red-500">{crime.title}</h3>
                <p className="text-sm text-yellow-400">{crime.date}</p>
                <p className="text-xs">{crime.description}</p>
              </Popup>
            </Marker>
          ))}

          <FlyToMarker location={current.location} />
        </MapContainer>
      </div>

      {/* Timeline Controls */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mt-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="font-bold text-red-400 text-lg">
            {current.date}: {current.title}
          </div>
          <button
            onClick={togglePlay}
            className={`px-4 py-2 mt-4 md:mt-0 rounded font-bold ${
              playing ? "bg-red-600" : "bg-green-600"
            } hover:scale-105 transition`}
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
          className="w-full accent-red-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />

        <div className="bg-gray-800 p-4 rounded text-sm">
          {current.description}
        </div>
      </div>
    </section>
  );
};

export default CrimeTimeline;