import React, { Suspense, useState, useEffect } from "react";
import Hero from "./components/Hero";
import MapContainer from "./components/MapContainer";
import CrimeTimeline from "./components/CrimeTimeline";
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
      <main className="bg-gray-50 font-sans text-slate-800 overflow-x-hidden h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        <Navbar onNavigate={handleNavigation} />
        <DataStoryIntroduction userType={userType} />
        <section id="news" className="h-screen snap-start w-screen overflow-hidden">
          <CrimeTimeline userType={userType} />
        </section>
        <section id="mapchart" className="min-h-screen snap-start w-screen">
          <Suspense fallback={<div className="text-center p-10 text-slate-600">Loading Map...</div>}>
            <BaseMap />
          </Suspense>
        </section>
        <section id="saferoute" className="h-screen snap-start w-screen overflow-hidden">
          <MapContainer />
        </section>
      </main>
    );
  }
};

export default App;
