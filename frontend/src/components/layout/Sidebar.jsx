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
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import NewBookingModal from '../messages/NewBookingModal';

const NavItem = ({ icon: Icon, label, badge, to, collapsed }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <NavLink 
        to={to}
        onMouseEnter={() => collapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={({ isActive }) => twMerge(
          "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-l-2",
          isActive 
            ? "text-gold border-gold bg-gold/5" 
            : "text-warm-muted border-transparent hover:text-warm hover:bg-white/5",
          collapsed && "justify-center px-0 border-l-0"
        )}
      >
        <div className="relative">
          <Icon size={20} />
          {collapsed && badge > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full border border-navy" />
          )}
        </div>
        
        <AnimatePresence>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 flex items-center justify-between"
            >
              <span className="text-sm font-medium">{label}</span>
              {badge > 0 && (
                <span className="bg-gold text-navy text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </NavLink>

      {/* Tooltip for collapsed state */}
      <AnimatePresence>
        {collapsed && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 20 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-gold text-navy text-[10px] font-bold uppercase tracking-widest rounded shadow-xl z-[60] pointer-events-none whitespace-nowrap"
          >
            {label}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-r-gold" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ messageCount = 0 }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={false}
        animate={{ width: collapsed ? 64 : 210 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="h-screen bg-navy border-r border-warm/10 flex flex-col relative z-30 flex-shrink-0"
      >
        {/* Collapse Toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-10 bg-navy border border-warm/10 rounded-full p-1 text-warm-muted hover:text-gold transition-colors z-40"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <div className={twMerge(
          "p-6 flex items-center gap-3 overflow-hidden",
          collapsed && "justify-center p-4"
        )}>
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-playfair font-bold text-xl flex-shrink-0">
            N
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="font-playfair text-xl tracking-wide text-warm leading-none">Parcour</span>
                <span className="text-[8px] uppercase tracking-widest text-warm-muted font-bold">Luxury Concierge</span>
              </motion.div>
            )}
          </AnimatePresence>
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
        <div className="p-4 space-y-2 border-t border-warm/5">
          <button 
            onClick={() => setIsModalOpen(true)}
            className={twMerge(
              "w-full border border-gold/50 text-gold hover:bg-gold hover:text-navy transition-all rounded-lg flex items-center justify-center gap-2 overflow-hidden",
              collapsed ? "p-2" : "py-2 px-4"
            )}
            title={collapsed ? "New Booking" : ""}
          >
            <Plus size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">New Booking</span>}
          </button>

          <NavItem icon={LifeBuoy} label="Support" to="/support" collapsed={collapsed} />
          <NavItem icon={UserCircle} label="Account" to="/account" collapsed={collapsed} />
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
