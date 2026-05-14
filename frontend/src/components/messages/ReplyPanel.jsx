import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Edit3, ShieldAlert, Copy, Check, PencilLine, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const ReplyPanel = ({ draft, processingTime, onSend = () => {}, onEscalate = () => {} }) => {
  const [text, setText] = useState(draft || '');
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    setText(draft || '');
    setIsEditing(false);
  }, [draft]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [text, isEditing]);

  const isDirty = text !== draft;
  useEffect(() => {
    return () => {
      if (isDirty) {
        showToast({ message: 'Changes discarded', type: 'warning' });
      }
    };
  }, [isDirty, showToast]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const valueLength = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(valueLength, valueLength);
    }
  }, [isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast({ message: 'Draft copied to clipboard', type: 'success' });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  const handleSend = () => {
    onSend(text);
    setIsEditing(false);
    showToast({ message: 'Reply sent successfully', type: 'success' });
  };

  const handleEditAndSend = () => {
    if (!isEditing) {
      setIsEditing(true);
      showToast({ message: 'Editing enabled. Update the draft, then save and send.', type: 'info' });
      return;
    }

    handleSend();
  };

  const handleEscalate = () => {
    onEscalate();
    showToast({ message: 'Escalated to manager', type: 'warning' });
  };

  return (
    <div className="flex flex-col h-full bg-navy/30 rounded-xl border border-warm/10 p-6 overflow-y-auto app-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#9B7FD4] animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#9B7FD4] flex items-center gap-1.5">
            <Sparkles size={12} /> AI Draft
          </h4>
          {isEditing && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold">
              <PencilLine size={10} /> Editing
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            type="button"
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
          readOnly={!isEditing}
          className={`w-full rounded-lg p-4 text-sm leading-relaxed resize-none min-h-[120px] transition-all outline-none ${
            isEditing
              ? 'bg-navy/50 border border-gold/40 text-warm'
              : 'bg-navy/40 border border-warm/10 text-warm/80 cursor-not-allowed'
          }`}
          placeholder="Drafting response..."
        />
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={() => setIsEditing((current) => !current)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-gold transition-colors hover:bg-gold/15"
          >
            {isEditing ? <><X size={12} /> Lock Draft</> : <><Edit3 size={12} /> Edit Draft</>}
          </button>
          <span className="text-[9px] text-warm-muted font-bold uppercase tracking-widest">
            {charCount} chars · {wordCount} words
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          type="button"
          onClick={handleSend}
          className="w-full bg-gold text-navy font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-light transition-all shadow-lg shadow-gold/10"
        >
          <Send size={16} />
          <span className="uppercase tracking-widest text-xs">Send Now</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={handleEditAndSend}
            className="border border-gold text-gold font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gold/10 transition-all text-[10px] uppercase tracking-widest"
          >
            <Edit3 size={14} /> {isEditing ? 'Save & Send' : 'Edit & Send'}
          </button>
          <button 
            type="button"
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
