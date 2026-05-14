import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMessages } from '../api/client';
import MessageFeed from '../components/messages/MessageFeed';
import MessageDetail from '../components/messages/MessageDetail';
import Topbar from '../components/layout/Topbar';
import Sidebar from '../components/layout/Sidebar';
import TestWebhookPanel from '../components/messages/TestWebhookPanel';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
    if (data.length > 0 && !selectedId) {
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

  const handleSend = (text) => {
    console.log('Sending reply:', text);
    // In a real app, this would call an API
    alert('Reply sent successfully!');
  };

  const handleEscalate = () => {
    if (window.confirm('Are you sure you want to escalate this to a human manager?')) {
      alert('Message escalated.');
    }
  };

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar messageCount={messages.length} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onToggleTestPanel={() => setIsTestPanelOpen(true)} />
        
        <main className="flex-1 flex overflow-hidden p-8 gap-8">
          {/* Feed Section (40%) */}
          <div className="w-[400px] flex-shrink-0 flex flex-col overflow-hidden">
            <MessageFeed 
              messages={filteredMessages} 
              loading={loading}
              activeId={selectedId}
              onSelect={(msg) => setSelectedId(msg.id)}
              activeFilter={filter}
              onFilterChange={setFilter}
            />
          </div>

          {/* Detail Section (60%) */}
          <div className="flex-1 bg-navy/20 rounded-2xl border border-warm/5 p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <MessageDetail 
                key={selectedId}
                message={activeMessage} 
                onSend={handleSend}
                onEscalate={handleEscalate}
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
