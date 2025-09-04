import React from 'react';
import Modal from '../common/Modal';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  xp: number;
}

const StreakBonusModal: React.FC<StreakBonusModalProps> = ({ isOpen, onClose, streak, xp }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center space-y-4 p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <Flame className="w-24 h-24 mx-auto text-orange-500" fill="currentColor" />
        </motion.div>
        <h2 className="text-2xl font-bold text-dark-1 dark:text-light-1">Streak Extended!</h2>
        <p className="text-lg text-dark-2 dark:text-light-2">
          You're on a <strong className="text-orange-500">{streak}-day</strong> streak!
        </p>
        <div className="bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 font-bold py-3 px-6 rounded-lg inline-block">
          Bonus: +{xp} XP
        </div>
        <p className="text-sm text-dark-3 dark:text-light-3">Keep the fire going! Log in tomorrow to extend your streak.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
        >
          Awesome!
        </motion.button>
      </div>
    </Modal>
  );
};

export default StreakBonusModal;