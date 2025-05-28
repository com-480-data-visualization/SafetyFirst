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
  // 1) Define your lookup maps
  const labelMap = {
    BATTERY: "Battery",
    THEFT: "Theft",
    "CRIMINAL DAMAGE": "Criminal Damage",
    NARCOTICS: "Narcotics",
    "MOTOR VEHICLE THEFT": "Vehicle Theft",
    ASSAULT: "Assault",
    "OTHER OFFENSE": "Other Offense",
    BURGLARY: "Burglary",
    ROBBERY: "Robbery",
    "CRIMINAL TRESPASS": "Trespassing",
    "DECEPTIVE PRACTICE": "Deceptive Practice",
    "WEAPONS VIOLATION": "Weapons Violation",
  };

  const colorMap = {
    BATTERY: "#ef4444",
    THEFT: "#f97316",
    "CRIMINAL DAMAGE": "#facc15",
    NARCOTICS: "#4ade80",
    "MOTOR VEHICLE THEFT": "#22d3ee",
    ASSAULT: "#3b82f6",
    "OTHER OFFENSE": "#a78bfa",
    BURGLARY: "#f472b6",
    ROBBERY: "#fb923c",
    "CRIMINAL TRESPASS": "#84cc16",
    "DECEPTIVE PRACTICE":   "#6b7280",
    "WEAPONS VIOLATION":    "#4b5563",
    // fallback color if you miss something
    default: "#999999",
  };

  // 2) Group & count
  const statsMap = {};
  data.forEach((d) => {
    if (!d.primary_type) return;
    statsMap[d.primary_type] = (statsMap[d.primary_type] || 0) + 1;
  });

  // 3) Build chartData, injecting label & color
  const chartData = Object.entries(statsMap)
    .map(([type, count]) => ({
      type,
      count,
      label: labelMap[type] || type,                // human label
      fill: colorMap[type] || colorMap.default,      // fixed color
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="bg-white border shadow-lg rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-red-400 mb-4 text-center">
        Top Crime Types
      </h3>
      {chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-center">
            No data for current filters
          </p>
        </div>
      ) : (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              barCategoryGap="20%"
            >
              <XAxis
                type="number"
                stroke="#ccc"
                tick={{ fill: "#666", fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="label"                   // use your friendly label
                stroke="#ccc"
                tick={{ fill: "#666", fontSize: 12 }}
                width={120}
              />
              <Tooltip
                formatter={(value) => [value, "Cases"]}
                labelFormatter={(label) => `Crime: ${label}`}
                itemStyle={{ color: "#000" }}
                cursor={false}
              />
              <Bar dataKey="count" barSize={16}>
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CrimeStatsPanel;
