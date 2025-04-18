import React from "react";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative h-screen w-full text-slate-800 overflow-hidden flex flex-col justify-center bg-gray-50 font-sans"
      id="hero"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-gray-50 opacity-70" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683304-673a23048d34?q=80&w=2329')] bg-cover bg-center opacity-10" />
      </div>
      
      {/* Navigation */}
      <header className="absolute top-0 left-0 w-full z-20 px-6 sm:px-10 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt="Safety First Logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-xl font-heading font-bold tracking-wider text-primary">
            Safety First
          </h1>
        </div>
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#map" className="hover:text-primary" aria-label="Go to Live Map">Live Map</a>
          <a href="#analytics" className="hover:text-primary" aria-label="Go to Analytics">Analytics</a>
          <a href="#reports" className="hover:text-primary" aria-label="Go to Reports">Reports</a>
          <a href="#about" className="hover:text-primary" aria-label="Learn About Us">About</a>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 animate-fadeIn">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold leading-tight text-slate-800">
          <span className="text-primary">Smart </span>
          <span className="text-slate-900">Urban Safety</span>
        </h1>
        <p className="text-slate-600 text-lg mt-6 leading-relaxed">
          Navigate with confidence. Explore safety insights, analyze data patterns,
          and plan safer routes through your city.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <a
            href="#map"
            className="bg-primary hover:bg-blue-600 transition px-6 py-3 rounded-md font-medium text-white flex items-center gap-2 shadow-subtle hover-lift"
          >
            View Map <MapPin size={18} />
          </a>
          <a
            href="#learn-more"
            className="border border-gray-300 hover:border-primary px-6 py-3 rounded-md font-medium text-slate-700 flex items-center gap-2 hover:bg-white/60 transition hover-lift"
          >
            Learn More <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="relative z-10 mt-20 flex flex-wrap justify-center gap-10 text-center text-slate-700 font-medium text-lg px-4 animate-fadeIn">
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
            <p className="text-3xl font-bold text-primary">
              {stat}
            </p>
            <p className="text-slate-600 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Scroll Arrow */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown
          className="text-primary animate-bounce"
          size={32}
          aria-label="Scroll down"
        />
      </div>
    </section>
  );
};

export default Hero;