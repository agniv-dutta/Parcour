import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessages } from '../../hooks/useMessages';
import { 
  Inbox, 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  UserCircle,
  Menu,
  ChevronLeft
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: messages } = useMessages({ limit: 1, offset: 0 });
  const messageCount = messages?.length ?? 0;

  const navItems = [
    { icon: Inbox, label: 'Messages', path: '/messages', badge: messageCount },
    { icon: Users, label: 'Guests', path: '/guests' },
    { icon: Building2, label: 'Properties', path: '/properties' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Support', path: '/support' },
    { icon: UserCircle, label: 'Account', path: '/account' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen glass-panel flex flex-col transition-all duration-300 relative z-50"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-4 border-b border-warm/5">
        <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0">
          <span className="text-navy font-playfair font-bold text-xl">N</span>
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-xl font-bold text-gold font-playfair whitespace-nowrap">Parcour</h1>
            <p className="text-[10px] text-warm/40 tracking-widest uppercase">Luxury Concierge</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-md transition-all relative group
              ${isActive ? 'text-gold' : 'text-warm/60 hover:text-warm hover:bg-warm/5'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-gold' : ''} />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
                {!isCollapsed && item.badge !== undefined && (
                  <span className="ml-auto bg-warm/10 text-[10px] px-1.5 py-0.5 rounded-full text-warm">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-bar"
                    className="absolute left-0 w-0.5 h-6 bg-gold" 
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="p-3 border-t border-warm/5 space-y-2">
        <button className="w-full flex items-center justify-center py-3 mb-2 bg-gold/10 hover:bg-gold/20 text-gold rounded-md transition-colors">
           <span className="text-xl">+</span>
           {!isCollapsed && <span className="ml-2 font-semibold text-sm">New Booking</span>}
        </button>
        
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-md transition-all
              ${isActive ? 'text-gold' : 'text-warm/60 hover:text-warm hover:bg-warm/5'}
            `}
          >
            <item.icon size={20} />
            {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-navy shadow-lg"
      >
        {isCollapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
