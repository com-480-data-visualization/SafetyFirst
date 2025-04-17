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
    date: "Nov 2018",
    location: [41.9241, -87.6459],
    title: "DePaul Student Robbed at Gunpoint",
    description:
      'A male student was approached by 3 individuals near Cortelyou Commons. One displayed a gun and stole his belongings. <a href="https://www.fox32chicago.com/news/depaul-student-robbed-at-gunpoint-next-to-campus" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>.',
  },
  {
    id: 3,
    date: "Apr 2019",
    location: [41.7890, -87.5857],
    title: "UChicago Student Assaulted",
    description:
      'A first-year student was assaulted with a blunt object and robbed at East 59th & Stony Island Ave. <a href="https://chicagomaroon.com/26840/news/first-year-student-assaulted-robbed-near-stony-isl/" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>.',
  },
  {
    id: 2,
    date: "May 2019",
    location: [41.9252, -87.6538],
    title: "DePaul Student Robbed at Knifepoint",
    description:
      'A student was robbed at knifepoint near the Richardson Library early in the morning. The assailant fled north on Kenmore Ave. <a href="https://www.cbsnews.com/chicago/news/depaul-student-armed-robbery-laptop-richardson-library/" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>.',
  },
  {
    id: 4,
    date: "Feb 2023",
    location: [41.498641, -87.651551],
    title: "International Student Attacked",
    description:
      'An IT master\'s student from India was attacked and robbed near his residence on Campbell Ave. <a href="https://www.indiandiaspora.org/index.php/news/indian-student-attacked-and-robbed-chicago-usa" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>.',
  },
  {
    id: 5,
    date: "Dec 2024",
    location: [41.7904, -87.5909],
    title: "UChicago Students Robbed at Gunpoint",
    description:
      'Three students were robbed by armed assailants at the 5800 block of South Dorchester Avenue. <a href="https://www.cbsnews.com/chicago/news/armed-robbers-target-3-university-of-chicago-students-school-says/" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>.',
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
      'A 36-year-old tourist from New York was robbed at gunpoint while taking photographs at Buckingham Fountain. The robbers took his $5,000 camera, iPhone, and wallet before fleeing south. <a href="https://www.chicagotribune.com/2014/11/22/tourist-robbed-at-gunpoint-near-buckingham-fountain/" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>.',
  },
  {
    id: 2,
    date: "Oct 2015",
    location: [41.9032, -87.6267], // Oak Street Beach
    title: "Tourist Stabbed at Oak Street Beach",
    description:
      'A British tourist was stabbed and robbed while defending his girlfriend from three attackers near Oak Street Beach. After being treated at Northwestern Memorial Hospital, he tracked his stolen iPhone and helped police capture one of the suspects. <a href="https://www.nbcchicago.com/news/local/2-charged-after-tourist-stabbed-during-robbery-near-oak-street-beach/104795/" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>.',
  },
  {
    id: 3,
    date: "Sep 2017",
    location: [41.8664, -87.6065], // Shedd Aquarium
    title: "Man Mugged Behind Shedd Aquarium",
    description:
      'A 23-year-old man was robbed, beaten, and thrown into Lake Michigan while walking on a path behind the Shedd Aquarium just after midnight. He managed to get himself out of the water and call for help before being hospitalized. <a href="https://www.chicagotribune.com/2017/10/02/man-recalls-attack-near-shedd-aquarium-oh-my-god-it-cant-end-like-this/" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>.',
  },
  {
    id: 4,
    date: "Apr 2024",
    location: [41.8784, -87.6276], // 300 S State St, Chicago Loop
    title: "Tourist Robbed at Gunpoint in the Loop",
    description:
      'A 23-year-old man was robbed at gunpoint by a group of six (five men and one woman) while walking on State Street near The Art Institute of Chicago. One of the men brandished a handgun and demanded his belongings. The group fled north on State Street. <a href="https://abc7chicago.com/chicago-crime-man-robbed-at-gunpoint-in-loop-on-state-street-near-van-buren-downtown-pd-says/14726406/" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">Read more</a>.',
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
  const [showIntro, setShowIntro] = useState(true);
  const timerRef = useRef(null);
  const markerRefs = useRef([]);

  // Configure based on user type
  const isStudent = userType === "student";
  const crimeData = isStudent ? studentCrimeData : touristCrimeData;
  const themeColor = isStudent ? "primary" : "accent";
  const title = isStudent ? "Timeline of Crimes near Campuses" : "Timeline of Crimes near Tourist Attractions";
  const description = isStudent 
    ? "Find out about key incidents affecting students across Chicago."
    : "Find out about key incidents affecting tourists across Chicago.";

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

  useEffect(() => {
    // Open the popup for the current marker
    if (markerRefs.current[index]) {
      markerRefs.current[index].openPopup();
    }
  }, [index]);

  // Ensure the first marker's popup opens reliably
  useEffect(() => {
    if ((index === 0 || playing) && markerRefs.current[index]) {
      setTimeout(() => {
        if (markerRefs.current[index]) {
          markerRefs.current[index].openPopup();
        }
      }, 300);
    }
  }, [crimeData, index, playing]);

  const togglePlay = () => setPlaying(!playing);
  const handleSlider = (e) => setIndex(parseInt(e.target.value));

  // New: detect if at end
  const isAtEnd = index === crimeData.length - 1 && !playing;

  // New: restart handler
  const handleRestart = () => {
    setIndex(0);
    setPlaying(true);
  };

  // New: intro screen handler
  const handleStart = () => {
    setShowIntro(false);
    setPlaying(true);
    setTimeout(() => {
      if (markerRefs.current[0]) {
        markerRefs.current[0].openPopup();
      }
    }, 300);
  };

  return (
    <section className="bg-gray-50 text-slate-800 py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative" id="timeline">
      {showIntro ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
          <h2 class="text-3xl sm:text-4xl font-bold text-red-600 mb-4">
            Not Just Headlines — Real Tourists, Real Crimes
          </h2>
          <p class="text-lg text-gray-700">
            What starts as a dream vacation can take a dark turn in a matter of seconds. A stolen camera, a violent mugging, a lost passport — these aren’t just rare stories, they’re real incidents reported in the heart of Chicago’s most visited areas.
          </p>
          <p class="mt-4 text-lg text-gray-700">
            Scroll through these real-world cases mapped across the city. Every pin tells the story of a tourist whose experience became a cautionary tale. Don’t just explore — stay alert.
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-3 rounded bg-primary hover:bg-blue-700 text-white text-lg font-semibold shadow-lg transition hover-lift"
          >
            Start
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className={`text-4xl sm:text-5xl font-heading font-bold text-${themeColor} mb-4`}>
              {title}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className={`rounded-lg overflow-hidden border border-gray-300 shadow-subtle card animate-fadeIn relative`}>
            <MapContainer
              center={current.location}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "600px", width: "100%" }}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {crimeData.map((crime, i) => (
                <Marker
                  key={crime.id}
                  position={crime.location}
                  ref={el => (markerRefs.current[i] = el)}
                >
                  <Popup>
                    <h3 className={`font-bold text-${themeColor}`}>
                      {crime.title}
                    </h3>
                    <p className="text-sm text-secondary">{crime.date}</p>
                    <p className="text-xs text-slate-600" dangerouslySetInnerHTML={{ __html: crime.description }} />
                  </Popup>
                </Marker>
              ))}

              <FlyToMarker location={current.location} />
            </MapContainer>
          </div>

          {/* Timeline Controls */}
          <div className="bg-white p-6 rounded-lg shadow-subtle card mt-8 space-y-6 flex flex-col items-center">
            {/* Button on top */}
            <div className="flex justify-center w-full mb-2">
              {isAtEnd ? (
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-blue-700 transition"
                >
                  Restart
                </button>
              ) : (
                <button
                  onClick={togglePlay}
                  className={`px-4 py-2 rounded-lg font-bold shadow-md transition text-white ${
                    playing ? "bg-danger hover:bg-red-700" : "bg-primary hover:bg-blue-700"
                  }`}
                >
                  {playing ? "Pause" : "Play"}
                </button>
              )}
            </div>
            {/* Slider in the middle */}
            <div className="w-full max-w-xl flex flex-col items-center">
              <input
                type="range"
                min="0"
                max={crimeData.length - 1}
                value={index}
                onChange={handleSlider}
                className="crime-timeline-slider w-full"
                style={{
                  '--crime-timeline-color': themeColor === 'primary' ? '#2563eb' : '#f59e42',
                  background: `linear-gradient(90deg, ${themeColor === 'primary' ? '#2563eb' : '#f59e42'} ${(index)/(crimeData.length-1)*100}%, #e5e7eb ${(index)/(crimeData.length-1)*100}%)`
                }}
              />
              {/* Ticks below slider with labels */}
              <div className="relative w-full flex justify-between mt-3">
                {crimeData.map((crime, i) => (
                  <div key={crime.id} className="flex flex-col items-center" style={{width: 0}}>
                    <div className={`crime-timeline-slider-tick ${i === index ? `selected bg-${themeColor}` : 'bg-gray-300'}`}></div>
                    <div className={`font-bold mt-2 ${themeColor === 'primary' ? 'text-[#2563eb]' : 'text-[#f59e42]'} text-sm`}>{crime.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

// Add custom slider styles for a modern, theme-aware look
<style>{`
.crime-timeline-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  outline: none;
  transition: background 0.3s;
  box-shadow: none;
  margin: 0;
  padding: 0;
}
.crime-timeline-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--crime-timeline-color, #2563eb);
  box-shadow: 0 2px 6px rgba(37,99,235,0.10);
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
}
.crime-timeline-slider:focus::-webkit-slider-thumb,
.crime-timeline-slider:hover::-webkit-slider-thumb {
  border: 2.5px solid #1d4ed8;
  box-shadow: 0 0 0 4px rgba(37,99,235,0.10);
}
.crime-timeline-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--crime-timeline-color, #2563eb) 0%, #e5e7eb 100%);
}
.crime-timeline-slider::-ms-fill-lower {
  background: var(--crime-timeline-color, #2563eb);
  border-radius: 2px;
}
.crime-timeline-slider::-ms-fill-upper {
  background: #e5e7eb;
  border-radius: 2px;
}
.crime-timeline-slider:focus {
  outline: none;
}
.crime-timeline-slider::-ms-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--crime-timeline-color, #2563eb);
  box-shadow: 0 2px 6px rgba(37,99,235,0.10);
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
}
.crime-timeline-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--crime-timeline-color, #2563eb);
  box-shadow: 0 2px 6px rgba(37,99,235,0.10);
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
}
.crime-timeline-slider::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
}
.crime-timeline-slider::-ms-tooltip {
  display: none;
}
.crime-timeline-slider-tick {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #cbd5e1;
  margin-top: 2px;
  margin-bottom: 0.25rem;
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(37,99,235,0.08);
  transition: background 0.2s, box-shadow 0.2s, border 0.2s;
}
.crime-timeline-slider-tick.selected {
  background: var(--crime-timeline-color, #2563eb) !important;
  box-shadow: 0 4px 12px rgba(37,99,235,0.18);
  border: 3px solid #2563eb;
}
.leaflet-control-attribution,
.leaflet-control {
  display: none !important;
}
`}</style>

export default CrimeTimeline;