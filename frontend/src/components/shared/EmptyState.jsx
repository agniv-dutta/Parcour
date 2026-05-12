import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = "No items found", subtext = "Check back later for updates." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center opacity-50">
      <div className="w-16 h-16 bg-warm/10 rounded-full flex items-center justify-center mb-4">
        <Inbox size={32} className="text-gold" />
      </div>
      <h3 className="text-xl font-playfair text-warm mb-1">{message}</h3>
      <p className="text-sm text-warm/60">{subtext}</p>
    </div>
  );
};

export default EmptyState;
