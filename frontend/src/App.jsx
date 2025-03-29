import React from "react";
import Hero from "./components/Hero";
import MapContainer from "./components/MapContainer";

const App = () => {
  return (
    <main className="min-h-screen text-white font-orbitron bg-black overflow-x-hidden">
      {/* 🔴 Hero Section */}
      <Hero />

      {/* 🔴 Map Section */}
      <MapContainer />

      {/* 🔜 Future Sections like About, Footer, etc. */}
    </main>
  );
};

export default App;
