import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MessagesPage from './pages/MessagesPage';
import GuestsPage from './pages/GuestsPage';
import GuestDetailPage from './pages/GuestDetailPage';
import PropertiesPage from './pages/PropertiesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <div className="antialiased text-warm selection:bg-gold/30">
        <Routes>
          <Route path="/" element={<Navigate to="/messages" replace />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:id" element={<MessagesPage />} />
          <Route path="/guests" element={<GuestsPage />} />
          <Route path="/guests/:id" element={<GuestDetailPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
