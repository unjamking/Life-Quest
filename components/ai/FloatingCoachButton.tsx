import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import AICoachModal from './AICoachModal';

const FloatingCoachButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        drag
        dragMomentum={false}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-purple text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-50 dark:shadow-purple-500/50 cursor-grab active:cursor-grabbing"
        aria-label="Open AI Coach"
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 1 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-8 h-8" />
      </motion.button>
      <AnimatePresence>
        {isModalOpen && <AICoachModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default FloatingCoachButton;