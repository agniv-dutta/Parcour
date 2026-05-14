import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import Toast from './components/shared/Toast';
import MessagesPage from './pages/MessagesPage';
import GuestsPage from './pages/GuestsPage';
import GuestDetailPage from './pages/GuestDetailPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import AccountPage from './pages/AccountPage';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="antialiased text-warm selection:bg-gold/30">
          <Routes>
            <Route path="/" element={<Navigate to="/messages" replace />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:id" element={<MessagesPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/guests/:id" element={<GuestDetailPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<Navigate to="/messages" replace />} />
          </Routes>
          <Toast />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
