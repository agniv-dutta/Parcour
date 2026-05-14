import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ActionBadge = ({ action, className = "" }) => {
  const getActionConfig = (action) => {
    switch (action) {
      case 'auto_send':
        return { label: 'AUTO-SENT', color: '#4CAF82', pulse: true };
      case 'agent_review':
        return { label: 'NEEDS REVIEW', color: '#E8A838', pulse: true };
      case 'escalate':
        return { label: 'ESCALATED', color: '#E05555', pulse: true };
      default:
        return { label: action.replace('_', ' ').toUpperCase(), color: '#8B96A5', pulse: false };
    }
  };

  const config = getActionConfig(action);

  return (
    <div 
      className={twMerge(
        "inline-flex items-center gap-2 px-2 py-1 rounded-md text-[9px] font-bold tracking-widest border",
        className
      )}
      style={{ 
        color: config.color, 
        borderColor: `${config.color}33`,
        backgroundColor: `${config.color}11`
      }}
    >
      {config.pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span 
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: config.color }}
          ></span>
          <span 
            className="relative inline-flex rounded-full h-1.5 w-1.5"
            style={{ backgroundColor: config.color }}
          ></span>
        </span>
      )}
      {config.label}
    </div>
  );
};

export default ActionBadge;
