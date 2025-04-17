// MainChart.jsx
import React from "react";
import Plot from "react-plotly.js";

const MainChart = ({ dataSet, xKey, mode, onTraceClick }) => {
  const xValues = dataSet[xKey]; // e.g. aggregated x-axis values: years or hours
  const categories = ["ASSAULT", "MINOR", "NON STREET CRIME", "SEX OFFENSE", "THEFT"];
  const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"];

  // Build one trace per category
  const traces = categories.map((cat, idx) => ({
    x: xValues,
    y: dataSet[cat],
    name: cat,
    type: "scatter",
    mode: "lines",
    hoveron: "fills",
    fill: "tonexty",
    stackgroup: "one",
    line: { color: colors[idx] },
    hovertemplate: `%{x}<br>${cat}: %{y}<extra></extra>`,
  }));

  // When a trace is clicked, determine the clicked category and call the callback
  const handleClick = (event) => {
    if (event.points && event.points.length > 0) {
      const traceIndex = event.points[0].curveNumber;
      const clickedCategory = categories[traceIndex];
      onTraceClick(clickedCategory);
    }
  };

  return (
    <Plot
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
        hovermode: "closest",
        showlegend: true,
        legend: {
          orientation: "h",           // horizontal orientation for multiple rows
          y: 1,                     // position above the plot (you may adjust this value)
          x: 0.5,                     // center it horizontally
          xanchor: "center",          // anchor at the horizontal center
          yanchor: "bottom",          // align the bottom of the legend to the y coordinate
          bgcolor: "rgba(0, 0, 0, 0.5)",
          font: { color: "#000" },
        }
      }}
      config={{
        displayModeBar: false,
        scrollZoom: false,
        doubleClick: false,
        clickmode: "event+select",
      }}
      style={{ width: "100%", height: "100%" }}
      onClick={handleClick}
    />
  );
};

export default MainChart;
