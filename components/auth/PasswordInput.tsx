import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-dark-3 dark:text-light-3">
        Password
      </label>
      <div className="mt-1 relative">
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={value}
          onChange={onChange}
          className="block w-full bg-light-1 dark:bg-dark-1 border border-light-3 dark:border-dark-3 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-purple text-dark-1 dark:text-light-1"
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.8 }}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-dark-3 dark:text-light-3 hover:text-dark-1 dark:hover:text-light-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default PasswordInput;