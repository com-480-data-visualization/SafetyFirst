import React from "react";
import { ArrowRight, MapPin, Users, ChevronDown } from "lucide-react";


/**
 * Instruction
 * A call-out box for highlighting interaction instructions.
 * 
 * Usage:
 * <Instruction>
 *   👉 Use the filters to focus on a specific area, year, or time range.
 * </Instruction>
 */
export function InstructionParagraph({ children }) {
  return (
    <div className="mb-4 bg-secondary-light border-l-4 border-secondary p-4">
      <p className="font-semibold text-secondary-dark">
        {children}
      </p>
    </div>
  );
}

export function ImTouristButton({onNavigation}) {
    return (
    <button
        onClick={() => onNavigation("tourist")}
        className="w-full bg-accent hover:bg-slate-500 transition px-6 py-4 rounded-md font-semibold text-white flex items-center justify-center gap-3 text-lg shadow-md hover-lift"
    >
        <span>I'm a tourist</span> <Users size={20} />
  </button>
    );
}

export function ImStudentButton({onNavigation}) {
    return (
    <button
        onClick={() => onNavigation("student")}
        className="w-full bg-secondary hover:bg-slate-600 transition px-6 py-4 rounded-md font-semibold text-white flex items-center justify-center gap-3 text-lg shadow-md hover-lift"
    >
        <span>I'm a student</span> <Users size={20} />
    </button>
    );
}

export default InstructionParagraph;