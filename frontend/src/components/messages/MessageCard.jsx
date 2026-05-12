import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ChannelIcon from '../shared/ChannelIcon';
import QueryTypeBadge from '../shared/QueryTypeBadge';
import ActionBadge from '../shared/ActionBadge';
import { formatRelativeTime, truncateText } from '../../utils/formatters';

const MessageCard = ({ message }) => {
  const navigate = useNavigate();
  
  const getConfidenceColor = (score) => {
    if (score >= 0.85) return 'bg-success';
    if (score >= 0.6) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/messages/${message.id}`)}
      className="group relative p-6 bg-navy-surface/30 border border-warm/5 rounded-lg hover:border-gold/30 hover:bg-navy-surface/50 transition-all cursor-pointer overflow-hidden"
    >
      {/* Active Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 bg-gold transition-all duration-300" />

      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-warm/10">
              <img 
                src={message.guest_avatar || `https://ui-avatars.com/api/?name=${message.guest_name}&background=C9A96E&color=0D1B2A`} 
                alt={message.guest_name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-navy-surface p-1 rounded-full border border-warm/5">
              <ChannelIcon channel={message.channel} size={12} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-playfair font-semibold text-warm leading-tight">
                {message.guest_name}
              </h3>
              <span className="px-2 py-0.5 rounded bg-gold/10 border border-gold/20 text-[10px] text-gold uppercase tracking-widest font-bold">
                {message.property_id}
              </span>
            </div>
            <QueryTypeBadge type={message.query_type} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-warm/40 font-medium mb-2">
            {formatRelativeTime(message.timestamp)}
          </p>
          <ActionBadge action={message.status} />
        </div>
      </div>

      <p className="text-sm text-warm/70 leading-relaxed italic mb-4">
        "{truncateText(message.content, 120)}"
      </p>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-warm/40 uppercase tracking-widest font-bold">Confidence Score</span>
            <span className="text-[10px] text-warm/60 font-bold">{Math.round(message.confidence_score * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-warm/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${message.confidence_score * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${getConfidenceColor(message.confidence_score)}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageCard;
