import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { MOCK_MESSAGES } from '../data/mockData';
import { getInitials, getAvatarColor } from '../utils/formatters';
import ChannelIcon from '../components/shared/ChannelIcon';

const GuestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique guests from mock messages
  const guestsMap = MOCK_MESSAGES.reduce((acc, msg) => {
    if (!acc[msg.guest_name]) {
      acc[msg.guest_name] = {
        name: msg.guest_name,
        email: `${msg.guest_name.toLowerCase().replace(' ', '.')}@email.com`,
        channels: new Set([msg.source]),
        messageCount: 1,
        stayCount: Math.floor(Math.random() * 3) + 1,
        lastActive: msg.timestamp,
        id: msg.guest_name.toLowerCase().replace(' ', '-')
      };
    } else {
      acc[msg.guest_name].channels.add(msg.source);
      acc[msg.guest_name].messageCount += 1;
      if (new Date(msg.timestamp) > new Date(acc[msg.guest_name].lastActive)) {
        acc[msg.guest_name].lastActive = msg.timestamp;
      }
    }
    return acc;
  }, {});

  const guests = Object.values(guestsMap).filter(guest => 
    guest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Guests" />
        
        <main className="flex-1 overflow-y-auto app-scrollbar p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-warm font-playfair text-3xl mb-1">Guests</h2>
                <p className="text-warm-muted text-sm uppercase tracking-widest font-bold">
                  {guests.length} guests total
                </p>
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter by name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-navy-surface border border-warm/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-gold/50 transition-all text-warm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guests.map((guest, index) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-navy-surface border-l-2 border-transparent hover:border-gold border border-warm/5 rounded-xl p-6 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-black/20"
                      style={{ backgroundColor: getAvatarColor(guest.name) }}
                    >
                      {getInitials(guest.name)}
                    </div>
                    <div>
                      <h3 className="text-warm font-playfair text-xl leading-none mb-1 group-hover:text-gold transition-colors">{guest.name}</h3>
                      <p className="text-warm-muted text-[10px] uppercase tracking-widest font-bold">{guest.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    {[...guest.channels].map(source => (
                      <ChannelIcon key={source} source={source} className="opacity-70" />
                    ))}
                  </div>

                  <div className="border-t border-warm/5 pt-4 mb-6 grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest font-bold text-warm-muted">
                    <div className="flex flex-col">
                      <span className="text-warm">{guest.messageCount} messages</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-warm">{guest.stayCount} stays</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-warm-muted uppercase tracking-widest font-bold">
                      Last active: {new Date(guest.lastActive).toLocaleDateString()}
                    </span>
                    <Link 
                      to={`/guests/${guest.id}`}
                      className="flex items-center gap-1.5 text-gold text-[10px] font-bold uppercase tracking-widest group-hover:gap-2.5 transition-all"
                    >
                      View Profile <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuestsPage;
