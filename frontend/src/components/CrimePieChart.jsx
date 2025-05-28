// src/components/CrimePieChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#f9c74f", "#f9844a", "#43aa8b", "#577590", "#f94144",
  "#90be6d", "#4d908e", "#f3722c", "#277da1", "#ff595e"
];

const RADIAN = Math.PI / 180;

// Clean hover tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white border px-3 py-2 rounded shadow text-sm text-slate-800">
        <strong>{name}</strong>: {value} incidents
      </div>
    );
  }
  return null;
};

const CrimePieChart = ({ data }) => {
  const pieData = Object.entries(data || {}).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  if (pieData.length === 0) return null;

  return (
    <div className="mt-10 max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-center text-slate-800 mb-4">
        🧠 Crime Type Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={180}
            fill="#8884d8"
            isAnimationActive={true}
            label={false}
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrimePieChart;
