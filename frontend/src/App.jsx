import React, { Suspense, useState, useEffect } from "react";
import Hero from "./components/Hero";
import MapContainer from "./components/MapContainer";
import NewsSlider from "./components/NewsSlider";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import DataStoryIntroduction from "./components/datastories/datastory";


// Lazy-loaded map
const BaseMap = React.lazy(() => import("./components/datastories/charts/CrimesTimeSpaceChart"));

const storyConclusion = (
  <div className="bg-gray-50 text-slate-800 py-6 px-4 sm:px-8 md:px-16 lg:px-32 relative">
    <h2 className="text-5xl sm:text-6xl font-heading font-bold text-primary mb-2">
      Plan Your Route
    </h2>
    <p className="mb-6">
      You’ve learned where pickpockets tend to strike, which neighborhoods see the most assaults, and how crime levels shift by hour and by block. Armed with this insight, you’re ready to move from awareness to action.
    </p>
    <p className="mb-8">
      It’s time to plot a course that keeps you in well-lit streets, away from trouble spots, and on the safest path through Chicago’s vibrant neighborhoods.
    </p>
    <button
      onClick={() => setModeStory("route")}
      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition mx-auto block"
    >
      Plan your safe Route
    </button>
  </div>
)

const App = () => {
  const [view, setView] = useState("landing"); // landing | main | path
  const [userType, setUserType] = useState(null);
  const [animateDown, setAnimateDown] = useState(false);

  // Disable scroll on landing
  useEffect(() => {
    if (view === "landing") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [view]);

  const handleNavigation = (destination) => {
    switch (destination) {
      case "student":
      case "tourist":
        setUserType(destination);
        setView("main");
        break;
      case "path":
        setUserType("student");
        setView("path");
        break;
      case "landing":
        setView("landing");
        break;
      default:
        console.warn("Unknown navigation destination:", destination);
    }
  
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (view === "landing") {
    return (
      <main className="h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
        <LandingPage onNavigation={handleNavigation} />
      </main>
    );
  } else if (view === "path") {
      return (
        <main className="h-screen w-screen bg-gray-50 font-sans text-slate-800 overflow-x-hidden">
          <Navbar onNavigate={handleNavigation} />
          <MapContainer />
        </main>
      );
    }
  else {
    return (
      <>
        <Navbar className="fixed top-0 left-0 right-0 z-50 h-16" onNavigate={handleNavigation} isStudent={userType === "student"}/>
        <main className="h-screen overflow-y-scroll snap-y snap-mandatory overscroll-contain bg-gray-50 font-sans text-slate-800 mx-auto mt-16">
          <DataStoryIntroduction userType={userType} />
          <section id="news" className="h-screen flex flex-col justify-center snap-start mx-auto">
            <NewsSlider userType={userType} />
          </section>
          <section id="mapchart" className="h-screen flex flex-col justify-center snap-start mx-auto">
            <Suspense fallback={<div className="text-center p-10 text-slate-600">Loading Map...</div>}>
              <BaseMap />
            </Suspense>
          </section>
          <section className="snap-start overflow-hidden mx-auto">
            {storyConclusion}
          </section>
        </main>
      </>
    );
  }
};

export default App;

// OLD  pt-16 overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scroll-smooth overscroll-contain [scroll-padding-top:4rem]"