import React from 'react';
import { motion } from 'framer-motion';

const ActionBadge = ({ action }) => {
  const actions = {
    'AUTO-SENT': { color: 'text-success bg-success/10 border-success/20', dot: 'bg-success' },
    'REVIEW': { color: 'text-warning bg-warning/10 border-warning/20', dot: 'bg-warning' },
    'ESCALATED': { color: 'text-danger bg-danger/10 border-danger/20', dot: 'bg-danger' },
  };

  const config = actions[action] || actions.REVIEW;

  return (
    <div className={`flex items-center gap-2 px-2.5 py-0.5 rounded-sm border text-[10px] font-bold tracking-widest ${config.color}`}>
      <motion.div 
        className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {action}
    </div>
  );
};

export default ActionBadge;
