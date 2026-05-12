import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMessages } from '../hooks/useMessages';
import MessageFeed from '../components/messages/MessageFeed';
import { Filter } from 'lucide-react';

const MessagesPage = () => {
  const [filter, setFilter] = useState('All');
  const { data: messages, isLoading, isError } = useMessages();

  const filters = ['All Messages', 'Auto-sent', 'Needs Review', 'Escalated', 'Complaints'];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-6 py-2 rounded-lg text-sm font-semibold transition-all border
                ${filter === f 
                  ? 'bg-gold text-navy border-gold shadow-lg shadow-gold/20' 
                  : 'bg-navy-surface/30 text-warm/60 border-warm/10 hover:border-warm/30 hover:text-warm'}
              `}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-navy-surface/50 border border-warm/10 rounded-lg text-warm/60 hover:text-warm transition-colors">
          <Filter size={18} />
          <span className="text-sm font-medium">Advanced Filters</span>
        </button>
      </div>

      <MessageFeed 
        messages={messages} 
        isLoading={isLoading} 
        isError={isError} 
      />
    </motion.div>
  );
};

export default MessagesPage;
