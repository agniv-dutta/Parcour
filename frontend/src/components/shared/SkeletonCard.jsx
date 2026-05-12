import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="w-full p-6 bg-navy-surface/30 border border-warm/5 rounded-lg animate-pulse mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-warm/10 rounded-full" />
          <div>
            <div className="w-32 h-4 bg-warm/10 rounded mb-2" />
            <div className="w-20 h-3 bg-warm/10 rounded" />
          </div>
        </div>
        <div className="w-16 h-4 bg-warm/10 rounded" />
      </div>
      <div className="w-full h-4 bg-warm/10 rounded mb-2" />
      <div className="w-3/4 h-4 bg-warm/10 rounded mb-4" />
      <div className="flex justify-between items-center">
        <div className="w-24 h-6 bg-warm/10 rounded-full" />
        <div className="w-20 h-6 bg-warm/10 rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonCard;
