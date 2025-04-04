import React, { useState } from "react";
import Plot from "react-plotly.js";
import crimeData from "../data/crime_category_over_years.json";

export default function StackedCrimeChart() {
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [revision, setRevision] = useState(0);
  const [hoverInfo, setHoverInfo] = useState(null);

  const { 
    "Year": years, 
    "ASSAULT": assault, 
    "MINOR": minor, 
    "NON STREET CRIME": nonStreet, 
    "SEX OFFENSE": sexOffense, 
    "THEFT": theft 
  } = crimeData;

  // Helper: return true if no trace is selected or if the trace index matches the selected trace.
  const isVisible = (traceIndex) => selectedTrace === null || selectedTrace === traceIndex;

  const traces = [
    {
      x: years,
      y: assault,
      name: "ASSAULT",
      type: "scatter",
      mode: "lines",
      hoveron: "fills",
      fill: "tonexty",
      stackgroup: "one",
      line: { color: "#1f77b4" },
      hovertemplate: "%{x}<br>ASSAULT: %{y}<extra></extra>",
      visible: isVisible(0) ? true : "legendonly",
    },
    {
      x: years,
      y: minor,
      name: "MINOR",
      type: "scatter",
      mode: "lines",
      hoveron: "fills",
      fill: "tonexty",
      stackgroup: "one",
      line: { color: "#ff7f0e" },
      hovertemplate: "%{x}<br>MINOR: %{y}<extra></extra>",
      visible: isVisible(1) ? true : "legendonly",
    },
    {
      x: years,
      y: nonStreet,
      name: "NON STREET CRIME",
      type: "scatter",
      mode: "lines",
      hoveron: "fills",
      fill: "tonexty",
      stackgroup: "one",
      line: { color: "#2ca02c" },
      hovertemplate: "%{x}<br>NON STREET: %{y}<extra></extra>",
      visible: isVisible(2) ? true : "legendonly",
    },
    {
      x: years,
      y: sexOffense,
      name: "SEX OFFENSE",
      type: "scatter",
      mode: "lines",
      hoveron: "fills",
      fill: "tonexty",
      stackgroup: "one",
      line: { color: "#d62728" },
      hovertemplate: "%{x}<br>SEX OFFENSE: %{y}<extra></extra>",
      visible: isVisible(3) ? true : "legendonly",
    },
    {
      x: years,
      y: theft,
      name: "THEFT",
      type: "scatter",
      mode: "lines",
      hoveron: "fills",
      fill: "tonexty",
      stackgroup: "one",
      line: { color: "#9467bd" },
      hovertemplate: "%{x}<br>THEFT: %{y}<extra></extra>",
      visible: isVisible(4) ? true : "legendonly",
    },
  ];

  // Custom hover logic function.
  const handleHover = (event) => {
    if (event.points && event.points.length > 0) {
      const point = event.points[0];
      console.log("Hover event data:", point);
      setHoverInfo(`You hovered over ${point.data.name} at ${point.x} with value ${point.y}`);
    }
  };

  // Clear hover info when not hovering.
  const handleUnhover = () => {
    console.log("Unhover event");
    setHoverInfo(null);
  };

  const handleClick = (event) => {
    if (event.points && event.points.length > 0) {
      const traceIndex = event.points[0].curveNumber;
      console.log("Clicked trace index:", traceIndex);
      const newSelection = selectedTrace === traceIndex ? null : traceIndex;
      setSelectedTrace(newSelection);
    }
  };

  return (
    <div>
      <Plot
        data={traces}
        layout={{
          title: "Crime Trends Over the Years by Category (Stacked)",
          xaxis: { title: "Year", fixedrange: true },
          yaxis: { title: "Number of Reported Crimes", fixedrange: true },
          hovermode: "closest",
          showlegend: true,
          legend: {
            x: 1,
            y: 1,
            xanchor: "right",
            yanchor: "top",
            itemclick: "toggleothers", // isolates the clicked trace on single click
            bgcolor: "rgba(0, 0, 0, 0.5)", // optional: a semi-transparent background for clarity
            font: { color: "#fff" }         // adjust text color if needed
          },
        }}
        config={{
          displayModeBar: false,
          scrollZoom: false,
          doubleClick: false,
          clickmode: "event+select",
        }}
        style={{ width: "80%", height: "800px" }}
        revision={revision}
        onClick={handleClick}
        onHover={handleHover}
        onUnhover={handleUnhover}
      />
      {hoverInfo && (
        <div className="p-4 bg-gray-800 text-white">
          {hoverInfo}
        </div>
      )}
    </div>
  );
}
