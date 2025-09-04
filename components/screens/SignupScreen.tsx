import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../auth/AuthLayout';
import PasswordInput from '../auth/PasswordInput';
import { registerUser } from '../../services/mockApi';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

interface SignupScreenProps {
  onLoginSuccess: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const PasswordRequirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className={`flex items-center text-xs transition-colors ${met ? 'text-green-500' : 'text-dark-3 dark:text-light-3'}`}>
    {met ? (
      <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
    ) : (
      <XCircle className="w-4 h-4 mr-1 flex-shrink-0" />
    )}
    <span>{text}</span>
  </div>
);


const SignupScreen: React.FC<SignupScreenProps> = ({ onLoginSuccess, theme, toggleTheme }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordValidity, setPasswordValidity] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    setPasswordValidity({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      symbol: /[^A-Za-z0-9]/.test(newPassword),
    });
  };

  const isPasswordValid = Object.values(passwordValidity).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const result = await registerUser(username, email, password, avatarFile);
        if (result.success) {
            onLoginSuccess();
            // Navigation is now handled declaratively in App.tsx
        } else {
            alert(result.message);
        }
    } catch (e) {
        alert("An error occurred during signup.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join the Quest!"
      subtitle="Create an account to start your journey."
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            <motion.div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full cursor-pointer bg-light-1 dark:bg-dark-1 border-2 border-dashed border-light-3 dark:border-dark-3 flex items-center justify-center"
              whileHover={{ scale: 1.05, borderColor: '#8B5CF6' }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-dark-3 dark:text-light-3" />
              )}
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-40 flex items-center justify-center transition-opacity">
                <Upload className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-dark-3 dark:text-light-3">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full bg-light-1 dark:bg-dark-1 border border-light-3 dark:border-dark-3 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-purple text-dark-1 dark:text-light-1"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark-3 dark:text-light-3">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full bg-light-1 dark:bg-dark-1 border border-light-3 dark:border-dark-3 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-purple text-dark-1 dark:text-light-1"
          />
        </div>

        <PasswordInput
          value={password}
          onChange={handlePasswordChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
            <PasswordRequirement met={passwordValidity.length} text="At least 8 characters" />
            <PasswordRequirement met={passwordValidity.uppercase} text="One uppercase letter" />
            <PasswordRequirement met={passwordValidity.number} text="One number" />
            <PasswordRequirement met={passwordValidity.symbol} text="One symbol" />
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !isPasswordValid}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:ring-offset-dark-2 focus:ring-brand-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </div>

        <p className="text-center text-sm text-dark-3 dark:text-light-3">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-purple hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupScreen;