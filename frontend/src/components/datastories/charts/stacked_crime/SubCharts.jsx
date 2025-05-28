// SubChart.jsx
import React from "react";
import Plot from "react-plotly.js";

const SubChart = ({ activeCategory, mainData, subData, xKey, mode, onTraceClick }) => {
  const xValues = mainData[xKey]; // Use the same x-axis values as the aggregated data
  const subcategories = Object.keys(subData);
  const defaultColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2"];

  // Build one trace per subcategory
  const traces = subcategories.map((subcat, idx) => ({
    x: xValues,
    y: subData[subcat],
    name: subcat,
    type: "scatter",
    mode: "lines",
    hoveron: "fills",
    fill: "tonexty",
    stackgroup: "one",
    line: { color: defaultColors[idx % defaultColors.length] },
    hovertemplate: `%{x}<br>${subcat}: %{y}<extra></extra>`,
  }));

  const handleClick = (event) => {
    if (event.points && event.points.length > 0) {
      const traceIndex = event.points[0].curveNumber;
      const clickedSubcategory = subcategories[traceIndex];
      onTraceClick(clickedSubcategory);
    }
  };

  return (
    <Plot
      data={traces}
      layout={{
        title: `Subcategory Breakdown for ${activeCategory} (${mode === "year" ? "Years" : "Hours"})`,
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
        margin: {
          l: 50,  // left
          r: 0,  // right
          t: 0,  // top (title)
          b: 30   // bottom
        },
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
      onClick={handleClick}
    />
  );
};

export default SubChart;
