import React, { useState } from "react";
import Plot from "react-plotly.js";

const CrimeSubtypesChart = ({activeCategory = "theft"}) => {

  const theftData = {
    "Under $500": 660668,
    "Over $500": 444873,
    "Theft from building": 261958,
    "Retail Theft": 225548,
    "Pickpocketing / Purse-Snatching": 41868 + 18686,
    "Financial ID Theft": 40261 + 14280 + 2681 + 2915,
    "Attempted Theft": 13292,
    "Vehicle-Related Theft": 3098,
    "Coin-Op / Delivery Containers": 1110 + 1092 + 59
  };

  const robberyData = {
    "Armed (Handgun)": 92812 + 18640 + 8457 + 1833,
    "Strongarm (No Weapon)": 91056 + 10735 + 10159 + 1253,
    "Other Weapons": 12879 + 2028 + 1444 + 215,
    "Knife / Cutting Instrument": 12151 + 2223 + 1856 + 307,
    "Attempted": 15529 + 982 + 338,
    "Vehicular Hijacking": 15058 + 7173,
    "Other Firearms": 1372 + 413 + 287 + 96
  };

  const fraudData = {
    "Credit Card Fraud": 68590,
    "Fraud / Confidence Game": 46002,
    "Financial Identity Theft": 41914 + 22260 + 6264 + 1010,
    "Illegal Use of Cash Card": 38878,
    "Forgery / Counterfeit": 22882 + 13695 + 9205,
    "Bogus Check": 16479,
    "Theft of Labor / Services": 32176 + 2584,
    "Stolen Property (Buy/Receive/Possess)": 2791 + 292,
    "Unauthorized Videotaping": 547
  };

  const dataMap = {
    theft: theftData,
    assault: robberyData,
    fraud: fraudData
  };

  const colors = {
    theft: "#e74c3c",
    assault: "#3498db",
    fraud: "#9b59b6"
  };

  // print activeCategory to console for debugging
  console.log("Active Category:", activeCategory);
  const current = dataMap[activeCategory];
  console.log("Current:", current);

  const sorted = Object.entries(current)
    .map(([desc, val]) => ({ desc, val }))
    .sort((a, b) => a.val - b.val);

  return (
    <div className="p-4">
      <Plot
        data={[
          {
            type: "bar",
            x: sorted.map((d) => d.val),
            y: sorted.map((d) => d.desc),
            orientation: "h",
            marker: {
              color: colors[activeCategory]
            },
          },
        ]}
        layout={{
          title: {
            text: `Subtypes of ${activeCategory}`,
            font: {
              size: 22,
              color: colors[activeCategory]
            },
            x: 0.5,
            xanchor: "center"
          },
          margin: { l: 280, r: 30, t: 60, b: 50 },
          yaxis: { automargin: true, tickfont: { size: 13 } },
          xaxis: { title: "Number of Cases", tickfont: { size: 13 } },
          paper_bgcolor: "#ffffff",
          plot_bgcolor: "#ffffff"
        }}
        config={{
          displayModeBar: false,            // hide the mode bar
          scrollZoom: false,                // no wheel zoom
          doubleClick: false,               // no dbl-click zoom
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default CrimeSubtypesChart;



/*
data={traces}
layout={{
  title: `Crime Trends Over the ${mode === "year" ? "Years" : "Hours"} by Category (Stacked)`,
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  xaxis: {
    title: xKey === "Year" ? "Year" : "Hour of the Day",
    fixedrange: true,
    tickfont: { color: "#000" },
  },
  yaxis: {
    title: "Number of Reported Crimes",
    fixedrange: true,
    tickfont: { color: "#000" },
  },
  margin: {
    l: 50,  // left
    r: 0,  // right
    t: 0,  // top (title)
    b: 30   // bottom
  },
  hovermode: "closest",
  showlegend: true,
  legend: {
    orientation: "h",           // horizontal orientation for multiple rows
    y: 1,                     // position above the plot (you may adjust this value)
    x: 0.5,                     // center it horizontally
    xanchor: "center",          // anchor at the horizontal center
    yanchor: "bottom",          // align the bottom of the legend to the y coordinate
    font: { color: "#000" },
  }
}}
config={{
  displayModeBar: false,
  scrollZoom: false,
  doubleClick: false,
  clickmode: "event+select",
}}
style={{
  width: "100%",
  height: "100%",
  minWidth: "300px",
  maxWidth: "800px",
  minHeight: "400px",
  maxHeight: "600px",
}}

*/