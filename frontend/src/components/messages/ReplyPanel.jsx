import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Edit3, AlertTriangle, Clock, Terminal } from 'lucide-react';

const ReplyPanel = ({ draft, processingTime, confidenceScore, errorContext }) => {
  const [text, setText] = useState(draft || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSend = () => {
    console.log('Sending message:', text);
    alert('Message Sent Successfully!');
  };

  const handleEscalate = () => {
    if (confirm('Are you sure you want to escalate this to human support?')) {
      console.log('Escalating...');
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-full border-gold/10">
      <div className="p-6 border-b border-warm/5 flex justify-between items-center bg-navy-surface/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
            <Terminal size={18} />
          </div>
          <h3 className="font-playfair font-bold text-warm">AI Drafted Reply</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-warm/40 font-bold uppercase tracking-widest">
            <Clock size={12} />
            {processingTime ? `Generated in ${processingTime}ms` : 'Generated in 850ms'}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 relative">
        <div className="absolute top-4 left-6 text-[10px] text-gold/40 font-bold uppercase tracking-widest mb-2">
          Proposed Response
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!isEditing}
          className={`
            w-full h-full mt-6 bg-navy-surface/30 border rounded-lg p-6 text-sm text-warm/90 leading-relaxed resize-none focus:outline-none transition-all
            ${isEditing ? 'border-gold/50 shadow-[0_0_20px_rgba(201,169,110,0.1)]' : 'border-warm/5'}
          `}
          placeholder="Type your reply here..."
        />
        <div className="absolute bottom-10 right-10 text-[10px] text-warm/30 font-bold">
          Tokens: {text.split(/\s+/).length}
        </div>
      </div>

      <div className="p-6 bg-navy-surface/30 border-t border-warm/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-warm/40 uppercase tracking-widest font-bold">Confidence Score</span>
              <span className="text-sm font-bold text-success">{Math.round(confidenceScore * 100)}%</span>
            </div>
            {errorContext && (
              <div className="flex flex-col gap-1 border-l border-warm/10 pl-6">
                <span className="text-[10px] text-danger/60 uppercase tracking-widest font-bold flex items-center gap-1">
                  <AlertTriangle size={10} /> Context Warning
                </span>
                <span className="text-sm font-medium text-danger/80">{errorContext}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={handleSend}
            className="flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3 rounded-md hover:bg-gold-light transition-all shadow-lg shadow-gold/10"
          >
            <Send size={18} />
            Send Now
          </button>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`
              flex items-center justify-center gap-2 border font-bold py-3 rounded-md transition-all
              ${isEditing ? 'bg-gold/10 border-gold text-gold' : 'border-warm/10 text-warm/60 hover:text-warm hover:border-warm/30'}
            `}
          >
            <Edit3 size={18} />
            {isEditing ? 'Save Changes' : 'Edit & Send'}
          </button>

          <button 
            onClick={handleEscalate}
            className="flex items-center justify-center gap-2 border border-danger/30 text-danger/60 font-bold py-3 rounded-md hover:bg-danger/10 hover:text-danger transition-all"
          >
            <AlertTriangle size={18} />
            Escalate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyPanel;
