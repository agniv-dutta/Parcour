import React from 'react';
import { motion } from 'framer-motion';

const ConfidenceMeter = ({ score = 0, size = 60, strokeWidth = 5 }) => {
  const percentage = Math.round(score * 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score * circumference);

  const getColor = (s) => {
    if (s >= 0.85) return '#4CAF82'; // success
    if (s >= 0.6) return '#E8A838'; // warning
    return '#E05555'; // danger
  };

  const color = getColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(240, 235, 227, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-warm">{percentage}%</span>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
