import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, User, Clock, MapPin, Hash, CheckCircle2, AlertCircle } from 'lucide-react';
import ConfidenceMeter from '../shared/ConfidenceMeter';
import ChannelIcon from '../shared/ChannelIcon';
import ReplyPanel from './ReplyPanel';

const MessageDetail = ({ message, onSend, onEscalate }) => {
  if (!message) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-warm-muted animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-navy-surface flex items-center justify-center mb-4 border border-warm/5">
          <Clock size={32} className="opacity-20" />
        </div>
        <p className="font-playfair text-xl italic opacity-50">Select a message to view details</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {/* Left: Original Message */}
      <div className="flex flex-col gap-6 overflow-y-auto app-scrollbar pr-2">
        <div>
          <h2 className="text-gold font-playfair text-2xl mb-6">Original Message</h2>
          
          {/* Guest Context Card */}
          <div className="bg-navy-surface border border-warm/10 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-warm font-playfair text-xl leading-none mb-1">{message.guest_name}</h3>
                <ChannelIcon source={message.source} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-warm/5 pt-4">
              <div className="flex items-center gap-2 text-[10px] text-warm-muted uppercase tracking-widest font-bold">
                <MapPin size={12} className="text-gold/50" />
                <span className="truncate">{message.property_id}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-warm-muted uppercase tracking-widest font-bold">
                <Hash size={12} className="text-gold/50" />
                <span>{message.booking_ref}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-warm-muted uppercase tracking-widest font-bold">
                <Clock size={12} className="text-gold/50" />
                <span>{new Date(message.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="relative pl-6 py-2 border-l-2 border-gold/30 bg-gold/5 rounded-r-xl">
            <Quote className="absolute -left-3 -top-3 text-gold/20" size={32} />
            <p className="text-warm/90 leading-relaxed italic text-lg font-playfair">
              {message.message_text}
            </p>
          </div>
        </div>

        {/* AI Confidence Analysis */}
        <div className="mt-auto pt-6 border-t border-warm/5 flex items-center gap-6">
          <ConfidenceMeter score={message.confidence_score} size={80} strokeWidth={6} />
          <div>
            <h4 className="text-[10px] font-bold text-warm-muted uppercase tracking-widest mb-1">AI Classification</h4>
            <p className="text-warm font-playfair text-lg">
              {message.query_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {message.confidence_score > 0.8 ? (
                <div className="flex items-center gap-1 text-[9px] text-success font-bold uppercase tracking-widest">
                  <CheckCircle2 size={10} /> High Confidence
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[9px] text-warning font-bold uppercase tracking-widest">
                  <AlertCircle size={10} /> Needs Review
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: AI Draft */}
      <div className="h-full pb-4">
        <ReplyPanel 
          draft={message.drafted_reply} 
          processingTime={message.processing_time_ms} 
          onSend={onSend}
          onEscalate={onEscalate}
        />
      </div>
    </motion.div>
  );
};

export default MessageDetail;
