import React from "react";
import { ImStudentButton, ImTouristButton } from "../features/landing/presets";
import logo from "../assets/logo.png";


const Navbar = ({ onNavigate, isStudent }) => {
  return (
    <nav className="fixed top-0 left-0 w-full px-6 py-2 bg-white shadow-md flex items-center justify-between z-[9999]">
      <div
        onClick={() => onNavigate("landing")}
        onKeyDown={(e) => e.key === "Enter" && onNavigate("landing")}
        role="button"
        tabIndex={0}
        className="
          flex items-center cursor-pointer
          p-0 m-0 bg-transparent
          hover:bg-slate-100 focus:bg-slate-100
          focus:outline-none
        "
      >
        <img
          src={logo}
          alt="SafetyFirst"
          className="w-24"
        />
        <span className="text-xl font-bold text-teal-700">
          Go Home!
        </span>
      </div>
      <div className="hidden md:flex gap-6 text-slate-700 font-medium">
        <button
          onClick={() => onNavigate("path")}
          className="whitespace-nowrap hover:text-teal-600 flex-shrink-0"
        >
          Plan SafeRoute
        </button>
        { isStudent ? (
          <ImTouristButton onNavigation={onNavigate} />
        ) : (
          <ImStudentButton onNavigation={onNavigate} />
        )}        
        
      </div>
    </nav>
  );
};

export default Navbar;
