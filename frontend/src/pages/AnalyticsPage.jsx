import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, MessageSquare, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { QUERY_COLORS } from '../data/mockData';

const StatCard = ({ label, value, trend, trendType, icon: Icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-navy-surface border border-warm/10 rounded-2xl p-6 shadow-xl shadow-black/10"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gold/5 rounded-xl border border-gold/10 text-gold">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${
        trendType === 'up' ? 'text-success' : 'text-danger'
      }`}>
        {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
    <h3 className="text-warm-muted text-[10px] uppercase tracking-widest font-bold mb-1">{label}</h3>
    <p className="text-gold font-playfair text-4xl">{value}</p>
  </motion.div>
);

const AnalyticsPage = () => {
  const weeklyData = [3, 1, 4, 2, 6, 3, 2];
  const maxVal = Math.max(...weeklyData);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const queryDistribution = [
    { type: 'pre_sales_availability', percent: 35 },
    { type: 'post_sales_checkin', percent: 25 },
    { type: 'complaint', percent: 20 },
    { type: 'pre_sales_pricing', percent: 12 },
    { type: 'general_enquiry', percent: 8 },
  ];

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Analytics" />
        
        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="mb-2">
              <h2 className="text-warm font-playfair text-3xl mb-1">Performance Overview</h2>
              <p className="text-warm-muted text-sm uppercase tracking-widest font-bold">Real-time AI metrics</p>
            </div>

            {/* Top Row: Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Messages" value="12" trend="+3 this week" trendType="up" icon={MessageSquare} />
              <StatCard label="Auto-sent" value="42%" trend="5 total" trendType="up" icon={Zap} />
              <StatCard label="Avg Confidence" value="0.86" trend="+0.04" trendType="up" icon={ShieldCheck} />
              <StatCard label="Escalated" value="2" trend="Complaints" trendType="down" icon={AlertTriangle} />
            </div>

            {/* Middle: Message Volume Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-8 bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl shadow-black/10"
              >
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-warm font-playfair text-xl">Messages this week</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[9px] text-warm-muted uppercase tracking-widest font-bold">
                      <span className="w-2 h-2 rounded-full bg-gold" /> Volume
                    </div>
                  </div>
                </div>
                
                <div className="h-64 flex items-end justify-between gap-4">
                  {weeklyData.map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                      <div className="w-full relative">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(val / maxVal) * 100}%` }}
                          transition={{ delay: idx * 0.1, duration: 1 }}
                          className="w-full bg-gold/20 border-t border-x border-gold/50 rounded-t-lg group-hover:bg-gold/40 transition-all relative"
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {val} messages
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-[10px] text-warm-muted font-bold uppercase tracking-widest">{days[idx]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Bottom/Right: Query Type Breakdown */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4 bg-navy-surface border border-warm/10 rounded-2xl p-8 shadow-xl shadow-black/10 flex flex-col"
              >
                <h3 className="text-warm font-playfair text-xl mb-8">Query Breakdown</h3>
                <div className="flex-1 space-y-6">
                  {queryDistribution.map((item, idx) => {
                    const config = QUERY_COLORS[item.type];
                    return (
                      <div key={item.type} className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                          <span style={{ color: config.text }}>{config.label}</span>
                          <span className="text-warm">{item.percent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-navy rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ delay: 0.5 + (idx * 0.1), duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: config.text }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
