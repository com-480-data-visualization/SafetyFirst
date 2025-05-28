import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, ExternalLink, Calendar, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default Leaflet icon fix for React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Enhanced student crime data with images and full articles
const studentNewsData = [
  {
    id: 1,
    date: "Nov 2018",
    location: [41.9241, -87.6459],
    title: "DePaul Student Robbed at Gunpoint",
    subtitle: "Armed robbery near campus shakes university community",
    image: "/SafetyFirst/images/news-stories/student/depaul-campus.jpg",
    excerpt: "A male student was approached by 3 individuals near Cortelyou Commons. One displayed a gun and stole his belongings.",
    fullArticle: "A DePaul University student was robbed at gunpoint Tuesday evening near the Lincoln Park campus, according to university officials. The incident occurred around 8:30 p.m. near Cortelyou Commons when three suspects approached the male student. One of the suspects displayed a handgun and demanded the victim's belongings, including his backpack, phone, and wallet. The suspects fled the scene on foot heading north. DePaul Public Safety immediately issued a campus-wide alert and is working closely with Chicago Police to investigate the incident.",
    source: "Fox 32 Chicago",
    sourceUrl: "https://www.fox32chicago.com/news/depaul-student-robbed-at-gunpoint-next-to-campus",
    category: "Campus Safety"
  },
  {
    id: 2,
    date: "Apr 2019",
    location: [41.7890, -87.5857],
    title: "UChicago Student Assaulted",
    subtitle: "First-year student attacked with blunt object near campus",
    image: "/SafetyFirst/images/news-stories/student/uchicago-campus.jpg",
    excerpt: "A first-year student was assaulted with a blunt object and robbed at East 59th & Stony Island Ave.",
    fullArticle: "A University of Chicago first-year student was assaulted and robbed Monday evening near the Hyde Park campus. The incident occurred at approximately 9:15 p.m. at the intersection of East 59th Street and Stony Island Avenue. According to police reports, the victim was struck with a blunt object by an unknown assailant who then stole personal belongings. The student was transported to a nearby hospital for treatment of non-life-threatening injuries. The University of Chicago Police Department has increased patrols in the area and is reviewing security camera footage.",
    source: "Chicago Maroon",
    sourceUrl: "https://chicagomaroon.com/26840/news/first-year-student-assaulted-robbed-near-stony-isl/",
    category: "Campus Safety"
  },
  {
    id: 3,
    date: "May 2019",
    location: [41.9252, -87.6538],
    title: "DePaul Student Robbed at Knifepoint",
    subtitle: "Early morning attack near Richardson Library",
    image: "/SafetyFirst/images/news-stories/student/richardson-library.jpg",
    excerpt: "A student was robbed at knifepoint near the Richardson Library early in the morning. The assailant fled north on Kenmore Ave.",
    fullArticle: "A DePaul University student was robbed at knifepoint early Wednesday morning near the Richardson Library on the Lincoln Park campus. The incident occurred around 2:30 a.m. as the student was walking alone after a late study session. The suspect, described as a male in his 20s, approached the victim with a knife and demanded valuables including a laptop and phone. After the robbery, the suspect fled north on Kenmore Avenue. DePaul Public Safety has increased overnight security patrols and reminds students to use the campus escort service during late hours.",
    source: "CBS Chicago",
    sourceUrl: "https://www.cbsnews.com/chicago/news/depaul-student-armed-robbery-laptop-richardson-library/",
    category: "Campus Safety"
  },
  {
    id: 4,
    date: "Feb 2023",
    location: [41.498641, -87.651551],
    title: "International Student Attacked",
    subtitle: "IT master's student from India robbed near residence",
    image: "/SafetyFirst/images/news-stories/student/student-housing.jpg",
    excerpt: "An IT master's student from India was attacked and robbed near his residence on Campbell Ave.",
    fullArticle: "An international student pursuing his master's degree in Information Technology was attacked and robbed near his off-campus residence on Campbell Avenue. The 24-year-old student from India was returning home from evening classes when he was approached by two suspects who demanded his belongings. The victim sustained minor injuries during the altercation and was treated at a local hospital. The incident has raised concerns about the safety of international students living in off-campus housing. Local community leaders are calling for increased police presence in areas with high concentrations of student housing.",
    source: "Indian Diaspora",
    sourceUrl: "https://www.indiandiaspora.org/index.php/news/indian-student-attacked-and-robbed-chicago-usa",
    category: "International Students"
  },
  {
    id: 5,
    date: "Dec 2024",
    location: [41.7904, -87.5909],
    title: "UChicago Students Robbed at Gunpoint",
    subtitle: "Three students targeted by armed assailants",
    image: "/SafetyFirst/images/news-stories/student/hyde-park-street.jpg",
    excerpt: "Three students were robbed by armed assailants at the 5800 block of South Dorchester Avenue.",
    fullArticle: "Three University of Chicago students were robbed at gunpoint Sunday evening in the Hyde Park neighborhood, according to a campus-wide safety alert. The incident occurred around 7:45 p.m. in the 5800 block of South Dorchester Avenue when the students were approached by multiple armed suspects. The robbers demanded and took personal belongings including phones, wallets, and backpacks before fleeing the scene. None of the students were physically harmed during the incident. The University of Chicago Police Department is investigating and has increased patrols in the area. Students are advised to travel in groups and remain aware of their surroundings.",
    source: "CBS Chicago",
    sourceUrl: "https://www.cbsnews.com/chicago/news/armed-robbers-target-3-university-of-chicago-students-school-says/",
    category: "Campus Safety"
  }
];

// Enhanced tourist crime data with images and full articles
const touristNewsData = [
  {
    id: 1,
    date: "Nov 2014",
    location: [41.8758, -87.6189],
    title: "Photographer Robbed at Buckingham Fountain",
    subtitle: "New York tourist loses $5,000 camera equipment",
    image: "/SafetyFirst/images/news-stories/tourist/buckingham-fountain.jpg",
    excerpt: "A 36-year-old tourist from New York was robbed at gunpoint while taking photographs at Buckingham Fountain.",
    fullArticle: "A New York photographer visiting Chicago for a weekend getaway became the victim of an armed robbery at one of the city's most iconic landmarks. The 36-year-old tourist was capturing sunset photos at Buckingham Fountain when three suspects approached him around 7:30 p.m. One of the suspects displayed a handgun and demanded his expensive camera equipment, valued at over $5,000, along with his iPhone and wallet containing $300 cash. The robbers fled south toward Grant Park. Chicago Police are reviewing security footage from the area and have increased patrols around major tourist attractions.",
    source: "Chicago Tribune",
    sourceUrl: "https://www.chicagotribune.com/2014/11/22/tourist-robbed-at-gunpoint-near-buckingham-fountain/",
    category: "Tourist Safety"
  },
  {
    id: 2,
    date: "Oct 2015",
    location: [41.9032, -87.6267],
    title: "Tourist Stabbed at Oak Street Beach",
    subtitle: "British visitor injured defending girlfriend from attackers",
    image: "/SafetyFirst/images/news-stories/tourist/oak-street-beach.jpg",
    excerpt: "A British tourist was stabbed and robbed while defending his girlfriend from three attackers near Oak Street Beach.",
    fullArticle: "A British tourist was stabbed during a robbery attempt near Oak Street Beach while trying to protect his girlfriend from three attackers. The 28-year-old visitor was walking with his girlfriend along the lakefront around 10:30 p.m. when they were approached by three suspects who demanded their belongings. When the tourist attempted to shield his girlfriend, one of the suspects stabbed him in the shoulder. After receiving treatment at Northwestern Memorial Hospital, the victim used his phone's tracking feature to help police locate one of the suspects who had stolen his device. Two arrests were made in connection with the incident.",
    source: "NBC Chicago",
    sourceUrl: "https://www.nbcchicago.com/news/local/2-charged-after-tourist-stabbed-during-robbery-near-oak-street-beach/104795/",
    category: "Tourist Safety"
  },
  {
    id: 3,
    date: "Sep 2017",
    location: [41.8664, -87.6065],
    title: "Man Mugged Behind Shedd Aquarium",
    subtitle: "Victim thrown into Lake Michigan during robbery",
    image: "/SafetyFirst/images/news-stories/tourist/shedd-aquarium.jpg",
    excerpt: "A 23-year-old man was robbed, beaten, and thrown into Lake Michigan while walking on a path behind the Shedd Aquarium.",
    fullArticle: "A 23-year-old man experienced a terrifying ordeal when he was robbed, beaten, and thrown into Lake Michigan during a late-night attack behind the Shedd Aquarium. The incident occurred just after midnight as the victim was walking alone on the lakefront path. Multiple suspects approached him, demanded his belongings, and after taking his wallet and phone, physically assaulted him before pushing him into the lake. The victim managed to swim to safety and call for help using a nearby emergency phone. He was hospitalized with hypothermia and minor injuries. The incident prompted increased security measures along the Museum Campus.",
    source: "Chicago Tribune",
    sourceUrl: "https://www.chicagotribune.com/2017/10/02/man-recalls-attack-near-shedd-aquarium-oh-my-god-it-cant-end-like-this/",
    category: "Tourist Safety"
  },
  {
    id: 4,
    date: "May 2022",
    location: [41.8823, -87.6233],
    title: "Deadly Shooting Near The Bean",
    subtitle: "Teen killed at Millennium Park prompts new security measures",
    image: "/SafetyFirst/images/news-stories/tourist/the-bean.jpg",
    excerpt: "A 16-year-old was shot and killed near the Cloud Gate sculpture (The Bean) in Millennium Park.",
    fullArticle: "A tragic shooting near Chicago's iconic Cloud Gate sculpture, known as 'The Bean,' resulted in the death of a 16-year-old and led to significant changes in Millennium Park's security protocols. The incident occurred during a busy Saturday evening when the park was filled with tourists and locals. The shooting prompted immediate evacuation of the area and led to the implementation of new weekend curfews for unaccompanied minors. The city has since increased security presence in Millennium Park, installed additional lighting, and implemented bag checks during peak tourist seasons. The incident highlighted ongoing concerns about safety in Chicago's most visited tourist destinations.",
    source: "Chicago Sun-Times",
    sourceUrl: "#",
    category: "Public Safety"
  },
  {
    id: 5,
    date: "Apr 2024",
    location: [41.8784, -87.6276],
    title: "Tourist Robbed at Gunpoint in the Loop",
    subtitle: "Group of six suspects target visitor near Art Institute",
    image: "/SafetyFirst/images/news-stories/tourist/chicago-loop.jpg",
    excerpt: "A 23-year-old man was robbed at gunpoint by a group of six while walking on State Street near The Art Institute of Chicago.",
    fullArticle: "A 23-year-old tourist was robbed at gunpoint by a group of six suspects while exploring downtown Chicago near the Art Institute. The incident occurred around 3:30 p.m. on State Street as the victim was walking between cultural attractions. The group, consisting of five men and one woman, surrounded the tourist with one suspect brandishing a handgun. They demanded and took his wallet, phone, and camera before fleeing north on State Street. The brazen daylight robbery in a busy tourist area has prompted Chicago Police to increase patrols in the Loop district and around major cultural institutions.",
    source: "ABC 7 Chicago",
    sourceUrl: "https://abc7chicago.com/chicago-crime-man-robbed-at-gunpoint-in-loop-on-state-street-near-van-buren-downtown-pd-says/14726406/",
    category: "Tourist Safety"
  }
];

const NewsSlider = ({ userType = "student" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const newsData = userType === "student" ? studentNewsData : touristNewsData;
  const currentStory = newsData[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === newsData.length - 1 ? 0 : prev + 1));
  };

  const handleStorySelect = (index) => {
    setCurrentIndex(index);
  };

  const headlinesIntroTourist = (
    <>
      {/* Transition from data into news headlines visualization */}
      <h2 className="text-2xl font-bold mb-3">
        🔍 Not Just Headlines — Real Tourists, Real Crimes
      </h2>

      <p className="mb-3 italic text-sm">
        The numbers gave you some clarity, but a knot of worry still tightens in your chest…
      </p>
  
      <p className="mb-3 text-sm">
      You pull out your phone, open your news app, and search:
      <span className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1 ml-1 border border-gray-800 text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 4a7 7 0 015.916 10.944l4.07 4.07a1 1 0 01-1.415 1.415l-4.07-4.07A7 7 0 1111 4z"
          />
        </svg>
        <span className="ml-1 text-gray-700 font-medium">Chicago tourist attacked</span>
      </span>
      . Articles flood in: pickpocketing near Navy Pier, late-night muggings along the riverwalk, even reports of assaults downtown.
      </p>
  
      <p className="mb-4 text-sm">
        Data can show trends, but headlines tell the human side of the story. You need to see these reports in context—how often they appear, which outlets cover them most, and whether the fear matches the facts.
      </p>
      </>
  )

  const headlinesIntroStudent = (
    <>
      {/* Transition from data into news headlines visualization */}
      <h2 className="text-2xl font-bold mb-3">
        🔍 Not Just Headlines — Real Students, Real Crimes
      </h2>

      <p className="mb-3 italic text-sm">
        The numbers gave you some clarity, but a knot of worry still tightens in your chest…
      </p>
  
      <p className="mb-3 text-sm">
      You pull out your phone, open your news app, and search:
      <span className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1 ml-1 border border-gray-800 text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 4a7 7 0 015.916 10.944l4.07 4.07a1 1 0 01-1.415 1.415l-4.07-4.07A7 7 0 1111 4z"
          />
        </svg>
        <span className="ml-1 text-gray-700 font-medium">Chicago student attacked</span>
      </span>
      . Articles flood in: pickpocketing near campus, late-night muggings near dorms, even reports of assaults downtown.
      </p>
  
      <p className="mb-4 text-sm">
        Data can show trends, but headlines tell the human side of the story. You need to see these reports in context—how often they appear, which outlets cover them most, and whether the fear matches the facts.
      </p>
      </>
  )

  return (
    <div className="bg-gray-50 text-slate-800 py-8 px-4 sm:px-8 md:px-16 lg:px-32 relative">
      {/* Header Introduction */}
      {userType === "tourist" ? headlinesIntroTourist : headlinesIntroStudent}
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-2">

        {/* Main Story Display */}
        <div className="max-w-5xl mx-auto">
          {/* Navigation and Story Container */}
          <div className="flex items-center gap-4">
            {/* Left Arrow */}
            <button
              onClick={handlePrevious}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            >
              <span className="text-xl text-gray-600 group-hover:text-gray-800 transition-colors">‹</span>
            </button>

            {/* Story Content - Fixed Size */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full h-[500px] flex flex-col">
              {/* Story Image */}
              <div className="relative h-56">
                <img
                  src={currentStory.image}
                  alt={currentStory.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Story Content - Fixed Height */}
              <div className="p-5 flex-1 flex flex-col overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {currentStory.title}
                </h3>
                <p className="text-base text-gray-600 mb-4">
                  {currentStory.subtitle}
                </p>
                
                <div className="text-gray-700 mb-4 leading-relaxed flex-1 overflow-y-auto">
                  <p className="text-sm">{currentStory.fullArticle}</p>
                </div>

                {/* Source Link */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Source: {currentStory.source}</span>
                  </div>
                  {currentStory.sourceUrl !== "#" && (
                    <a
                      href={currentStory.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-1 text-sm font-medium hover:underline ${
                        userType === "student" ? "text-blue-600" : "text-orange-600"
                      }`}
                    >
                      <span>Read Original</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            >
              <span className="text-xl text-gray-600 group-hover:text-gray-800 transition-colors">›</span>
            </button>
          </div>

          {/* Simple Date Navigation */}
          <div className="mt-6 flex justify-center">
            <div className="flex flex-wrap gap-3 justify-center">
              {newsData.map((story, index) => (
                <button
                  key={story.id}
                  onClick={() => handleStorySelect(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    index === currentIndex
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {story.date}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSlider; 