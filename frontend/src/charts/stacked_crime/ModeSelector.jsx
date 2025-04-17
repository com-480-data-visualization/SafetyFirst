import React from "react";

export default function ModeSelector({ mode, view, onModeChange, onBack }) {
    return (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 py-2 px-6 flex items-center" style={{}}>
            {view === "sub" && (
                <button onClick={onBack} className="mr-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded">
                    Back
                </button>
            )}
            <label className="mr-2">Statistics by:</label>
            <select value={mode} onChange={e => onModeChange(e.target.value)} className="text-black">
                <option value="year">Year</option>
                <option value="hour">Time of the Day</option>
            </select>
        </div>
    );
}
