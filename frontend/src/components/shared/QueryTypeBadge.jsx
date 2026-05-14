import React from 'react';
import { QUERY_COLORS } from '../../data/mockData';

const QueryTypeBadge = ({ type, className = "" }) => {
  const style = QUERY_COLORS[type] || QUERY_COLORS.general_enquiry;

  return (
    <span 
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${className}`}
      style={{ 
        backgroundColor: style.bg, 
        color: style.text,
        border: `1px solid ${style.text}33`
      }}
    >
      {style.label}
    </span>
  );
};

export default QueryTypeBadge;
