import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  Calendar,
  ArrowUpRight,
  ChevronRight,
  Clock,
  PieChart,
  Zap,
  Info
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import axiosInstance from '../api/client';

const StatCard = ({ title, value, trend, sparkline, icon: Icon, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-navy-surface border border-warm/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
  >
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-2 bg-gold/10 rounded-lg text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
        <Icon size={20} />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter ${trend.includes('+') || trend.includes('complaints') ? 'text-danger' : 'text-success'}`}>
        <ArrowUpRight size={12} /> {trend}
      </div>
    </div>
    
    <div className="relative z-10">
      <p className="text-[10px] font-bold text-warm-muted uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-playfair text-warm">{value}</h3>
    </div>

    {/* Sparkline SVG */}
    <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30 group-hover:opacity-60 transition-opacity">
      <svg width="100%" height="100%" viewBox="0 0 100 32" preserveAspectRatio="none">
        {sparkline.map((val, i) => (
          <rect 
            key={i} 
            x={i * (100 / (sparkline.length - 1)) - 1} 
            y={32 - (val / Math.max(...sparkline)) * 28} 
            width="2" 
            height={(val / Math.max(...sparkline)) * 28} 
            fill="#C9A96E"
          />
        ))}
      </svg>
    </div>
  </motion.div>
);

const AnalyticsPage = () => {
  const [range, setRange] = useState('This Week');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const mockStats = {
    total_messages: 12,
    auto_sent_pct: 42,
    avg_confidence: 0.86,
    escalated_count: 2,
    query_breakdown: {
      "Availability": 35,
      "Check-in": 25,
      "Complaint": 20,
      "Pricing": 12,
      "General": 8
    },
    daily_volume: [3, 1, 4, 2, 6, 3, 2]
  };

  const fetchInsights = async () => {
    setLoadingInsights(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/analytics/insights', {
        total_messages: mockStats.total_messages,
        auto_sent_pct: mockStats.auto_sent_pct,
        avg_confidence: mockStats.avg_confidence,
        escalated_count: mockStats.escalated_count,
        query_breakdown: mockStats.query_breakdown,
        daily_volume: mockStats.daily_volume
      });
      setInsights(response.data);
    } catch (err) {
      console.error(err);
      setError("AI insights unavailable — start the backend to enable this feature");
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  // ROW 2 Chart Config
  const MAX_CHART_HEIGHT = 160;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxVol = Math.max(...mockStats.daily_volume);

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Analytics" />
        
        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-warm font-playfair text-3xl mb-1">Analytics Dashboard</h2>
                <p className="text-warm-muted text-[10px] font-bold uppercase tracking-[0.2em]">Real-time AI Metrics & Performance</p>
              </div>
              <div className="flex bg-navy-surface border border-warm/10 rounded-lg p-1">
                {['Today', 'This Week', 'This Month'].map(r => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${range === r ? 'bg-gold text-navy' : 'text-warm-muted hover:text-warm'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* ROW 1: Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Messages" 
                value={mockStats.total_messages} 
                trend="+3 THIS WK" 
                sparkline={[2,3,1,4,3,6,3]} 
                icon={BarChart3} 
                delay={0.1}
              />
              <StatCard 
                title="Auto-sent" 
                value={`${mockStats.auto_sent_pct}%`} 
                trend="+5% FROM PREV" 
                sparkline={[50,40,33,60,42,38,42]} 
                icon={Zap} 
                delay={0.2}
              />
              <StatCard 
                title="Avg Confidence" 
                value={mockStats.avg_confidence.toFixed(2)} 
                trend="STABLE" 
                sparkline={[0.78,0.82,0.88,0.84,0.91,0.85,0.86]} 
                icon={TrendingUp} 
                delay={0.3}
              />
              <StatCard 
                title="Escalated" 
                value={mockStats.escalated_count} 
                trend="COMPLAINTS" 
                sparkline={[0,1,0,0,1,0,2]} 
                icon={ShieldAlert} 
                delay={0.4}
              />
            </div>

            {/* ROW 2: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Message Volume */}
              <div className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
                <h3 className="text-warm font-playfair text-xl mb-8 flex items-center gap-2">
                  <Calendar size={18} className="text-gold" /> Message Volume
                </h3>
                <div className="relative h-[200px] flex items-end justify-between gap-2 px-2">
                  {/* Y-axis */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[8px] font-bold text-warm-muted py-2 -ml-6">
                    <span>6</span>
                    <span>4</span>
                    <span>2</span>
                    <span>0</span>
                  </div>
                  
                  {mockStats.daily_volume.map((val, i) => {
                    const height = (val / maxVol) * MAX_CHART_HEIGHT;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <AnimatePresence>
                          {hoveredBar === i && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute top-0 -translate-y-12 bg-gold text-navy text-[10px] font-bold px-2 py-1 rounded shadow-xl z-20 pointer-events-none"
                            >
                              {val} messages
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gold" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}px` }}
                          onMouseEnter={() => setHoveredBar(i)}
                          onMouseLeave={() => setHoveredBar(null)}
                          className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 cursor-pointer ${hoveredBar === i ? 'bg-gold-light' : 'bg-gold'}`}
                        />
                        <span className="text-[9px] font-bold text-warm-muted uppercase mt-3">{days[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Confidence Distribution */}
              <div className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
                <h3 className="text-warm font-playfair text-xl mb-8 flex items-center gap-2">
                  <TrendingUp size={18} className="text-gold" /> Confidence Distribution
                </h3>
                <div className="space-y-6 pt-4">
                  {[
                    { label: 'Auto-sent (>0.85)', val: 42, color: '#4CAF82' },
                    { label: 'Agent Review (0.6-0.85)', val: 33, color: '#E8A838' },
                    { label: 'Escalated (<0.6)', val: 25, color: '#E05555' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-warm-muted">{item.label}</span>
                        <span className="text-warm">{item.val}%</span>
                      </div>
                      <div className="h-3 bg-navy rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.val}%` }}
                          transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {/* 0.85 indicator for first bar */}
                        {i === 0 && (
                          <div className="absolute top-0 bottom-0 left-[85%] w-0.5 bg-white opacity-40 z-10" />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-[9px] text-warm-muted italic mt-4">
                    <Info size={12} />
                    0.85 threshold determines automatic dispatch
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: AI-Powered Insights */}
            <div className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <h3 className="text-warm font-playfair text-xl">AI Insights</h3>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gold/10 border border-gold/20 rounded text-[9px] font-bold text-gold uppercase tracking-widest">
                    <Sparkles size={10} /> Powered by Claude
                  </div>
                </div>
                <button 
                  onClick={fetchInsights}
                  disabled={loadingInsights}
                  className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest hover:underline disabled:opacity-50"
                >
                  <RefreshCw size={14} className={loadingInsights ? 'animate-spin' : ''} />
                  Refresh Insights
                </button>
              </div>

              {loadingInsights ? (
                <div className="space-y-8">
                  <div className="h-10 bg-navy/50 rounded-lg shimmer w-3/4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="h-40 bg-navy/30 rounded-xl shimmer" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 justify-center text-gold animate-pulse">
                    <Sparkles size={20} />
                    <p className="text-xs font-bold uppercase tracking-widest">Claude is analyzing your data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <ShieldAlert size={40} className="text-danger mb-4 opacity-50" />
                  <p className="text-sm text-warm-muted">{error}</p>
                </div>
              ) : insights ? (
                <div className="space-y-8 relative z-10">
                  {/* Headline Bar */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-navy/40 rounded-xl border border-gold/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gold/20 rounded-full">
                        <Sparkles size={16} className="text-gold" />
                      </div>
                      <p className="text-sm text-warm font-playfair italic">"{insights.headline}"</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-[10px] font-bold text-warm-muted uppercase tracking-widest">Performance Score: {insights.performance_score}/100</p>
                      <div className="flex gap-1">
                        {Array(10).fill(0).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-4 rounded-sm ${i < insights.performance_score / 10 ? 'bg-gold' : 'bg-navy'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Insight Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {insights.insights.map((insight, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 rounded-xl border-l-4 bg-navy/20 border-y border-r border-warm/5 flex flex-col`}
                        style={{ borderLeftColor: 
                          insight.type === 'positive' ? '#4CAF82' : 
                          insight.type === 'warning' ? '#E8A838' : 
                          insight.type === 'critical' ? '#E05555' : '#C9A96E' 
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                            style={{ 
                              backgroundColor: 
                                insight.type === 'positive' ? '#4CAF8211' : 
                                insight.type === 'warning' ? '#E8A83811' : 
                                insight.type === 'critical' ? '#E0555511' : '#C9A96E11',
                              color: 
                                insight.type === 'positive' ? '#4CAF82' : 
                                insight.type === 'warning' ? '#E8A838' : 
                                insight.type === 'critical' ? '#E05555' : '#C9A96E',
                              border: `1px solid ${
                                insight.type === 'positive' ? '#4CAF8233' : 
                                insight.type === 'warning' ? '#E8A83833' : 
                                insight.type === 'critical' ? '#E0555533' : '#C9A96E33'
                              }`
                            }}
                          >
                            ↗ {insight.type}
                          </span>
                          <span className="text-xl font-playfair text-warm">{insight.metric}</span>
                        </div>
                        <h4 className="text-sm font-bold text-warm mb-2">{insight.title}</h4>
                        <p className="text-xs text-warm-muted leading-relaxed mb-4 flex-1">
                          {insight.body}
                        </p>
                        <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest mt-auto group cursor-pointer hover:underline">
                          <span>→ {insight.action}</span>
                          <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Week Summary */}
                  <div className="p-6 bg-navy/30 rounded-xl border-l-4 border-gold/50 italic text-warm-muted text-sm leading-relaxed">
                    "{insights.week_summary}"
                  </div>
                </div>
              ) : null}
            </div>

            {/* ROW 4: Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Avg Response Time */}
              <div className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl">
                <h3 className="text-warm font-playfair text-xl mb-8 flex items-center gap-2">
                  <Clock size={18} className="text-gold" /> Avg Response by Query Type
                </h3>
                <div className="space-y-5">
                  {[
                    { label: 'Availability', time: '243ms', val: 65, color: '#C9A96E' },
                    { label: 'Check-in', time: '198ms', val: 55, color: '#4CAF82' },
                    { label: 'Complaint', time: '381ms', val: 95, color: '#E05555', warning: true },
                    { label: 'Pricing', time: '312ms', val: 80, color: '#E8A838' },
                    { label: 'General', time: '167ms', val: 45, color: '#8B96A5' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-24 text-[9px] font-bold text-warm-muted uppercase tracking-tighter truncate">
                        {item.label} {item.warning && '⚠'}
                      </div>
                      <div className="flex-1 h-2 bg-navy rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.val}%` }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <div className={`w-12 text-right text-[10px] font-bold ${item.warning ? 'text-danger' : 'text-warm'}`}>
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Distribution Donut */}
              <div className="bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl flex flex-col items-center">
                <h3 className="text-warm font-playfair text-xl mb-8 self-start flex items-center gap-2">
                  <PieChart size={18} className="text-gold" /> Action Distribution
                </h3>
                
                <div className="relative w-48 h-48 mb-8">
                  <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    {/* Auto-sent segment (42%) */}
                    <circle
                      cx="100" cy="100" r="70"
                      fill="transparent"
                      stroke="#4CAF82"
                      strokeWidth="20"
                      strokeDasharray={`${(42 / 100) * 440} 440`}
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Agent Review segment (33%) - Offset by 42% */}
                    <circle
                      cx="100" cy="100" r="70"
                      fill="transparent"
                      stroke="#E8A838"
                      strokeWidth="20"
                      strokeDasharray={`${(33 / 100) * 440} 440`}
                      strokeDashoffset={`-${(42 / 100) * 440}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Escalated segment (25%) - Offset by 75% */}
                    <circle
                      cx="100" cy="100" r="70"
                      fill="transparent"
                      stroke="#E05555"
                      strokeWidth="20"
                      strokeDasharray={`${(25 / 100) * 440} 440`}
                      strokeDashoffset={`-${(75 / 100) * 440}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-bold text-warm-muted uppercase tracking-widest leading-none">Actions</p>
                    <p className="text-xl font-playfair text-warm">100%</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 w-full px-4">
                  {[
                    { label: 'Auto', val: 42, color: '#4CAF82' },
                    { label: 'Review', val: 33, color: '#E8A838' },
                    { label: 'Escalate', val: 25, color: '#E05555' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <p className="text-[9px] font-bold text-warm-muted uppercase">{item.label}</p>
                      <p className="text-xs font-bold text-warm">{item.val}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
