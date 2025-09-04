import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';
import LoginScreen from './components/screens/LoginScreen';
import SignupScreen from './components/screens/SignupScreen';
import { logoutUser } from './services/mockApi';
import ForgotPasswordScreen from './components/screens/ForgotPasswordScreen';

function App() {
  // Mock authentication state. In a real app, this would be managed by a context or state management library.
  const [isAuthenticated, setIsAuthenticated] = useState(!!(localStorage.getItem('currentUserId') || sessionStorage.getItem('currentUserId')));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    // Check saved theme or system preference
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
  };

  return (
    <HashRouter>
      <AnimatePresence mode="wait">
        <Routes key={isAuthenticated ? 'app' : 'auth'}>
          {isAuthenticated ? (
            <>
              {/* If authenticated, render the main app layout */}
              <Route path="/*" element={<MainLayout onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />} />
              {/* Redirect any attempts to access auth pages to the dashboard */}
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <>
              {/* If not authenticated, show the auth pages */}
              <Route path="/login" element={<LoginScreen onLoginSuccess={handleLogin} theme={theme} toggleTheme={toggleTheme} />} />
              <Route path="/signup" element={<SignupScreen onLoginSuccess={handleLogin} theme={theme} toggleTheme={toggleTheme} />} />
              <Route path="/forgot-password" element={<ForgotPasswordScreen theme={theme} toggleTheme={toggleTheme} />} />
              {/* Redirect any other path to the login screen */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </AnimatePresence>
    </HashRouter>
  );
}

export default App;