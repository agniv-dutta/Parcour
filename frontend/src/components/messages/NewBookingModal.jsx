import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Database, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { sendToAI } from '../../api/client';
import ConfidenceMeter from '../shared/ConfidenceMeter';
import ActionBadge from '../shared/ActionBadge';

const NewBookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    source: 'whatsapp',
    guest_name: '',
    message_text: '',
    booking_ref: `NIS-2026-${Math.floor(Math.random() * 9000) + 1000}`,
    property_id: 'Villa B1'
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name || !formData.message_text) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setResponse(null);
    setError(null);
    
    try {
      const res = await sendToAI({
        ...formData,
        timestamp: new Date().toISOString()
      });
      setResponse(res);
    } catch (err) {
      setError('Backend offline — check that FastAPI is running on port 8000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[#0F1923] border border-warm/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-warm/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-xl">
                  <Database className="text-gold" size={24} />
                </div>
                <div>
                  <h2 className="text-warm font-playfair text-2xl">New Booking Intake</h2>
                  <p className="text-[10px] text-warm-muted uppercase tracking-widest font-bold">Simulate a guest inquiry</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-warm-muted hover:text-warm transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Form Side */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6 border-r border-warm/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Guest Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.guest_name}
                    onChange={e => setFormData({...formData, guest_name: e.target.value})}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-navy/50 border border-warm/10 rounded-xl p-3 text-sm text-warm focus:outline-none focus:border-gold/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Source</label>
                    <select 
                      value={formData.source}
                      onChange={e => setFormData({...formData, source: e.target.value})}
                      className="w-full bg-navy/50 border border-warm/10 rounded-xl p-3 text-sm text-warm focus:outline-none focus:border-gold/50 transition-all appearance-none"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="airbnb">Airbnb</option>
                      <option value="booking_com">Booking.com</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Property</label>
                    <select 
                      value={formData.property_id}
                      onChange={e => setFormData({...formData, property_id: e.target.value})}
                      className="w-full bg-navy/50 border border-warm/10 rounded-xl p-3 text-sm text-warm focus:outline-none focus:border-gold/50 transition-all appearance-none"
                    >
                      <option value="Villa B1">Villa B1</option>
                      <option value="Villa B2">Villa B2</option>
                      <option value="Villa C2">Villa C2</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Guest Message *</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message_text}
                    onChange={e => setFormData({...formData, message_text: e.target.value})}
                    placeholder="Type the guest's message here..."
                    className="w-full bg-navy/50 border border-warm/10 rounded-xl p-3 text-sm text-warm focus:outline-none focus:border-gold/50 transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-danger text-[10px] font-bold uppercase tracking-widest">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gold text-navy font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light transition-all disabled:opacity-50 shadow-lg shadow-gold/20"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
                  <span className="uppercase tracking-widest text-sm">Process with AI</span>
                </button>
              </form>

              {/* Results Side */}
              <div className="p-8 bg-navy/20 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-warm-muted text-[10px] font-bold uppercase tracking-widest mb-6">AI Pipeline Analysis</h3>
                  
                  {!response && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <Sparkles size={48} className="mb-4 text-gold/20" />
                      <p className="text-xs font-playfair italic">Fill the form and click process<br/>to see AI Magic</p>
                    </div>
                  )}

                  {loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Loader2 size={48} className="mb-4 text-gold animate-spin" />
                      <p className="text-[10px] font-bold text-gold uppercase tracking-widest animate-pulse">Analyzing Message...</p>
                    </div>
                  )}

                  {response && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-6">
                        <ConfidenceMeter score={response.confidence_score} size={70} strokeWidth={6} />
                        <div>
                          <p className="text-[9px] text-warm-muted uppercase tracking-widest font-bold mb-1">Detected Type</p>
                          <p className="text-warm font-playfair text-lg leading-none">
                            {response.query_type?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'General Enquiry'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-navy/50 border border-warm/10 rounded-2xl p-4">
                        <p className="text-[9px] text-gold uppercase tracking-widest font-bold mb-2">AI Drafted Reply</p>
                        <p className="text-xs text-warm/80 italic leading-relaxed">
                          "{response.drafted_reply}"
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[9px] text-warm-muted uppercase tracking-widest font-bold mb-1">Recommended Action</p>
                          <ActionBadge action={response.confidence_score > 0.8 ? 'auto_send' : 'agent_review'} />
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-warm-muted uppercase tracking-widest font-bold mb-1">Latency</p>
                          <p className="text-xs text-warm font-bold">{response.processing_time_ms}ms</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-warm/5">
                        <div className="flex items-center gap-2 text-success text-[10px] font-bold uppercase tracking-widest">
                          <CheckCircle2 size={14} /> Ready for Deployment
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewBookingModal;
