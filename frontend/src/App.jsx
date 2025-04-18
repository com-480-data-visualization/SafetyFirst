import React, { Suspense, useState, useEffect } from "react";
import Hero from "./components/Hero";
import MapContainer from "./components/MapContainer";
import StackedCrimeChart from "./charts/stacked_crime/StackedCrimeChart";
import CrimeTimeline from "./components/CrimeTimeline";
import LandingPage from "./components/LandingPage";

// Lazy-loaded map
const BaseMap = React.lazy(() => import("./charts/CrimesTimeSpaceChart"));

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
    if (destination === "student" || destination === "tourist") {
      setUserType(destination);
      setView("main");
    } else if (destination === "path") {
      setUserType("student");
      setView("path");
    }
  
    window.scrollTo({ top: 0, behavior: "smooth" });
  };  

  if (view === "landing") {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
        <LandingPage onNavigation={handleNavigation} />
      </div>
    );
  }

  if (view === "path") {
    return (
      <main className="bg-gray-50 font-sans text-slate-800 overflow-x-hidden">
        <MapContainer />
        <div className="fixed bottom-4 left-4 bg-white p-2 rounded-lg shadow-subtle z-50">
          <button
            onClick={() => setView("landing")}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-medium transition hover-lift"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 font-sans text-slate-800 overflow-x-hidden">
      <StackedCrimeChart userType={userType} />
      <CrimeTimeline userType={userType} />
      <Suspense fallback={<div className="text-center p-10 text-slate-600">Loading Map...</div>}>
        <BaseMap />
      </Suspense>
      <MapContainer />
      <div className="fixed bottom-4 left-4 bg-white p-2 rounded-lg shadow-subtle z-50">
        <button
          onClick={() => setView("landing")}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-medium transition hover-lift"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
};

export default App;
