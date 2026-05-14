import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Globe, Database, Bell, CheckCircle2, XCircle, RefreshCw, Edit3, Save } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { getHealth, sendToAI } from '../api/client';

const SettingsPage = () => {
  const [autoThreshold, setAutoThreshold] = useState(0.85);
  const [reviewThreshold, setReviewThreshold] = useState(0.60);
  const [apiStatus, setApiStatus] = useState('idle'); // idle, checking, success, error
  const [healthInfo, setHealthInfo] = useState(null);
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [propertyContext, setPropertyContext] = useState(
    "Nistula Luxury Villas: A collection of 3 bespoke properties in North Goa. \nVilla B1 (Assagao): 3BR, private pool. \nVilla B2 (Anjuna): 4BR, infinity pool. \nVilla C2 (Vagator): 2BR, sea view. \nCheck-in: 2pm, Check-out: 11am."
  );
  
  const [notifications, setNotifications] = useState({
    autoSend: true,
    complaints: true,
    digest: false
  });

  const checkConnection = async () => {
    setApiStatus('checking');
    try {
      // 1. Health check
      const health = await getHealth();
      
      // 2. Claude API end-to-end check
      const testPayload = {
        source: "direct",
        guest_name: "API Test",
        message_text: "Is the villa available this weekend?",
        timestamp: new Date().toISOString(),
        booking_ref: "TEST-0001",
        property_id: "villa-b1"
      };
      
      const aiResponse = await sendToAI(testPayload);
      
      setHealthInfo({
        health,
        aiResponse
      });
      setApiStatus('success');
    } catch (err) {
      console.error(err);
      setApiStatus('error');
    }
  };

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Settings" />
        
        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="mb-2">
              <h2 className="text-warm font-playfair text-3xl mb-1">System Settings</h2>
              <p className="text-warm-muted text-sm uppercase tracking-widest font-bold">Configure AI & API integration</p>
            </div>

            {/* Section 1: AI Configuration */}
            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <Cpu className="text-gold" size={24} />
                <h3 className="text-warm font-playfair text-xl">AI Configuration</h3>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Auto-send Threshold</label>
                      <span className="text-gold font-bold text-xs">{autoThreshold.toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05" 
                      value={autoThreshold}
                      onChange={(e) => setAutoThreshold(parseFloat(e.target.value))}
                      className="w-full accent-gold bg-navy h-1.5 rounded-full"
                    />
                    <p className="text-[9px] text-warm-muted italic">Confidence score required to send reply without human review.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Agent Review Threshold</label>
                      <span className="text-gold font-bold text-xs">{reviewThreshold.toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05" 
                      value={reviewThreshold}
                      onChange={(e) => setReviewThreshold(parseFloat(e.target.value))}
                      className="w-full accent-gold bg-navy h-1.5 rounded-full"
                    />
                    <p className="text-[9px] text-warm-muted italic">Messages below this score are automatically escalated.</p>
                  </div>
                </div>

                <div className="p-4 bg-navy/30 rounded-xl border border-warm/5">
                  <p className="text-[10px] font-bold text-warm-muted uppercase tracking-widest mb-3">Active Mapping</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-[9px] text-warm uppercase tracking-widest">Auto-send (&gt;{autoThreshold})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-[9px] text-warm uppercase tracking-widest">Review ({reviewThreshold}-{autoThreshold})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-danger" />
                      <span className="text-[9px] text-warm uppercase tracking-widest">Escalate (&lt;{reviewThreshold})</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: API Status */}
            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Globe className="text-gold" size={24} />
                  <h3 className="text-warm font-playfair text-xl">API Status</h3>
                </div>
                <button 
                  onClick={checkConnection}
                  disabled={apiStatus === 'checking'}
                  className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-gold hover:text-navy transition-all"
                >
                  {apiStatus === 'checking' ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  Check Connection
                </button>
              </div>

              <div className="space-y-4">
                {apiStatus === 'idle' && (
                  <p className="text-[10px] text-warm-muted uppercase tracking-widest text-center py-4 border border-dashed border-warm/10 rounded-xl">
                    Run diagnostics to verify system health
                  </p>
                )}

                {apiStatus === 'success' && healthInfo && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="text-success flex-shrink-0" size={18} />
                      <div>
                        <p className="text-[10px] font-bold text-success uppercase tracking-widest mb-1">Backend Online</p>
                        <p className="text-[9px] text-warm-muted">FastAPI responding | DB: connected</p>
                      </div>
                    </div>
                    <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="text-success flex-shrink-0" size={18} />
                      <div>
                        <p className="text-[10px] font-bold text-success uppercase tracking-widest mb-1">Claude API Responding</p>
                        <p className="text-[9px] text-warm-muted">Model: {healthInfo.health.model || 'claude-sonnet-4'} | Confidence: {(healthInfo.aiResponse.confidence_score * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {apiStatus === 'error' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-danger/5 border border-danger/20 rounded-xl p-4 flex items-start gap-3">
                    <XCircle className="text-danger flex-shrink-0" size={18} />
                    <div>
                      <p className="text-[10px] font-bold text-danger uppercase tracking-widest mb-1">Backend Offline</p>
                      <p className="text-[9px] text-warm-muted">Ensure FastAPI is running on http://localhost:8000</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>

            {/* Section 3: Property Context */}
            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Database className="text-gold" size={24} />
                  <h3 className="text-warm font-playfair text-xl">Property Context</h3>
                </div>
                <button 
                  onClick={() => setIsEditingContext(!isEditingContext)}
                  className="text-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:underline"
                >
                  {isEditingContext ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit Context</>}
                </button>
              </div>
              <textarea 
                readOnly={!isEditingContext}
                value={propertyContext}
                onChange={(e) => setPropertyContext(e.target.value)}
                className={`w-full h-32 bg-navy/50 border border-warm/10 rounded-xl p-4 text-xs text-warm/70 leading-relaxed focus:outline-none transition-all ${isEditingContext ? 'border-gold/30' : ''} resize-none`}
              />
              <p className="text-[9px] text-warm-muted mt-2 italic">This context is injected into AI prompts to ensure accurate responses.</p>
            </section>

            {/* Section 4: Notifications */}
            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <Bell className="text-gold" size={24} />
                <h3 className="text-warm font-playfair text-xl">Notification Preferences</h3>
              </div>

              <div className="space-y-6">
                {[
                  { id: 'autoSend', label: 'Auto-send notifications', desc: 'Alert when AI responds directly to guests' },
                  { id: 'complaints', label: 'Complaint alerts', desc: 'Urgent notifications for low-confidence complaints' },
                  { id: 'digest', label: 'Daily summary digest', desc: 'Morning report of all activity' },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-warm font-medium">{item.label}</p>
                      <p className="text-[10px] text-warm-muted uppercase tracking-widest font-bold">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                      className={`w-12 h-6 rounded-full relative transition-colors ${notifications[item.id] ? 'bg-gold' : 'bg-navy'}`}
                    >
                      <motion.div 
                        animate={{ x: notifications[item.id] ? 26 : 2 }}
                        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
