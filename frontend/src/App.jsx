import React from "react";
import Hero from "./components/Hero";
import MapContainer from "./components/MapContainer";
import StackedCrimeChart from "./charts/stacked_crime/StackedCrimeChart";
import BaseMap from "./charts/CrimesTimeSpaceChart";
import CrimeTimeline from "./components/CrimeTimeline";

const App = () => {
  return (
    <main className="min-h-screen text-white font-orbitron bg-black overflow-x-hidden">
      {/* 🔴 Hero Section */}
      <Hero />

      {/* 🟡 Crime Timeline Section */}
      <CrimeTimeline />

      {/* 🔵 Stacked Crime Chart Section */}
      <section className="p-4">
        <StackedCrimeChart />
      </section>

      {/* 🔵 Time space Crime Chart Section */}
      <section className="p-4">
        <BaseMap />
      </section>

      {/* 🔴 Map Section */}
      <MapContainer />

      {/* 🔜 Future Sections like About, Footer, etc. */}
    </main>
  );
};

export default App;
