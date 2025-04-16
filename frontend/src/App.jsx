import React, { Suspense } from "react";
import Hero from "./components/Hero";
import MapContainer from "./components/MapContainer";
import StackedCrimeChart from "./charts/stacked_crime/StackedCrimeChart";
import CrimeTimeline from "./components/CrimeTimeline";

// Lazy-load heavy components
const BaseMap = React.lazy(() => import("./charts/CrimesTimeSpaceChart"));

const App = () => {
  return (
    <main className="bg-midnight font-orbitron text-gray-100 overflow-x-hidden">
      {/* 🔴 Hero Section */}
      <Hero />

      {/* 🟡 Crime Timeline Section */}
      <CrimeTimeline />

      {/* 🔵 Stacked Crime Chart Section */}
      <StackedCrimeChart />

      {/* 🔵 Time-space Crime Chart Section */}
      <Suspense fallback={<div className="text-center">Loading Map...</div>}>
        <BaseMap />
      </Suspense>

      {/* 🔴 Map Section */}
      <MapContainer />
    </main>
  );
};

export default App;
