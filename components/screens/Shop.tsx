import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, CheckCircle, Zap } from 'lucide-react';
import PaymentModal from '../shop/PaymentModal';
import { pageTransition } from '../../utils/animations';
import Confetti from '../common/Confetti';

const Shop: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const perks = [
    "Ad-Free Experience",
    "Unlimited Quest Refreshes",
    "Exclusive Avatar Badge",
    "Priority AI Coach"
  ];

  const handlePaymentSuccess = () => {
    setIsPremium(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <Confetti />
      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <motion.div
        className="space-y-6 max-w-lg mx-auto relative z-10"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold dark:text-light-1">Adventure Pass</h1>
          <p className="text-lg text-dark-3 dark:text-light-3 mt-2">Unlock your full potential.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-light-2 dark:bg-dark-2 rounded-lg shadow-lg border border-light-3 dark:border-dark-3"
        >
          <div className="p-8 text-center border-b border-light-3 dark:border-dark-3">
              <p className="text-5xl font-bold text-dark-1 dark:text-light-1">$9.99 <span className="text-lg font-normal text-dark-3 dark:text-light-3">/ one-time</span></p>
          </div>
          <div className="p-8">
            <ul className="space-y-4 mb-8">
              {perks.map((perk, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-dark-2 dark:text-light-2">{perk}</span>
                </li>
              ))}
            </ul>
            {isPremium ? (
              <div className="w-full text-center py-4 px-6 rounded-lg text-lg bg-green-500/10 text-green-500 font-bold">
                  You are a Premium Member!
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)} 
                className="w-full bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg flex items-center justify-center space-x-2 animate-pulse-glow">
                <Zap className="w-5 h-5"/>
                <span>Go Premium</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Shop;