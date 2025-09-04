import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// FIX: Import `Variants` type from framer-motion to explicitly type animation variants.
import { motion, AnimatePresence, Variants } from 'framer-motion';
import AuthLayout from '../auth/AuthLayout';
import PasswordInput from '../auth/PasswordInput';
import { loginUser } from '../../services/mockApi';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// FIX: Explicitly type `formVariants` with `Variants` to ensure correct type checking.
const formVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// FIX: Explicitly type `itemVariants` with `Variants`. This resolves the error where TypeScript couldn't assign the string "easeOut" to the `Easing` type.
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.5,
    },
  },
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, theme, toggleTheme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
        const user = await loginUser(username, password, rememberMe);
        if (user) {
            onLoginSuccess();
            // Navigation is now handled declaratively in App.tsx
        } else {
            setError('Invalid username or password.');
        }
    } catch (e) {
        setError('An error occurred. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to continue your adventure."
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <label htmlFor="username" className="block text-sm font-medium text-dark-3 dark:text-light-3">
            Username or Email
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full bg-light-1 dark:bg-dark-1 border border-light-3 dark:border-dark-3 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-purple text-dark-1 dark:text-light-1"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
            <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
                <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-light-3 dark:border-dark-3 rounded bg-light-1 dark:bg-dark-1"
                />
                <label htmlFor="remember-me" className="ml-2 block text-dark-3 dark:text-light-3">
                    Remember me
                </label>
            </div>
            <Link to="/forgot-password" className="font-medium text-brand-purple hover:underline">
                Forgot password?
            </Link>
        </motion.div>

        <AnimatePresence>
          {error && <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-sm text-center font-semibold"
          >{error}</motion.p>}
        </AnimatePresence>

        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:ring-offset-dark-2 focus:ring-brand-purple transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-sm text-dark-3 dark:text-light-3">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-brand-purple hover:underline">
            Sign Up
          </Link>
        </motion.p>
      </motion.form>
    </AuthLayout>
  );
};

export default LoginScreen;