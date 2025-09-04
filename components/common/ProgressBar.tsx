import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'purple' | 'green' | 'yellow' | 'red';
  height?: string;
}

const colorClasses = {
  purple: 'bg-brand-purple',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, color = 'purple', height = 'h-2' }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className={`w-full bg-light-2 dark:bg-dark-3 rounded-full ${height} overflow-hidden`}>
      <motion.div
        className={`${colorClasses[color]} ${height} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      ></motion.div>
    </div>
  );
};

export default ProgressBar;