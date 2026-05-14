import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, TestTube2, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getHealth } from '../../api/client';
import { MOCK_MESSAGES } from '../../data/mockData';

const Topbar = ({ title = "Guest Messages", onToggleTestPanel, onToggleMobileSidebar }) => {
  const [time, setTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState('online'); // online, offline, degraded
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  // Real-time clock (IST)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatIST = (date) => {
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }).replace(',', ' ·') + ' IST';
  };

  // Health Polling (30s)
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await getHealth();
        if (health.status === 'ok') {
          setSystemStatus(health.model ? 'online' : 'degraded');
        } else {
          setSystemStatus('offline');
        }
      } catch (err) {
        setSystemStatus('offline');
      }
    };
    checkHealth();
    const poll = setInterval(checkHealth, 30000);
    return () => clearInterval(poll);
  }, []);

  const notifications = MOCK_MESSAGES.filter(m => 
    m.action === 'escalate' || m.action === 'agent_review'
  ).slice(0, 5);

  return (
    <div className="h-16 bg-[#0F1923] border-b border-warm/10 flex items-center justify-between px-6 lg:px-8 z-20 relative">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-warm-muted hover:text-gold transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-gold text-xl lg:text-2xl font-playfair tracking-wide truncate">{title}</h1>
      </div>

      <div className="flex-1 max-w-xl px-4 lg:px-12 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted group-focus-within:text-gold transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Press K to search..." 
            className="w-full bg-navy/50 border border-warm/10 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-gold/50 transition-all placeholder:text-warm-muted/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        {/* Real-time Clock */}
        <div className="hidden xl:block text-[10px] font-bold text-warm-muted uppercase tracking-widest bg-navy/30 px-3 py-1.5 rounded-lg border border-warm/5">
          {formatIST(time)}
        </div>

        {/* System Status */}
        <motion.div 
          animate={{ 
            borderColor: systemStatus === 'online' ? '#4CAF8233' : '#E8A83833',
            backgroundColor: systemStatus === 'online' ? '#4CAF8211' : '#E8A83811'
          }}
          className="flex items-center gap-2 border rounded-full px-3 py-1"
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            systemStatus === 'online' ? 'bg-success' : 'bg-warning'
          }`} />
          <span className={`text-[9px] font-bold tracking-widest uppercase ${
            systemStatus === 'online' ? 'text-success' : 'text-warning'
          }`}>
            {systemStatus === 'online' ? 'System Online' : systemStatus === 'degraded' ? 'AI Degraded' : 'Backend Offline'}
          </span>
        </motion.div>

        <div className="flex items-center gap-3 lg:gap-4">
          <button 
            onClick={onToggleTestPanel}
            className="text-warm-muted hover:text-gold transition-colors hidden sm:block"
            title="Test Webhook"
          >
            <TestTube2 size={18} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="text-warm-muted hover:text-gold transition-colors relative p-1"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-danger rounded-full border-2 border-navy text-[7px] flex items-center justify-center font-bold">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-[#162032] border border-warm/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-warm/5 bg-navy/30">
                      <p className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Priority Alerts</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto no-scrollbar">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            navigate(`/messages/${n.id}`);
                            setIsNotificationOpen(false);
                          }}
                          className="p-4 border-b border-warm/5 hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs font-bold text-warm truncate">{n.guest_name}</p>
                            <span className="text-[8px] text-danger font-bold uppercase tracking-widest px-1.5 py-0.5 bg-danger/10 rounded border border-danger/20">
                              {n.action.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-[9px] text-warm-muted uppercase tracking-widest truncate max-w-[120px]">
                              {n.query_type.replace(/_/g, ' ')}
                            </p>
                            <div className="text-gold text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                              View <ArrowRight size={10} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-warm/10">
            <div className="text-right hidden xl:block">
              <p className="text-[9px] font-bold text-warm leading-none uppercase tracking-wider">Agniv Dutta</p>
              <p className="text-[7px] text-warm-muted uppercase tracking-widest font-bold">Manager</p>
            </div>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Agniv" 
              alt="Manager" 
              className="w-8 h-8 rounded-full border border-gold/30 bg-navy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
