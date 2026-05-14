import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Globe, Database, Bell, CheckCircle2, XCircle, RefreshCw, Edit3, Save, Zap, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { getHealth, sendToAI } from '../api/client';

const SettingsPage = () => {
  const [autoThreshold, setAutoThreshold] = useState(0.85);
  const [reviewThreshold, setReviewThreshold] = useState(0.60);
  const [apiStatus, setApiStatus] = useState('idle'); // idle, checking, success, error
  const [healthInfo, setHealthInfo] = useState(null);
  const [lastChecked, setLastChecked] = useState(0);
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [propertyContext, setPropertyContext] = useState(
    "Nistula Luxury Villas: A collection of 3 bespoke properties in North Goa. \nVilla B1 (Assagao): 3BR, private pool. \nVilla B2 (Anjuna): 4BR, infinity pool. \nVilla C2 (Vagator): 2BR, sea view. \nCheck-in: 2pm, Check-out: 11am."
  );
  
  const [notifications, setNotifications] = useState({
    autoSend: true,
    complaints: true,
    digest: false
  });

  // Timer for last checked
  useEffect(() => {
    let interval;
    if (apiStatus === 'success' || apiStatus === 'error') {
      interval = setInterval(() => {
        setLastChecked(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [apiStatus]);

  const checkConnection = async () => {
    setApiStatus('checking');
    setLastChecked(0);
    try {
      // 1. Health check
      const health = await getHealth();
      
      // 2. Claude API end-to-end check
      const testPayload = {
        source: "direct",
        guest_name: "API Test",
        message: "Is the villa available this weekend?",
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

  const getThresholdColor = (val) => {
    if (val >= 0.85) return '#4CAF82';
    if (val >= 0.60) return '#E8A838';
    return '#E05555';
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
                <div className="p-2 bg-gold/10 rounded-lg">
                  <Settings className="text-gold" size={20} />
                </div>
                <h3 className="text-warm font-playfair text-xl">AI Configuration</h3>
              </div>

              <div className="space-y-10">
                {/* Auto-send Threshold */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <label className="text-[10px] font-bold text-warm uppercase tracking-widest">Auto-send Threshold</label>
                      <p className="text-[10px] text-warm-muted">Replies above this score are sent automatically</p>
                    </div>
                    <span className="text-gold font-bold text-lg">{autoThreshold.toFixed(2)}</span>
                  </div>
                  <div className="relative pt-2">
                    <input 
                      type="range" min="0.5" max="1" step="0.01" 
                      value={autoThreshold}
                      onChange={(e) => setAutoThreshold(parseFloat(e.target.value))}
                      className="w-full accent-gold bg-navy h-1.5 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex w-full h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-danger w-[20%]" />
                      <div className="bg-warning w-[50%]" />
                      <div className="bg-success w-[30%]" />
                    </div>
                    {/* Pointer */}
                    <div 
                      className="absolute top-[26px] w-0.5 h-3 bg-white shadow-xl transition-all"
                      style={{ left: `${((autoThreshold - 0.5) / 0.5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Agent Review Threshold */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <label className="text-[10px] font-bold text-warm uppercase tracking-widest">Agent Review Threshold</label>
                      <p className="text-[10px] text-warm-muted">Replies between this and auto-send go to agent review</p>
                    </div>
                    <span className="text-gold font-bold text-lg">{reviewThreshold.toFixed(2)}</span>
                  </div>
                  <div className="relative pt-2">
                    <input 
                      type="range" min="0.5" max="1" step="0.01" 
                      value={reviewThreshold}
                      onChange={(e) => setReviewThreshold(parseFloat(e.target.value))}
                      className="w-full accent-gold bg-navy h-1.5 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex w-full h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-danger w-[20%]" />
                      <div className="bg-warning w-[50%]" />
                      <div className="bg-success w-[30%]" />
                    </div>
                    <div 
                      className="absolute top-[26px] w-0.5 h-3 bg-white shadow-xl transition-all"
                      style={{ left: `${((reviewThreshold - 0.5) / 0.5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Live Mapping Preview */}
                <div className="p-6 bg-navy/30 rounded-xl border border-warm/5">
                  <p className="text-[10px] font-bold text-warm-muted uppercase tracking-widest mb-4">Live Action Mapping Preview</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <div className="text-[10px]">
                        <p className="text-warm font-bold">Score &gt; {autoThreshold.toFixed(2)}</p>
                        <p className="text-success uppercase tracking-tighter font-bold">● AUTO-SEND</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <div className="text-[10px]">
                        <p className="text-warm font-bold">{reviewThreshold.toFixed(2)} – {autoThreshold.toFixed(2)}</p>
                        <p className="text-warning uppercase tracking-tighter font-bold">● AGENT REVIEW</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-danger" />
                      <div className="text-[10px]">
                        <p className="text-warm font-bold">Score &lt; {reviewThreshold.toFixed(2)}</p>
                        <p className="text-danger uppercase tracking-tighter font-bold">● ESCALATE</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: API Status */}
            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-lg">
                    <Zap className="text-gold" size={20} />
                  </div>
                  <h3 className="text-warm font-playfair text-xl">API Status</h3>
                </div>
                <div className="text-right">
                  <button 
                    onClick={checkConnection}
                    disabled={apiStatus === 'checking'}
                    className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-gold hover:text-navy transition-all active:scale-95 disabled:opacity-50"
                  >
                    {apiStatus === 'checking' ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                    Check API Connection
                  </button>
                  {apiStatus !== 'idle' && (
                    <p className="text-[9px] text-warm-muted mt-2 uppercase tracking-widest">
                      Last checked: {lastChecked} seconds ago
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {apiStatus === 'idle' && (
                  <div className="py-8 flex flex-col items-center justify-center border border-dashed border-warm/10 rounded-xl opacity-40">
                    <Globe size={32} className="mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Run diagnostics to verify system health</p>
                  </div>
                )}

                {apiStatus === 'success' && healthInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle2 className="text-success" size={18} />
                      <div>
                        <p className="text-[10px] font-bold text-success uppercase tracking-widest">Backend Connected</p>
                        <p className="text-[9px] text-warm-muted">FastAPI v{healthInfo.health.version || '1.0'}</p>
                      </div>
                    </div>
                    <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle2 className="text-success" size={18} />
                      <div>
                        <p className="text-[10px] font-bold text-success uppercase tracking-widest">Claude API Active</p>
                        <p className="text-[9px] text-warm-muted">Model: {healthInfo.health.model || 'claude-3-sonnet'}</p>
                      </div>
                    </div>
                    <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle2 className="text-success" size={18} />
                      <div>
                        <p className="text-[10px] font-bold text-success uppercase tracking-widest">DB Connected</p>
                        <p className="text-[9px] text-warm-muted">System ready for transactions</p>
                      </div>
                    </div>
                    <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle2 className="text-success" size={18} />
                      <div>
                        <p className="text-[10px] font-bold text-success uppercase tracking-widest">AI Response Valid</p>
                        <p className="text-[9px] text-warm-muted">Confidence: {healthInfo.aiResponse.confidence_score.toFixed(2)} | {healthInfo.aiResponse.query_type}</p>
                      </div>
                    </div>
                  </div>
                )}

                {apiStatus === 'error' && (
                  <div className="space-y-3">
                    <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 flex items-center gap-3">
                      <XCircle className="text-danger" size={18} />
                      <div>
                        <p className="text-[10px] font-bold text-danger uppercase tracking-widest">Backend Offline</p>
                        <p className="text-[9px] text-warm-muted">Ensure FastAPI is running on http://localhost:8000</p>
                      </div>
                    </div>
                    <div className="p-4 bg-navy/50 rounded-xl border border-warm/10 flex items-start gap-3">
                      <AlertTriangle className="text-warning flex-shrink-0" size={16} />
                      <p className="text-[10px] text-warm-muted leading-relaxed">
                        <span className="text-warm font-bold">Fix:</span> Run <code className="bg-navy px-1.5 py-0.5 rounded text-gold">uvicorn app.main:app --reload</code> in the backend directory.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Property Context */}
            <section className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-lg">
                    <Database className="text-gold" size={20} />
                  </div>
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
                <div className="p-2 bg-gold/10 rounded-lg">
                  <Bell className="text-gold" size={20} />
                </div>
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
