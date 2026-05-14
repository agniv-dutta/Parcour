import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMessages } from '../api/client';
import MessageFeed from '../components/messages/MessageFeed';
import MessageDetail from '../components/messages/MessageDetail';
import Topbar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar';
import TestWebhookPanel from '../components/messages/TestWebhookPanel';
import { ArrowLeft } from 'lucide-react';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
    if (data.length > 0 && !selectedId && window.innerWidth >= 1024) {
      setSelectedId(data[0].id);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'auto_sent') return msg.action === 'auto_send';
    if (filter === 'needs_review') return msg.action === 'agent_review';
    if (filter === 'escalated') return msg.action === 'escalate';
    if (filter === 'complaints') return msg.query_type === 'complaint';
    return true;
  });

  const activeMessage = messages.find(m => m.id === selectedId);

  const handleSelectMessage = (msg) => {
    setSelectedId(msg.id);
    if (window.innerWidth < 1024) {
      setIsMobileDetailOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-navy overflow-hidden relative">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar messageCount={messages.length} />
      </div>

      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 z-[70] lg:hidden"
            >
              <Sidebar messageCount={messages.length} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar 
          onToggleTestPanel={() => setIsTestPanelOpen(true)} 
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
        
        <main className="flex-1 flex overflow-hidden p-4 lg:p-8 gap-8 relative">
          {/* Feed Section (40% desktop, 100% mobile) */}
          <div className={`
            ${isMobileDetailOpen ? 'hidden' : 'flex'} 
            lg:flex w-full lg:w-[400px] flex-shrink-0 flex-col overflow-hidden
          `}>
            <MessageFeed 
              messages={filteredMessages} 
              loading={loading}
              activeId={selectedId}
              onSelect={handleSelectMessage}
              activeFilter={filter}
              onFilterChange={setFilter}
            />
          </div>

          {/* Detail Section (60% desktop, 100% mobile overlay) */}
          <div className={`
            ${isMobileDetailOpen ? 'flex' : 'hidden'} 
            lg:flex flex-1 bg-navy/20 rounded-2xl border border-warm/5 p-4 lg:p-8 overflow-hidden flex-col
          `}>
            {isMobileDetailOpen && (
              <button 
                onClick={() => setIsMobileDetailOpen(false)}
                className="lg:hidden flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest mb-6"
              >
                <ArrowLeft size={14} /> Back to Feed
              </button>
            )}
            <AnimatePresence mode="wait">
              <MessageDetail 
                key={selectedId}
                message={activeMessage} 
                onSend={() => {}}
                onEscalate={() => {}}
              />
            </AnimatePresence>
          </div>
        </main>
      </div>

      <TestWebhookPanel 
        isOpen={isTestPanelOpen} 
        onClose={() => setIsTestPanelOpen(false)}
        onRefresh={fetchMessages}
      />
    </div>
  );
};

export default MessagesPage;
