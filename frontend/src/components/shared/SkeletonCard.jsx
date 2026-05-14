import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-navy-surface border border-warm/10 rounded-xl p-4 overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-32 shimmer rounded" />
            <div className="h-3 w-48 shimmer rounded" />
          </div>
        </div>
        <div className="h-3 w-12 shimmer rounded" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full shimmer rounded" />
        <div className="h-3 w-2/3 shimmer rounded" />
      </div>
      <div className="flex justify-between items-end">
        <div className="flex gap-2">
          <div className="h-5 w-20 shimmer rounded-full" />
          <div className="h-2 w-16 shimmer rounded self-center" />
        </div>
        <div className="h-6 w-24 shimmer rounded" />
      </div>
    </div>
  );
};

export default SkeletonCard;
