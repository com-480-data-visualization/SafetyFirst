import React, { useState } from "react";
import Plot from "react-plotly.js";

const CrimeSubtypesChart = ({activeCategory = "theft"}) => {

  const theftData = {
    "$500 AND UNDER": 660668,
    "OVER $500": 444873,
    "FROM BUILDING": 261958,
    "RETAIL THEFT": 225548,
    "PICKPOCKETING / PURSE-SNATCHING": 41868 + 18686,
    "FINANCIAL ID THEFT": 40261 + 14280 + 2681 + 2915,
    "ATTEMPTED THEFT": 13292,
    "VEHICLE RELATED": 3098,
    "COIN-OP / DELIVERY CONTAINERS": 1110 + 1092 + 59
  };

  const robberyData = {
    "ARMED: HANDGUN": 92812 + 18640 + 8457 + 1833,
    "STRONGARM / NO WEAPON": 91056 + 10735 + 10159 + 1253,
    "OTHER WEAPONS": 12879 + 2028 + 1444 + 215,
    "KNIFE / CUTTING INSTRUMENT": 12151 + 2223 + 1856 + 307,
    "AGGRAVATED / ATTEMPTED": 15529 + 982 + 338,
    "VEHICULAR HIJACKING": 15058 + 7173,
    "OTHER FIREARMS": 1372 + 413 + 287 + 96
  };

  const fraudData = {
    "CREDIT CARD FRAUD": 68590,
    "FRAUD OR CONFIDENCE GAME": 46002,
    "FINANCIAL IDENTITY THEFT": 41914 + 22260 + 6264 + 1010,
    "ILLEGAL USE CASH CARD": 38878,
    "FORGERY / COUNTERFEIT": 22882 + 13695 + 9205,
    "BOGUS CHECK": 16479,
    "THEFT OF LABOR / SERVICES": 32176 + 2584,
    "STOLEN PROPERTY BUY / RECEIVE / POSSESS": 2791 + 292,
    "UNAUTHORIZED VIDEOTAPING": 547
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
            text: `${activeCategory}`,
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
        config={{ displayModeBar: false }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default CrimeSubtypesChart;
