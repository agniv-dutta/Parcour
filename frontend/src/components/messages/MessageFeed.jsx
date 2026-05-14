import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import MessageCard from './MessageCard';
import SkeletonCard from '../shared/SkeletonCard';

const FILTERS = [
  { id: 'all', label: 'All Messages' },
  { id: 'auto_sent', label: 'Auto-sent' },
  { id: 'needs_review', label: 'Needs Review' },
  { id: 'escalated', label: 'Escalated' },
  { id: 'complaints', label: 'Complaints' },
];

const MessageFeed = ({ messages, loading, activeId, onSelect, activeFilter, onFilterChange }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Filter Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border
                ${activeFilter === filter.id 
                  ? "bg-gold/10 border-gold text-gold shadow-lg shadow-gold/5" 
                  : "bg-navy-surface border-warm/10 text-warm-muted hover:text-warm hover:border-warm/30"}
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-warm-muted hover:text-gold transition-colors pl-4">
          <Filter size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Advanced</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-2 pb-8">
        <div className="space-y-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : messages.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-warm-muted italic border border-dashed border-warm/10 rounded-xl">
              No items found
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MessageCard 
                    message={msg} 
                    active={activeId === msg.id}
                    onClick={onSelect}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageFeed;
