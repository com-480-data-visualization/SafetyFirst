import React, { Suspense, useState } from "react";
import Hero from "./components/Hero";
import MapContainer from "./components/MapContainer";
import StackedCrimeChart from "./charts/stacked_crime/StackedCrimeChart";
import CrimeTimeline from "./components/CrimeTimeline";
import UserTypeSelection from "./components/UserTypeSelection";

// Lazy-load heavy components
const BaseMap = React.lazy(() => import("./charts/CrimesTimeSpaceChart"));

const App = () => {
  const [userType, setUserType] = useState(null);

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If user hasn't selected a type yet, show selection screen
  if (!userType) {
    return <UserTypeSelection onSelectUserType={handleUserTypeSelection} />;
  }

  return (
    <main className="bg-midnight font-orbitron text-gray-100 overflow-x-hidden">
      {/* 🔴 Hero Section */}
      <Hero />

      {/* 🟡 Crime Timeline Section */}
      <CrimeTimeline userType={userType} />

      {/* 🔵 Stacked Crime Chart Section */}
      <StackedCrimeChart />

      {/* 🔵 Time-space Crime Chart Section */}
      <Suspense fallback={<div className="text-center">Loading Map...</div>}>
        <BaseMap />
      </Suspense>

      {/* 🔴 Map Section */}
      <MapContainer />

      {/* User Type Switcher */}
      <div className="fixed bottom-4 right-4 bg-gray-800 p-2 rounded-lg shadow-lg z-50">
        <button
          onClick={() => handleUserTypeSelection(userType === "student" ? "tourist" : "student")}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold transition"
        >
          Switch to {userType === "student" ? "Tourist" : "Student"} View
        </button>
      </div>
    </main>
  );
};

export default App;
