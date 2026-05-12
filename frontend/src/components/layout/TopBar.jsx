import React from 'react';
import { Search, Bell, Moon, Sun, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../../api/client';

const TopBar = ({ title = "Dashboard" }) => {
  const { data: health, isLoading: isHealthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: healthApi.checkHealth,
    refetchInterval: 30000, // Check every 30s
  });

  const isConnected = !!health;

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-warm/5 bg-navy/30 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-medium text-gold font-playfair">{title}</h2>
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm/30 group-focus-within:text-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search guests, villas, or inquiries..." 
            className="bg-navy-surface/50 border border-warm/10 rounded-md pl-10 pr-4 py-2 w-80 text-sm focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Connection Status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-warm/5 rounded-full border border-warm/10">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-danger'}`} />
          <span className="text-[10px] font-bold tracking-widest uppercase text-warm/60">
            {isHealthLoading ? 'Connecting...' : isConnected ? 'System Online' : 'Disconnected'}
          </span>
        </div>

        <button className="text-warm/60 hover:text-warm transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />
        </button>

        <button className="text-warm/60 hover:text-warm transition-colors">
          <Moon size={20} />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-warm/10">
          <div className="text-right">
            <p className="text-sm font-semibold text-warm">Manager Profile</p>
            <p className="text-[10px] text-success font-bold uppercase tracking-wider">Account Active</p>
          </div>
          <div className="w-10 h-10 rounded-md bg-warm/10 flex items-center justify-center overflow-hidden border border-warm/20">
             <User size={24} className="text-warm/40" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
