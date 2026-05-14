import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Edit3, ShieldAlert, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../hooks/useToast';

const ReplyPanel = ({ draft, processingTime, onSend, onEscalate }) => {
  const [text, setText] = useState(draft || '');
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    setText(draft);
  }, [draft]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [text]);

  // Unsaved changes warning
  const isDirty = text !== draft;
  useEffect(() => {
    return () => {
      if (isDirty) {
        showToast({ message: "Changes discarded", type: "warning" });
      }
    };
  }, [isDirty, showToast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast({ message: "Draft copied to clipboard", type: "success" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  const handleSend = () => {
    onSend(text);
    showToast({ message: "Reply sent successfully", type: "success" });
  };

  const handleEscalate = () => {
    onEscalate();
    showToast({ message: "Escalated to manager", type: "warning" });
  };

  return (
    <div className="flex flex-col h-full bg-navy/30 rounded-xl border border-warm/10 p-6 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#9B7FD4] animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#9B7FD4] flex items-center gap-1.5">
            <Sparkles size={12} /> AI Draft
          </h4>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[9px] font-bold text-gold uppercase tracking-widest hover:text-gold-light transition-colors"
          >
            {isCopied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
          </button>
          <span className="text-[9px] text-warm-muted font-bold uppercase tracking-widest border-l border-warm/10 pl-4">
            Generated in {processingTime}ms
          </span>
        </div>
      </div>

      <div className="flex-1 relative mb-6">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-navy/50 border border-warm/10 rounded-lg p-4 text-sm text-warm/90 leading-relaxed focus:outline-none focus:border-gold/30 resize-none min-h-[120px] transition-all"
          placeholder="Drafting response..."
        />
        <div className="flex justify-end gap-3 mt-2">
          <span className="text-[9px] text-warm-muted font-bold uppercase tracking-widest">
            {charCount} chars · {wordCount} words
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={handleSend}
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
            onClick={handleEscalate}
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
