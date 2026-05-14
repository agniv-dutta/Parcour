import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getInitials, getAvatarColor, timeAgo, truncate, getScoreColor } from '../../utils/formatters';
import ChannelIcon from '../shared/ChannelIcon';
import QueryTypeBadge from '../shared/QueryTypeBadge';
import ActionBadge from '../shared/ActionBadge';

const MessageCard = ({ message, active, onClick, highlightQuery = "" }) => {
  const [isRead, setIsRead] = useState(false);
  const avatarColor = getAvatarColor(message.guest_name);
  const scoreColor = getScoreColor(message.confidence_score);

  // Track read state in localStorage
  useEffect(() => {
    const readIds = JSON.parse(localStorage.getItem('parcour_read_messages') || '[]');
    if (readIds.includes(message.id)) {
      setIsRead(true);
    }
  }, [message.id]);

  const handleCardClick = () => {
    const readIds = JSON.parse(localStorage.getItem('parcour_read_messages') || '[]');
    if (!readIds.includes(message.id)) {
      localStorage.setItem('parcour_read_messages', JSON.stringify([...readIds, message.id]));
      setIsRead(true);
    }
    onClick(message);
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i}>{part}</mark> 
        : part
    );
  };

  return (
    <motion.div
      layout
      onClick={handleCardClick}
      whileHover={{ y: -2 }}
      className={`
        relative cursor-pointer transition-all duration-300 p-4 rounded-xl border
        ${active 
          ? "bg-[#1A2A3A] border-gold shadow-lg shadow-gold/5" 
          : "bg-navy-surface border-warm/10 hover:border-warm/30 hover:bg-[#1C2C3C]"}
        ${!isRead && !active ? "border-l-[3px] border-l-gold" : ""}
      `}
    >
      {/* Active Indicator */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-gold rounded-r-full" />
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner"
            style={{ backgroundColor: avatarColor }}
          >
            {getInitials(message.guest_name)}
          </div>
          <div>
            <h3 className={`font-playfair text-lg leading-none mb-1 transition-colors ${active ? 'text-gold' : isRead ? 'text-warm/80' : 'text-warm'}`}>
              {highlightText(message.guest_name, highlightQuery)}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-warm-muted uppercase tracking-wider font-bold">
              <span>{highlightText(message.booking_ref, highlightQuery)}</span>
              <span>·</span>
              <span>{message.property_id}</span>
              <span>·</span>
              <ChannelIcon source={message.source} className="opacity-80" />
            </div>
          </div>
        </div>
        <span className="text-[10px] text-warm-muted font-bold uppercase tracking-widest">
          {timeAgo(message.timestamp)}
        </span>
      </div>

      {/* Preview */}
      <p className={`text-sm mb-4 line-clamp-2 italic leading-relaxed transition-colors ${active ? 'text-warm' : 'text-warm/60'}`}>
        "{highlightText(truncate(message.message_text, 120), highlightQuery)}"
      </p>

      {/* Footer */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <QueryTypeBadge type={message.query_type} />
          
          {/* Confidence Bar */}
          <div className="flex items-center gap-2">
            <div className="w-20 h-1 bg-navy rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${message.confidence_score * 100}%` }}
                className="h-full"
                style={{ backgroundColor: scoreColor }}
              />
            </div>
            <span className="text-[9px] font-bold" style={{ color: scoreColor }}>
              {(message.confidence_score).toFixed(2)}
            </span>
          </div>
        </div>

        <ActionBadge action={message.action} />
      </div>
    </motion.div>
  );
};

export default MessageCard;
