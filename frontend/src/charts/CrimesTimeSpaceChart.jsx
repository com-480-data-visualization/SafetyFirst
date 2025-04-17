import React, { useEffect, useState } from "react";
import HeatmapMap from "./HeatmapMap";
import CrimeStatsPanel from "./CrimeStatsPanel";
import YearTimeControls from "./YearTimeControls";

const CrimesTimeSpaceChart = () => {
  const [year, setYear] = useState(2023);
  const [timeRange, setTimeRange] = useState([0, 23]); // hour range
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch data for the selected year
  useEffect(() => {
    fetch(`/SafetyFirst/heatmap_data_full/heatmap_full_${year}.json`)
      .then((res) => res.json())
      .then((data) => setRawData(data))
      .catch((err) => {
        console.error("❌ Failed to load JSON:", err);
        setRawData([]);
      });
  }, [year]);

  // Filter data based on time range
  useEffect(() => {
    const filtered = rawData.filter((d) => {
      const hour = new Date(d.datetime).getHours();
      return hour >= timeRange[0] && hour <= timeRange[1];
    });
    setFilteredData(filtered);
  }, [rawData, timeRange]);

  return (
    <section className="w-full px-4 sm:px-8 md:px-16 lg:px-32 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-red-500 text-glow">
      Explore the Crime Landscape, Block by Block
      </h2>
      <p class="text-lg text-gray-700">
        Where is crime concentrated? Which neighborhoods are getting safer — or more dangerous? This interactive heatmap lets you zoom into any part of Chicago to see the density of reported crimes from 2001 to 2025.
      </p>
      <p class="mt-4 text-lg text-gray-700">
        Use the filters to focus on a specific <strong>area, year, or time range</strong>. The dynamic bar chart updates in real time to show which crimes were most common, and how frequently they occurred.
      </p>
      <p class="mt-4 text-lg text-gray-700">
        Whether you're a visitor planning a stay or a local staying informed, this tool helps you visualize trends and hotspots — with data that puts headlines into context.
      </p>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Heatmap */}
        <div className="w-full lg:w-3/5 h-[600px] border-4 border-red-500 rounded-xl overflow-hidden">
          <HeatmapMap points={filteredData} />
        </div>

        {/* Statistics */}
        <div className="w-full lg:w-2/5">
          <CrimeStatsPanel data={filteredData} />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8">
        <YearTimeControls
          year={year}
          setYear={setYear}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </div>
    </section>
  );
};

export default CrimesTimeSpaceChart;
