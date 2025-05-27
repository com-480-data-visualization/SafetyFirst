import React from "react";

const Navbar = ({ onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 w-full px-6 py-4 bg-white shadow-md flex items-center justify-between z-100">
      <div className="text-xl font-bold text-teal-700">SafetyFirst</div>
      <div className="hidden md:flex gap-6 text-slate-700 font-medium">
        <button onClick={() => onNavigate("landing")} className="hover:text-teal-600">Home</button>
        <button onClick={() => onNavigate("path")} className="hover:text-teal-600">Find Path</button>
        <button onClick={() => onNavigate("student")} className="hover:text-teal-600">Student View</button>
        <button onClick={() => onNavigate("tourist")} className="hover:text-teal-600">Tourist View</button>
      </div>
    </nav>
  );
};

export default Navbar;
