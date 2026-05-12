import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMessageDetail } from '../hooks/useMessages';
import MessageDetail from '../components/messages/MessageDetail';
import ReplyPanel from '../components/messages/ReplyPanel';
import { ChevronLeft, Share2, MoreVertical, RefreshCcw } from 'lucide-react';

const MessageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: message, isLoading, isError, refetch } = useMessageDetail(id);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <RefreshCcw className="text-gold animate-spin" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <p className="text-danger mb-4 text-lg">Failed to load message details.</p>
        <button className="btn-gold" onClick={() => navigate('/messages')}>
          Back to Inbox
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-[calc(100vh-80px)] flex flex-col"
    >
      {/* Header */}
      <div className="px-8 py-4 border-b border-warm/5 bg-navy/30 backdrop-blur-sm flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/messages')}
            className="w-10 h-10 rounded-full border border-warm/10 flex items-center justify-center text-warm/60 hover:text-gold hover:border-gold/50 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-4 text-sm font-medium">
             <button className="text-gold border-b-2 border-gold pb-1">Dashboard</button>
             <button className="text-warm/40 hover:text-warm transition-colors">Arrivals</button>
             <button className="text-warm/40 hover:text-warm transition-colors">Housekeeping</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => refetch()} className="text-warm/40 hover:text-warm transition-colors">
             <RefreshCcw size={18} />
           </button>
           <button className="text-warm/40 hover:text-warm transition-colors">
             <Share2 size={18} />
           </button>
           <button className="text-warm/40 hover:text-warm transition-colors">
             <MoreVertical size={18} />
           </button>
        </div>
      </div>

      {/* Content Split */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Column: Detail */}
        <div className="w-[45%] p-8 overflow-y-auto custom-scrollbar border-r border-warm/5">
          <MessageDetail message={message} />
        </div>

        {/* Right Column: AI Panel */}
        <div className="flex-1 p-8 bg-navy-surface/10 overflow-y-auto custom-scrollbar">
          <ReplyPanel 
            draft={message.drafted_reply} 
            processingTime={message.processing_time_ms} 
            confidenceScore={message.confidence_score}
            errorContext={message.error_context}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MessageDetailPage;
