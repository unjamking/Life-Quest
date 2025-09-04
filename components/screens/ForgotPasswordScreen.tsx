import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../auth/AuthLayout';
import { sendPasswordReset } from '../../services/mockApi';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

interface ForgotPasswordScreenProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setIsSubmitted(true);
    } catch (e) {
      // Even on error, we show success for security
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries! Enter your email to receive a reset link."
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-3 dark:text-light-3">
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-3 dark:text-light-3" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full bg-light-1 dark:bg-dark-1 border border-light-3 dark:border-dark-3 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-brand-purple text-dark-1 dark:text-light-1"
                />
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:ring-offset-dark-2 focus:ring-brand-purple transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
            </div>

            <p className="text-center text-sm">
                <Link to="/login" className="font-medium text-dark-3 dark:text-light-3 hover:text-brand-purple flex items-center justify-center space-x-1">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Log In</span>
                </Link>
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            className="text-center space-y-4"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="text-lg font-medium text-dark-1 dark:text-light-1">Request Sent!</h3>
            <p className="text-sm text-dark-3 dark:text-light-3">
              If an account exists for <strong>{email}</strong>, you will receive an email with instructions on how to reset your password.
            </p>
            <div>
              <Link to="/login" className="font-medium text-brand-purple hover:underline">
                Return to Log In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;