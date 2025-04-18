import React, { useEffect } from "react";
import { ArrowRight, MapPin, Users, ChevronDown } from "lucide-react";

const LandingPage = ({ onNavigation }) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <section
      className="relative h-screen w-full text-slate-800 overflow-hidden flex flex-col justify-between bg-gray-50 font-sans"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-gray-50 opacity-70" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683304-673a23048d34?q=80&w=2329')] bg-cover bg-center opacity-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6 flex flex-col justify-center flex-1 animate-fadeIn">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-extrabold leading-tight text-slate-900 drop-shadow-md mb-6">
          <span className="text-primary">In Chicago?</span> SafetyFirst!
        </h1>
        <p className="text-slate-700 text-xl sm:text-2xl mt-2 mb-8 font-medium">
          Your safety, our mission. No matter where you are in the city, we've got you covered.
        </p>
        <div className="space-y-6">
          <div className="bg-white/80 rounded-lg shadow-subtle p-6 flex flex-col gap-4">
            <button
              onClick={() => onNavigation("path")}
              className="w-full bg-primary hover:bg-blue-600 transition px-6 py-4 rounded-md font-semibold text-white flex items-center justify-center gap-3 text-lg shadow-md hover-lift"
            >
              <span>Find the Safest Path</span> <MapPin size={20} />
            </button>
            <p className="text-slate-600 text-base -mt-2">Worried about walking home late? Let us guide you with real-time safe route suggestions.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-white/80 rounded-lg shadow-subtle p-6 flex flex-col gap-2">
              <button
                onClick={() => onNavigation("student")}
                className="w-full bg-secondary hover:bg-slate-600 transition px-6 py-4 rounded-md font-semibold text-white flex items-center justify-center gap-3 text-lg shadow-md hover-lift"
              >
                <span>Student Stories</span> <Users size={20} />
              </button>
              <p className="text-slate-600 text-base -mt-2">New student coming to Chicago? Stay alert with real campus stories.</p>
            </div>
            <div className="flex-1 bg-white/80 rounded-lg shadow-subtle p-6 flex flex-col gap-2">
              <button
                onClick={() => onNavigation("tourist")}
                className="w-full bg-accent hover:bg-blue-500 transition px-6 py-4 rounded-md font-semibold text-white flex items-center justify-center gap-3 text-lg shadow-md hover-lift"
              >
                <span>Tourist Stories</span> <Users size={20} />
              </button>
              <p className="text-slate-600 text-base -mt-2">Exploring the city? It might not be as safe as you think, find out what has happened recently.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage; 