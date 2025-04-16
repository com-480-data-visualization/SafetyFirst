import React from "react";
import { ArrowRight, MapPin, Users } from "lucide-react";
import crimeImage from "../assets/2.jpg";
import crimeLogo from "../assets/safety&crimes_logo.webp";

const LandingPage = ({ onNavigation }) => {
  return (
    <section
      className="relative h-screen w-full text-gray-100 overflow-hidden flex flex-col justify-between bg-midnight font-orbitron"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={crimeImage}
          alt="Dark urban crime scene"
          title="Chicago at night"
          className="w-full h-full object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />
      </div>
      
      {/* Navigation */}
      <header className="relative z-20 px-6 sm:px-10 py-4 flex items-center justify-between bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src={crimeLogo}
            alt="Safety & Crimes Logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-xl font-extrabold tracking-wider text-red-500">
            Safety & Crimes
          </h1>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 animate-fadeIn">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight text-glow">
          <span className="text-red-600">Safety </span>
          <span className="text-gray-100">First </span>
        </h1>
        <p className="text-gray-300 text-lg mt-6 leading-relaxed">
          Your eyes on the streets. Explore real-time crime activity, analyze past patterns,
          and step into safer routes. This isn't just a map — it's a survival guide.
        </p>
      </div>

      {/* Floating Stats */}
      <div className="relative z-10 flex flex-wrap justify-center gap-10 text-center text-white font-semibold text-lg px-4 animate-fadeIn">
        {[
          { stat: "1M+", label: "Active Reports" },
          { stat: "99%", label: "Safety Rate" },
          { stat: "24/7", label: "Live Monitoring" },
          { stat: "500K+", label: "Users Protected" },
        ].map(({ stat, label }, idx) => (
          <div
            key={idx}
            className="hover:scale-105 transition-all duration-300 cursor-default"
          >
            <p className="text-3xl font-extrabold text-red-500 animate-pulse text-glow">
              {stat}
            </p>
            <p className="text-gray-300 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="relative z-20 px-6 py-8 flex flex-col md:flex-row justify-center items-center gap-4 bg-black/50 backdrop-blur-md border-t border-white/10">
        <button
          onClick={() => onNavigation("path")}
          className="w-full md:w-auto bg-red-600 hover:bg-red-500 transition px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg hover:scale-105"
        >
          Safe Path Tool <MapPin size={18} />
        </button>
        
        <button
          onClick={() => onNavigation("student")}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg hover:scale-105"
        >
          Student Stories <Users size={18} />
        </button>
        
        <button
          onClick={() => onNavigation("tourist")}
          className="w-full md:w-auto bg-green-600 hover:bg-green-500 transition px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg hover:scale-105"
        >
          Tourist Stories <Users size={18} />
        </button>
      </div>
    </section>
  );
};

export default LandingPage; 