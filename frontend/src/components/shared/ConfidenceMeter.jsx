import React from 'react';
import { motion } from 'framer-motion';
import { getScoreColor } from '../../utils/formatters';

const ConfidenceMeter = ({ score, size = 48, strokeWidth = 4, showLabel = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score * circumference);
  const color = getScoreColor(score);
  const isCritical = score < 0.60;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer Pulse Ring for critical scores */}
      {isCritical && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-danger/30"
        />
      )}

      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-navy-surface"
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
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="text-[10px] font-bold" style={{ color }}>{Math.round(score * 100)}%</span>
        </div>
      )}
    </div>
  );
};

export default ConfidenceMeter;
