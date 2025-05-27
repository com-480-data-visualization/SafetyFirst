import React from "react";

/**
 * Instruction
 * A call-out box for highlighting interaction instructions.
 * 
 * Usage:
 * <Instruction>
 *   👉 Use the filters to focus on a specific area, year, or time range.
 * </Instruction>
 */
function InstructionParagraph({ children }) {
  return (
    <div className="mb-4 bg-secondary-light border-l-4 border-secondary p-4">
      <p className="font-semibold text-secondary-dark">
        {children}
      </p>
    </div>
  );
}

export default InstructionParagraph;