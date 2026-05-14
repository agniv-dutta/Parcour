import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  LifeBuoy,
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import NewBookingModal from '../messages/NewBookingModal';

const NavItem = ({ icon: Icon, label, badge, to, collapsed }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => twMerge(
      "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-l-2",
      isActive 
        ? "text-gold border-gold bg-gold/5" 
        : "text-warm-muted border-transparent hover:text-warm hover:bg-white/5"
    )}
  >
    <Icon size={20} />
    {!collapsed && (
      <>
        <span className="flex-1 text-sm font-medium">{label}</span>
        {badge > 0 && (
          <span className="bg-gold text-navy text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

const Sidebar = ({ messageCount = 0 }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={false}
        animate={{ width: collapsed ? 64 : 210 }}
        className="h-screen bg-navy border-r border-warm/10 flex flex-col relative z-30 flex-shrink-0"
      >
        {/* Collapse Toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-navy border border-warm/10 rounded-full p-1 text-warm-muted hover:text-gold transition-colors z-40"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <div className={twMerge(
          "p-6 flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-playfair font-bold text-xl flex-shrink-0">
            N
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-playfair text-xl tracking-wide text-warm leading-none">Parcour</span>
              <span className="text-[8px] uppercase tracking-widest text-warm-muted font-bold">Luxury Concierge</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 mt-4 overflow-y-auto no-scrollbar">
          <NavItem icon={MessageSquare} label="Messages" badge={messageCount} to="/messages" collapsed={collapsed} />
          <NavItem icon={Users} label="Guests" to="/guests" collapsed={collapsed} />
          <NavItem icon={Building2} label="Properties" to="/properties" collapsed={collapsed} />
          <NavItem icon={BarChart3} label="Analytics" to="/analytics" collapsed={collapsed} />
          <NavItem icon={Settings} label="Settings" to="/settings" collapsed={collapsed} />
        </div>

        {/* Bottom Section */}
        <div className="p-4 space-y-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className={twMerge(
              "w-full border border-gold/50 text-gold hover:bg-gold hover:text-navy transition-all rounded-lg flex items-center justify-center gap-2",
              collapsed ? "p-2" : "py-2 px-4"
            )}
          >
            <Plus size={18} />
            {!collapsed && <span className="text-xs font-bold uppercase tracking-wider">New Booking</span>}
          </button>

          <div className="pt-4 border-t border-warm/5">
            <NavItem icon={LifeBuoy} label="Support" to="/support" collapsed={collapsed} />
            <NavItem icon={UserCircle} label="Account" to="/account" collapsed={collapsed} />
          </div>
        </div>
      </motion.div>

      <NewBookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Sidebar;
