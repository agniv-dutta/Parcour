import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MessagesPage from './pages/MessagesPage';
import MessageDetailPage from './pages/MessageDetailPage';
import GuestPage from './pages/GuestPage';

function App() {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/messages/')) return 'Message Detail';
    if (pathname.startsWith('/messages')) return 'Guest Messages';
    if (pathname.startsWith('/guests')) return 'Guest Profiles';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={getPageTitle(location.pathname)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/messages" replace />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:id" element={<MessageDetailPage />} />
              <Route path="/guests" element={<GuestPage />} />
              {/* Fallback for other routes */}
              <Route path="*" element={<Navigate to="/messages" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
