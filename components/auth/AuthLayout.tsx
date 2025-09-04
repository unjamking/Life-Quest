import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import Logo from '../common/Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children, theme, toggleTheme }) => {
  return (
    <div className="min-h-screen text-dark-1 dark:text-light-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative">
       <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="absolute top-6 right-6 p-2 rounded-full bg-light-2 dark:bg-dark-2 text-dark-3 dark:text-light-3"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-2xl font-bold text-dark-1 dark:text-light-1">
            LifeQuest
          </h1>
          <h2 className="mt-2 text-3xl font-bold text-dark-1 dark:text-light-1">
            {title}
          </h2>
          <p className="mt-2 text-md text-dark-3 dark:text-light-2">
            {subtitle}
          </p>
        </div>

        <div className="bg-light-2 dark:bg-dark-2 rounded-xl shadow-md border border-light-3 dark:border-dark-3 p-6 sm:p-8">
          {children}
        </div>
      </motion.div>
       <footer className="absolute bottom-4 text-center text-dark-3 dark:text-light-2 text-sm">
          &copy; {new Date().getFullYear()} LifeQuest. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;