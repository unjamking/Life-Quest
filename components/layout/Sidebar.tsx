import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Trophy, Shield, Store, UserCircle, LogOut, Sun, Moon } from 'lucide-react';
import Logo from '../common/Logo';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/leaderboard', label: 'Ranks', icon: Trophy },
  { path: '/guilds', label: 'Guilds', icon: Shield },
  { path: '/shop', label: 'Shop', icon: Store },
  { path: '/profile', label: 'Profile', icon: UserCircle },
];

const NavItem: React.FC<{ path: string; label: string; icon: React.ComponentType<{ className?: string }> }> = ({ path, label, icon: Icon }) => {
  return (
    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
        <NavLink
          to={path}
          className={({ isActive }) =>
            `flex items-center space-x-3 rounded-lg px-3 py-2.5 transition-colors duration-200 w-full ${
              isActive
                ? 'bg-brand-purple text-white shadow-lg'
                : 'text-dark-3 dark:text-light-3 hover:bg-light-1 hover:text-dark-1 dark:hover:bg-dark-3 dark:hover:text-light-1'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          <span className="font-bold hidden md:inline">{label}</span>
        </NavLink>
    </motion.div>
  );
};


interface SidebarProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, theme, toggleTheme }) => {
  return (
    <aside className="flex flex-col bg-light-2 dark:bg-dark-2 p-4 space-y-8 border-r border-light-3 dark:border-dark-3">
        <div className="flex items-center justify-center md:justify-start space-x-2 text-dark-1 dark:text-light-1 px-3">
            <Logo className="h-8 w-8"/>
            <h1 className="text-2xl font-extrabold hidden md:inline tracking-tight">LifeQuest</h1>
        </div>
        <nav className="flex-1 space-y-2">
            {navItems.map(item => <NavItem key={item.path} {...item} />)}
        </nav>
        <div className="space-y-2">
            <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 transition-colors duration-200 text-dark-3 dark:text-light-3 hover:bg-light-1 hover:text-dark-1 dark:hover:bg-dark-3 dark:hover:text-light-1"
            >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="font-bold hidden md:inline">
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
            </motion.button>
            <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 transition-colors duration-200 text-dark-3 dark:text-light-3 hover:bg-red-500/10 hover:text-red-600"
            >
                <LogOut className="h-5 w-5" />
                <span className="font-bold hidden md:inline">Logout</span>
            </motion.button>
        </div>
    </aside>
  );
};

export default Sidebar;