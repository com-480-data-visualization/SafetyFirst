import React, { Suspense, useState, useEffect } from "react";
import Hero from "./components/Hero";
import MapContainer from "./components/MapContainer";
import NewsSlider from "./components/NewsSlider";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import DataStoryIntroduction from "./components/datastories/datastory";


// Lazy-loaded map
const BaseMap = React.lazy(() => import("./components/datastories/charts/CrimesTimeSpaceChart"));

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
        <main className="bg-gray-50 font-sans text-slate-800 overflow-x-hidden">
          <Navbar onNavigate={handleNavigation} />
          <MapContainer />
        </main>
      );
    }
  else {
    return (
      <>
        <Navbar className="fixed top-0 left-0 right-0 z-50 h-16" onNavigate={handleNavigation}/>
        <main className="bg-gray-50 font-sans text-slate-800 overflow-x-hidden h-screen w-screen overflow-y-scroll mx-auto mt-16 overflow-x-hidden snap-y snap-mandatory scroll-smooth overscroll-contain [scroll-padding-top:4rem]">
          <DataStoryIntroduction userType={userType} />
          <section id="news" className="snap-start max-w-[1200px] overflow-hidden mx-auto">
            <NewsSlider userType={userType} />
          </section>
          <section id="mapchart" className="snap-start max-w-[1200px] mx-auto">
            <Suspense fallback={<div className="text-center p-10 text-slate-600">Loading Map...</div>}>
              <BaseMap />
            </Suspense>
          </section>
          <section id="saferoute" className="snap-start max-w-[1200px] overflow-hidden mx-auto">
            <MapContainer />
          </section>
        </main>
      </>
    );
  }
};

export default App;

// // "mt-16 overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scroll-smooth overscroll-contain [scroll-padding-top:4rem]"