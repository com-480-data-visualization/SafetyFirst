import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CrimeStatsPanel = ({ data }) => {
  // Group and count by primary_type
  const statsMap = {};

  data.forEach((d) => {
    if (!d.primary_type) return;
    statsMap[d.primary_type] = (statsMap[d.primary_type] || 0) + 1;
  });

  const chartData = Object.entries(statsMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // top 10

  const colors = [
    "#ef4444", // red
    "#f97316",
    "#facc15",
    "#4ade80",
    "#22d3ee",
    "#3b82f6",
    "#a78bfa",
    "#f472b6",
    "#fb923c",
    "#84cc16",
  ];

  return (
    <div className="bg-gray-900 border border-red-500 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-red-400 mb-4 text-center">Top Crime Types</h3>
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-center">No data for current filters</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <XAxis type="number" stroke="#ccc" />
            <YAxis
              dataKey="type"
              type="category"
              stroke="#ccc"
              width={130}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{ background: "#111", border: "none" }}
              labelStyle={{ color: "#f43f5e" }}
            />
            <Bar dataKey="count" barSize={16}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CrimeStatsPanel;