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

  const handleNavigation = (destination) => {
    if (destination === "student" || destination === "tourist") {
      setUserType(destination);
      setView("main");
    } else if (destination === "path") {
      // For the safe path tool, just show the map section
      setUserType("student"); // Default to student for path tool
      setView("path");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show landing page initially
  if (view === "landing") {
    return <LandingPage onNavigation={handleNavigation} />;
  }

  // Path view - only show the map/path tool
  if (view === "path") {
    return (
      <main className="bg-gray-50 font-sans text-slate-800 overflow-x-hidden">
        {/* Only show the Map component for the path tool */}
        <MapContainer />
        {/* Back to Landing Button */}
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

  // Main view with all components
  return (
    <main className="bg-gray-50 font-sans text-slate-800 overflow-x-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Crime Timeline Section */}
      <CrimeTimeline userType={userType} />

      {/* Stacked Crime Chart Section */}
      <StackedCrimeChart />

      {/* Time-space Crime Chart Section */}
      <Suspense fallback={<div className="text-center p-10 text-slate-600">Loading Map...</div>}>
        <BaseMap />
      </Suspense>

      {/* Map Section */}
      <MapContainer />

      {/* User Type Switcher */}
      <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-subtle z-50">
        <button
          onClick={() => {
            const newType = userType === "student" ? "tourist" : "student";
            setUserType(newType);
          }}
          className="px-4 py-2 bg-accent hover:bg-blue-500 rounded text-white font-medium transition hover-lift"
        >
          Switch to {userType === "student" ? "Tourist" : "Student"} View
        </button>
      </div>

      {/* Back to Landing Button */}
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
