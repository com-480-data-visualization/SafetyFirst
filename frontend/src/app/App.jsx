import React, { Suspense, useState, useEffect } from "react";
import MapContainer from "../features/saferoute/MapContainer";
import NewsSlider from "../features/news/NewsSlider";
import LandingPage from "../features/landing/LandingPage";
import Navbar from "../layout/Navbar";
import DataStoryIntroduction from "../features/datastories/datastory";

// Lazy-loaded map
const BaseMap = React.lazy(() => import("../features/datastories/charts/CrimesTimeSpaceChart"));

const App = () => {
  const [view, setView] = useState("landing"); // landing | main | path
  const [userType, setUserType] = useState(null);

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


  const storyConclusion = (
    <div className="bg-gray-50 text-slate-800 py-6 px-4 sm:px-8 md:px-16 lg:px-32 relative">
      <h2 className="text-5xl sm:text-6xl font-heading font-bold text-primary mb-2">
        Plan Your Route
      </h2>
      <p className="mb-6">
        You've learned where pickpockets tend to strike, which neighborhoods see the most assaults, and how crime levels shift by hour and by block. Armed with this insight, you're ready to move from awareness to action.
      </p>
      <p className="mb-8">
        It's time to plot a course that keeps you in well-lit streets, away from trouble spots, and on the safest path through Chicago's vibrant neighborhoods.
      </p>
      <button
        onClick={() => handleNavigation("path")}
        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition mx-auto block"
      >
        Plan your safe Route
      </button>
    </div>
  )

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
          <div className="pt-20 px-4 sm:px-8 md:px-16 lg:px-32">
            <MapContainer />
          </div>
        </main>
      );
    }
  else {
    return (
      <>
        <Navbar onNavigate={handleNavigation} isStudent={userType === "student"}/>
        <main className="h-screen overflow-y-scroll overscroll-contain bg-gray-50 font-sans text-slate-800 mx-auto mt-20">
          <DataStoryIntroduction userType={userType} />
          <section id="news" className="min-h-screen flex flex-col justify-center snap-start mx-auto">
            <NewsSlider userType={userType} />
          </section>
          <section id="mapchart" className="min-h-screen justify-center snap-none mx-auto">
            <Suspense fallback={<div className="text-center p-10 text-slate-600">Loading Map...</div>}>
              <BaseMap />
            </Suspense>
          </section>
          <section className="min-h-screen flex flex-col justify-center snap-start overflow-scroll mx-auto">
            {storyConclusion}
          </section>
        </main>
      </>
    );
  }
};

export default App;