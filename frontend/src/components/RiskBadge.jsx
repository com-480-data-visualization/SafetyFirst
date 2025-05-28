// src/components/RiskBadge.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const riskStyles = {
  safe: {
    label: "Safe",
    bg: "bg-green-100",
    border: "border-green-400",
    text: "text-green-800",
  },
  moderate: {
    label: "Moderate",
    bg: "bg-yellow-100",
    border: "border-yellow-400",
    text: "text-yellow-800",
  },
  risky: {
    label: "Risky",
    bg: "bg-red-100",
    border: "border-red-400",
    text: "text-red-800",
  },
  none: {
    label: "—",
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-600",
  },
};

const getRiskLevel = (risk) => {
  if (risk === null || risk === undefined) return riskStyles.none;
  if (risk < 10) return riskStyles.safe;
  if (risk < 30) return riskStyles.moderate;
  return riskStyles.risky;
};

const RiskBadge = ({ risk }) => {
  const { label, bg, border, text } = getRiskLevel(risk);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={risk}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className={`inline-block px-4 py-2 rounded-2xl text-sm font-semibold shadow-md ${bg} ${border} ${text} border`}
      >
        <span className="mr-2">🚨 Risk Score:</span>
        <span className="text-lg font-bold">{risk ?? "—"}</span>
        <span className="ml-3 italic">({label})</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default RiskBadge;
