import React, { useEffect, useRef } from "react";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";
import crimeImage from "../assets/2.jpg";
import ambientSound from "../assets/crime_scene_shadow.mp3";
import crimeLogo from "../assets/safety&crimes_logo.webp";

const Hero = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.5;
  }, []);

  const playSound = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <section
      className="relative h-screen w-full text-gray-100 overflow-hidden flex flex-col justify-center bg-midnight font-orbitron"
      id="hero"
    >
      {/* 🔴 Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={crimeImage}
          alt="Dark urban crime scene"
          title="Chicago at night"
          className="w-full h-full object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />
      </div>
      
      {/* 🔴 Navigation */}
      <header className="absolute top-0 left-0 w-full z-20 px-6 sm:px-10 py-4 flex items-center justify-between bg-black/30 backdrop-blur-md border-b border-white/10">
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
        <nav className="hidden sm:flex items-center gap-8 text-sm font-semibold text-gray-300">
          <a href="#map" className="hover:text-red-400" aria-label="Go to Live Map">Live Map</a>
          <a href="#analytics" className="hover:text-red-400" aria-label="Go to Analytics">Analytics</a>
          <a href="#reports" className="hover:text-red-400" aria-label="Go to Reports">Reports</a>
          <a href="#about" className="hover:text-red-400" aria-label="Learn About Us">About</a>
        </nav>
      </header>

      {/* 🔴 Hero Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 animate-fadeIn">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight text-glow">
          <span className="text-red-600">Uncovering </span>
          <span className="text-gray-100">the </span>
          <span className="text-gray-300">Dark Side</span>
        </h1>
        <p className="text-gray-300 text-lg mt-6 leading-relaxed">
          Your eyes on the streets. Explore real-time crime activity, analyze past patterns,
          and step into safer routes. This isn't just a map — it's a survival guide.
        </p>

        {/* 🔴 Buttons */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <a
            href="#map"
            onMouseEnter={playSound}
            className="bg-red-600 hover:bg-red-500 transition px-6 py-3 rounded-full font-semibold text-white flex items-center gap-2 shadow-lg hover:scale-105 hover-glow"
          >
            View Map <MapPin size={18} />
          </a>
          <a
            href="#learn-more"
            onMouseEnter={playSound}
            className="border border-gray-400 hover:border-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-white/10 transition hover:scale-105"
          >
            Learn More <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* 🔴 Floating Stats */}
      <div className="relative z-10 mt-20 flex flex-wrap justify-center gap-10 text-center text-white font-semibold text-lg px-4 animate-fadeIn">
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

      {/* 🔴 Scroll Arrow */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown
          className="text-red-500 animate-bounce"
          size={32}
          aria-label="Scroll down"
        />
      </div>

      {/* 🔴 Audio Element */}
      <audio
        ref={audioRef}
        src={ambientSound}
        preload="auto"
        title="Crime ambient background sound"
      />
    </section>
  );
};

export default Hero;