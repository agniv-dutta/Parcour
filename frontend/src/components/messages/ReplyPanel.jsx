import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Edit3, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const ReplyPanel = ({ draft, processingTime, onSend, onEscalate }) => {
  const [text, setText] = useState(draft || '');

  useEffect(() => {
    setText(draft);
  }, [draft]);

  return (
    <div className="flex flex-col h-full bg-navy/30 rounded-xl border border-warm/10 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#9B7FD4] animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#9B7FD4] flex items-center gap-1.5">
            <Sparkles size={12} /> AI Draft
          </h4>
        </div>
        <span className="text-[10px] text-warm-muted font-bold uppercase tracking-widest">
          Generated in {processingTime}ms
        </span>
      </div>

      <div className="flex-1 relative mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full bg-navy/50 border border-warm/10 rounded-lg p-4 text-sm text-warm/90 leading-relaxed focus:outline-none focus:border-gold/30 resize-none"
          placeholder="Drafting response..."
        />
        <div className="absolute bottom-3 right-4 text-[10px] text-warm-muted font-bold uppercase tracking-widest">
          {text.length} chars
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => onSend(text)}
          className="w-full bg-gold text-navy font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-light transition-all shadow-lg shadow-gold/10"
        >
          <Send size={16} />
          <span className="uppercase tracking-widest text-xs">Send Now</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button 
            className="border border-gold text-gold font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gold/10 transition-all text-[10px] uppercase tracking-widest"
          >
            <Edit3 size={14} /> Edit & Send
          </button>
          <button 
            onClick={onEscalate}
            className="border border-danger text-danger font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-danger/10 transition-all text-[10px] uppercase tracking-widest"
          >
            <ShieldAlert size={14} /> Escalate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyPanel;
