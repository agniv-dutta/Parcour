import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, Command } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const [showKHint, setShowKHint] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 3000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowKHint(false);
      }
      if (e.key === 'k' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowKHint(false);
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
      if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => Math.min(prev + 1, filteredMessages.length - 1));
      }
      if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && selectedIndex >= 0) {
        onSelect(filteredMessages[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  // Hide K hint after some time
  useEffect(() => {
    const timer = setTimeout(() => setShowKHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchesFilter = 
        activeFilter === 'all' || 
        (activeFilter === 'auto_sent' && msg.action === 'auto_send') ||
        (activeFilter === 'needs_review' && msg.action === 'agent_review') ||
        (activeFilter === 'escalated' && msg.action === 'escalate') ||
        (activeFilter === 'complaints' && msg.query_type === 'complaint');

      const matchesSearch = 
        !debouncedQuery || 
        msg.guest_name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        msg.message_text.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        msg.booking_ref.toLowerCase().includes(debouncedQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [messages, activeFilter, debouncedQuery]);

  // Sync selected index with activeId
  useEffect(() => {
    if (activeId) {
      const idx = filteredMessages.findIndex(m => m.id === activeId);
      setSelectedIndex(idx);
    }
  }, [activeId, filteredMessages]);

  const getFilterCount = (filterId) => {
    return messages.filter(msg => {
      if (filterId === 'all') return true;
      if (filterId === 'auto_sent') return msg.action === 'auto_send';
      if (filterId === 'needs_review') return msg.action === 'agent_review';
      if (filterId === 'escalated') return msg.action === 'escalate';
      if (filterId === 'complaints') return msg.query_type === 'complaint';
      return false;
    }).length;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted group-focus-within:text-gold transition-colors" size={16} />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search messages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy/50 border border-warm/10 rounded-xl py-3 pl-10 pr-12 text-xs focus:outline-none focus:border-gold/50 transition-all placeholder:text-warm-muted/50"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="text-warm-muted hover:text-warm">
                <X size={14} />
              </button>
            ) : (
              <AnimatePresence>
                {showKHint && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 px-1.5 py-0.5 border border-warm/10 rounded bg-navy text-[8px] font-bold text-warm-muted"
                  >
                    <Command size={8} /> K
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between mb-6 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border
                ${activeFilter === filter.id 
                  ? "bg-gold/10 border-gold text-gold shadow-lg shadow-gold/5" 
                  : "bg-navy-surface border-warm/10 text-warm-muted hover:text-warm hover:border-warm/30"}
              `}
            >
              {filter.label} ({getFilterCount(filter.id)})
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto app-scrollbar pr-2 pb-8">
        <div className="space-y-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredMessages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-40 flex flex-col items-center justify-center text-center p-8 border border-dashed border-warm/10 rounded-xl"
            >
              <Search className="text-warm-muted mb-3 opacity-20" size={32} />
              <p className="text-xs font-playfair italic text-warm-muted mb-1">
                {activeFilter === 'complaints' 
                  ? "No complaints — your guests are happy! 🎉" 
                  : `No ${activeFilter.replace('_', ' ')} messages found`}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-gold text-[9px] font-bold uppercase tracking-widest mt-2 hover:underline"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06 } }
              }}
            >
              {filteredMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <MessageCard 
                    message={msg} 
                    active={activeId === msg.id}
                    onClick={onSelect}
                    highlightQuery={debouncedQuery}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageFeed;
