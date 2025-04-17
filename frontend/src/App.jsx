import React, { Suspense, useState } from "react";
import Hero from "./components/Hero";
import MapContainer from "./components/MapContainer";
import StackedCrimeChart from "./charts/stacked_crime/StackedCrimeChart";
import CrimeTimeline from "./components/CrimeTimeline";
import LandingPage from "./components/LandingPage";

// Lazy-load heavy components
const BaseMap = React.lazy(() => import("./charts/CrimesTimeSpaceChart"));

const App = () => {
  const [view, setView] = useState("landing");
  const [userType, setUserType] = useState(null);
  const [animateDown, setAnimateDown] = useState(false);

  const handleNavigation = (destination) => {
    if (destination === "student" || destination === "tourist") {
      setUserType(destination);
      setAnimateDown(true);
      setTimeout(() => {
        setView("main");
        setAnimateDown(false);
      }, 600);
    } else if (destination === "path") {
      setUserType("student");
      setAnimateDown(true);
      setTimeout(() => {
        setView("path");
        setAnimateDown(false);
      }, 600);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If in path view, show only the map tool
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

  // If animation is running or still on landing, stack both vertically and animate
  if (view === "landing" || animateDown) {
    return (
      <div
        style={{ height: "200vh", background: "#f8fafc", overflow: "hidden" }}
        className={animateDown ? "animate-slideUpPage" : ""}
      >
        <div style={{ height: "100vh" }}>
          <LandingPage onNavigation={handleNavigation} />
        </div>
        <div style={{ height: "100vh", overflow: "auto" }}>
          <main className="bg-gray-50 font-sans text-slate-800 overflow-x-hidden">
            <StackedCrimeChart userType={userType}/>
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
        </div>
      </div>
    );
  }

  // Main view after animation: only show main content
  return (
    <main className="bg-gray-50 font-sans text-slate-800 overflow-x-hidden">
      <StackedCrimeChart userType={userType}/>
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
