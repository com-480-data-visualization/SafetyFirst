import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const PlotlyBaseMap = () => {
  const [zoom, setZoom] = useState(11);

  return (
    <div className="bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative">
      <div className="rounded-xl overflow-hidden border-4 border-red-500 shadow-lg mx-auto" style={{ maxWidth: "1200px", height: "600px" }}>
          <Plot
            data={[
              {
                type: "scattermapbox",
                // A dummy point to display a red marker at Chicago
                lat: [41.8781],
                lon: [-87.6298],
                mode: "markers",
                marker: { size: 12, color: "red" },
              },
            ]}
            layout={{
              mapbox: {
                // Use the free "open-street-map" style which does not require an access token.
                style: "open-street-map",
                center: { lat: 41.8781, lon: -87.6298 },
                zoom: zoom,
              },
              margin: { t: 0, r: 0, b: 0, l: 0 },
              title: "Chicago Base Map",
            }}
            config={{
              displayModeBar: false,
              scrollZoom: false,
              doubleClick: false,
              clickmode: "event+select",
            }}
            style={{ width: "100%", height: "100%" }}
          />
      </div>
    </div>
  );
};

export default PlotlyBaseMap;


/* 

TO BE USED:

        <h2 className="text-xl font-bold text-center p-4 text-white">
            Crime Heatmap
        </h2>

        <input type="range"
        min={8}
        max={14}
        step={0.1}
        value={zoom}
        onChange={(e) => setZoom(parseFloat(e.target.value))}
        style={{ width: "90%", margin: "20px auto", display: "block" }}
        />

*/


/* 
<div className="flex flex-col gap-8">
    <div className="rounded-xl overflow-hidden border-4 border-red-500 shadow-lg">
                  
    </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="text-xl font-bold text-red-500">
                {currentCrime.date}: {currentCrime.title}
              </div>
              <button
                onClick={handlePlayPause}
                className={`px-4 py-2 rounded font-bold ${
                  playing ? "bg-red-600" : "bg-green-600"
                }`}
              >
                {playing ? "Pause" : "Play"}
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max={crimeData.length - 1}
                value={currentCrimeIndex}
                onChange={handleSliderChange}
                className="w-full accent-red-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="mt-4 bg-gray-800 p-4 rounded">
              <p className="text-sm">{currentCrime.description}</p>
            </div>
          </div>
</div>
*/ 
