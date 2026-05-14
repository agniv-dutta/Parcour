import React from 'react';
import { Search, Bell, Moon, Sun, TestTube2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Topbar = ({ title = "Guest Messages", onToggleTestPanel }) => {
  return (
    <div className="h-16 bg-[#0F1923] border-bottom border-warm/10 flex items-center justify-between px-8 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-gold text-2xl font-playfair tracking-wide">{title}</h1>
      </div>

      <div className="flex-1 max-w-xl px-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted group-focus-within:text-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search guests, villas, or inquiries..." 
            className="w-full bg-navy/50 border border-warm/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-gold/50 transition-all placeholder:text-warm-muted/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* System Status */}
        <div className="flex items-center gap-2 bg-[#4CAF8211] border border-[#4CAF8233] rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold text-success tracking-widest uppercase">System Online</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleTestPanel}
            className="text-warm-muted hover:text-gold transition-colors"
            title="Test Webhook"
          >
            <TestTube2 size={20} />
          </button>
          
          <div className="relative">
            <Bell size={20} className="text-warm-muted hover:text-gold cursor-pointer transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-navy" />
          </div>

          <button className="text-warm-muted hover:text-gold transition-colors">
            <Moon size={20} />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-warm/10">
            <div className="text-right hidden xl:block">
              <p className="text-[10px] font-bold text-warm leading-none uppercase tracking-wider">Agniv Dutta</p>
              <p className="text-[8px] text-warm-muted uppercase tracking-widest font-bold">Manager</p>
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
