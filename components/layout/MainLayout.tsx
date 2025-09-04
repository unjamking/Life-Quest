import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Dashboard from '../screens/Dashboard';
import Leaderboard from '../screens/Leaderboard';
import Guilds from '../screens/Guilds';
import Shop from '../screens/Shop';
import Profile from '../screens/Profile';
import FloatingCoachButton from '../ai/FloatingCoachButton';
import GuildDetail from '../screens/GuildDetail';
import { pageTransition } from '../../utils/animations';

interface MainLayoutProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AnimatedRoutes: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/guilds" element={<Guilds />} />
        <Route path="/guilds/:id" element={<GuildDetail />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/profile" element={<Profile onLogout={onLogout} />} />
        {/* A catch-all for any other authenticated routes to redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};


const MainLayout: React.FC<MainLayoutProps> = ({ onLogout, theme, toggleTheme }) => {
  return (
    <div className="flex h-screen font-sans">
      <Sidebar onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative">
        <AnimatedRoutes onLogout={onLogout} />
      </main>
      <FloatingCoachButton />
    </div>
  );
};

export default MainLayout;