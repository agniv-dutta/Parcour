import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, MessageCircle, Home, Building2, MapPin } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/TopBar';
import { MOCK_MESSAGES } from '../data/mockData';
import { getInitials, getAvatarColor, timeAgo } from '../utils/formatters';
import ChannelIcon from '../components/shared/ChannelIcon';
import QueryTypeBadge from '../components/shared/QueryTypeBadge';
import ActionBadge from '../components/shared/ActionBadge';

const GuestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find guest info from messages
  const guestMessages = MOCK_MESSAGES.filter(m => m.guest_name.toLowerCase().replace(' ', '-') === id);
  
  if (guestMessages.length === 0) {
    return <div className="p-10 text-center text-warm font-playfair text-2xl">Guest not found</div>;
  }

  const guest = {
    name: guestMessages[0].guest_name,
    channels: [...new Set(guestMessages.map(m => m.source))],
    properties: [...new Set(guestMessages.map(m => m.property_id))],
    totalMessages: guestMessages.length,
    totalStays: 2 // Mock
  };

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Guest Profile" />
        
        <main className="flex-1 overflow-y-auto app-scrollbar p-8">
          <div className="max-w-6xl mx-auto">
            <Link 
              to="/guests" 
              className="inline-flex items-center gap-2 text-warm-muted hover:text-gold transition-colors mb-8 text-[10px] font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Guests
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Profile Card (35%) */}
              <div className="lg:col-span-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-navy-surface border border-warm/10 rounded-2xl p-8 sticky top-0"
                >
                  <div className="flex flex-col items-center text-center mb-8">
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-black/30 mb-4"
                      style={{ backgroundColor: getAvatarColor(guest.name) }}
                    >
                      {getInitials(guest.name)}
                    </div>
                    <h2 className="text-warm font-playfair text-3xl mb-2">{guest.name}</h2>
                    <div className="flex gap-2 mb-6">
                      {guest.channels.map(source => (
                        <ChannelIcon key={source} source={source} className="opacity-80 scale-110" />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-navy/30 rounded-xl p-4 border border-warm/5">
                        <p className="text-[9px] text-warm-muted uppercase tracking-widest font-bold mb-1">Messages</p>
                        <p className="text-gold font-playfair text-2xl">{guest.totalMessages}</p>
                      </div>
                      <div className="bg-navy/30 rounded-xl p-4 border border-warm/5">
                        <p className="text-[9px] text-warm-muted uppercase tracking-widest font-bold mb-1">Stays</p>
                        <p className="text-gold font-playfair text-2xl">{guest.totalStays}</p>
                      </div>
                    </div>

                    <div className="bg-navy/30 rounded-xl p-4 border border-warm/5">
                      <p className="text-[9px] text-warm-muted uppercase tracking-widest font-bold mb-4">Properties Visited</p>
                      <div className="space-y-3">
                        {guest.properties.map(prop => (
                          <div key={prop} className="flex items-center gap-3 text-[10px] text-warm uppercase tracking-widest font-bold">
                            <MapPin size={14} className="text-gold/50" />
                            {prop}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Conversation History (65%) */}
              <div className="lg:col-span-8">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-gold font-playfair text-2xl mb-6">Conversation History</h3>
                  <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-warm/10">
                    {guestMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((msg, index) => (
                      <div 
                        key={msg.id} 
                        className="relative pl-12 group cursor-pointer"
                        onClick={() => navigate(`/messages/${msg.id}`)}
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-[13px] top-2 w-2 h-2 rounded-full bg-gold/30 border border-gold group-hover:scale-125 transition-transform" />
                        
                        <div className="bg-navy-surface border border-warm/5 hover:border-gold/30 rounded-xl p-5 transition-all group-hover:bg-[#1C2C3C]">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-warm-muted font-bold uppercase tracking-widest">
                                {new Date(msg.timestamp).toLocaleDateString()}
                              </span>
                              <QueryTypeBadge type={msg.query_type} />
                            </div>
                            <ActionBadge action={msg.action} className="scale-75 origin-right" />
                          </div>
                          
                          <p className="text-sm text-warm/80 italic leading-relaxed mb-1">
                            "{msg.message_text}"
                          </p>
                          <p className="text-[9px] text-warm-muted uppercase tracking-widest font-bold flex items-center gap-2">
                            <Building2 size={10} /> {msg.property_id} · {msg.booking_ref}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuestDetailPage;
