import React from 'react';
import ConfidenceMeter from '../shared/ConfidenceMeter';
import ActionBadge from '../shared/ActionBadge';
import ChannelIcon from '../shared/ChannelIcon';
import { Quote, MapPin } from 'lucide-react';

const MessageDetail = ({ message }) => {
  if (!message) return null;

  return (
    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
      {/* Guest Card */}
      <div className="glass-panel p-6 rounded-xl border-warm/5">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-warm/10">
               <img 
                src={message.guest_avatar || `https://ui-avatars.com/api/?name=${message.guest_name}&background=C9A96E&color=0D1B2A`} 
                alt={message.guest_name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-playfair font-bold text-warm mb-1">{message.guest_name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-warm/40 font-medium">Booking {message.booking_ref || 'NIS-2024-0904'}</span>
                <span className="w-1 h-1 rounded-full bg-warm/20" />
                <span className="text-xs text-warm/40 font-medium">4m ago</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-warm/5 border border-warm/10 rounded-lg">
              <ChannelIcon channel={message.channel} size={14} />
              <span className="text-[10px] font-bold text-warm/60 uppercase tracking-widest">{message.channel}</span>
            </div>
          </div>
        </div>

        <div className="relative p-6 bg-navy-surface/50 rounded-lg border-l-2 border-gold mb-6">
          <Quote className="absolute top-4 left-4 text-gold/10 w-8 h-8" />
          <p className="text-lg text-warm font-medium italic relative z-10">
            "{message.content}"
          </p>
        </div>

        <div className="flex items-center gap-4 p-4 bg-warm/5 rounded-lg border border-warm/10">
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[10px] text-warm/40 font-bold uppercase tracking-widest">Property</p>
            <p className="text-sm font-semibold text-warm">{message.property_id || 'Villa C2 (Anjuna)'}</p>
          </div>
        </div>
      </div>

      {/* AI Classification Card */}
      <div className="glass-panel p-6 rounded-xl border-warm/5">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-warm/40">AI Classification</h4>
          <ActionBadge action={message.status} />
        </div>

        <div className="flex gap-8 items-center">
          <ConfidenceMeter score={message.confidence_score} size={100} strokeWidth={8} />
          <div className="space-y-2">
            <p className="text-lg font-playfair font-bold text-warm">{message.query_type} / Inquiry</p>
            <p className="text-sm text-warm/60 leading-relaxed">
              Confidence: {message.confidence_score > 0.8 ? 'High' : 'Moderate'}. 
              Triggered by keyword analysis and sentiment mapping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
