import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Database, Loader2, CheckCircle2 } from 'lucide-react';
import { sendToAI } from '../../api/client';

const TestWebhookPanel = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    source: 'whatsapp',
    guest_name: 'Test User',
    message_text: 'Hello, I would like to book a villa for 3 days.',
    booking_ref: 'TEST-2026-0001',
    property_id: 'Villa B1, Assagao'
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await sendToAI(formData);
      setResponse(res);
      // Optional: Refresh the main feed if needed
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0F1923] border-l border-warm/10 shadow-2xl z-50 p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Database className="text-gold" size={24} />
                <h2 className="text-warm font-playfair text-2xl">Test Webhook</h2>
              </div>
              <button onClick={onClose} className="text-warm-muted hover:text-warm transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto app-scrollbar pb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Source Channel</label>
                <select 
                  value={formData.source}
                  onChange={e => setFormData({...formData, source: e.target.value})}
                  className="w-full bg-navy/50 border border-warm/10 rounded-lg p-3 text-sm text-warm focus:outline-none focus:border-gold/50"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="airbnb">Airbnb</option>
                  <option value="booking_com">Booking.com</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Guest Name</label>
                <input 
                  type="text" 
                  value={formData.guest_name}
                  onChange={e => setFormData({...formData, guest_name: e.target.value})}
                  className="w-full bg-navy/50 border border-warm/10 rounded-lg p-3 text-sm text-warm focus:outline-none focus:border-gold/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Message Text</label>
                <textarea 
                  rows={4}
                  value={formData.message_text}
                  onChange={e => setFormData({...formData, message_text: e.target.value})}
                  className="w-full bg-navy/50 border border-warm/10 rounded-lg p-3 text-sm text-warm focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Booking Ref</label>
                  <input 
                    type="text" 
                    value={formData.booking_ref}
                    onChange={e => setFormData({...formData, booking_ref: e.target.value})}
                    className="w-full bg-navy/50 border border-warm/10 rounded-lg p-3 text-sm text-warm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Property</label>
                  <input 
                    type="text" 
                    value={formData.property_id}
                    onChange={e => setFormData({...formData, property_id: e.target.value})}
                    className="w-full bg-navy/50 border border-warm/10 rounded-lg p-3 text-sm text-warm focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gold text-navy font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-light transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                <span className="uppercase tracking-widest text-sm">Send to AI</span>
              </button>

              {response && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-success/10 border border-success/30 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-success font-bold text-[10px] uppercase tracking-widest">
                    <CheckCircle2 size={14} /> Response Received
                  </div>
                  <p className="text-xs text-warm/80 italic leading-relaxed">
                    "{response.drafted_reply}"
                  </p>
                  <div className="flex justify-between items-center text-[9px] font-bold text-warm-muted uppercase tracking-widest">
                    <span>Confidence: {(response.confidence_score * 100).toFixed(0)}%</span>
                    <span>Time: {response.processing_time_ms}ms</span>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TestWebhookPanel;
