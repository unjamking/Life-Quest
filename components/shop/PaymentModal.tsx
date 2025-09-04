import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import { CreditCard, Lock, Send, Loader } from 'lucide-react';
import { processPayment } from '../../services/mockApi';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PayPalIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current"><title>PayPal</title><path d="M7.754 6.315c.348-2.29 2.457-3.818 4.71-3.818h2.37c2.886 0 4.629 1.636 4.143 4.886-.412 2.727-2.312 4.1-4.957 4.1-1.337 0-2.072-.518-2.484-1.238-.06.33-.21.938-.27 1.238-.283 1.258-1.2 1.818-2.368 1.818H6.18L4.035 2.186h3.29c.21 0 .389.17.389.389l.04 2.523s.18 1.218.18 1.218zm9.332 2.41c.21-1.396-.85-2.313-2.14-2.313h-1.42c-.48 0-.85.39-.97.88l-.51 3.168c-.12.718.39 1.137 1.09 1.137h.6c1.28 0 2.22-1.04 2.35-2.37v-.002z"/></svg>
);


const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call
        setTimeout(async () => {
            try {
                await processPayment();
                alert("Payment successful! A receipt has been sent to your email.");
                onPaymentSuccess();
            } catch (error) {
                alert("Payment failed. Please try again.");
            } finally {
                setIsProcessing(false);
            }
        }, 2000);
    };
    
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Premium">
        <div className="space-y-6">
            <div className="flex bg-light-1 dark:bg-dark-3 rounded-lg p-1">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPaymentMethod('card')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors flex items-center justify-center space-x-2 ${paymentMethod === 'card' ? 'bg-light-2 dark:bg-dark-2 shadow' : ''}`}>
                    <CreditCard className="w-4 h-4"/> <span>Credit Card</span>
                </motion.button>
                 <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors flex items-center justify-center space-x-2 ${paymentMethod === 'paypal' ? 'bg-light-2 dark:bg-dark-2 shadow' : ''}`}>
                    <PayPalIcon /> <span>PayPal</span>
                </motion.button>
            </div>
            
            {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="card-number" className="block text-sm font-medium text-dark-3 dark:text-light-3">Card Number</label>
                        <input type="text" id="card-number" placeholder="•••• •••• •••• ••••" className="mt-1 block w-full bg-light-1 dark:bg-dark-3 border-light-3 dark:border-dark-3 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple text-dark-1 dark:text-light-1" required/>
                    </div>
                     <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="expiry" className="block text-sm font-medium text-dark-3 dark:text-light-3">Expiry Date</label>
                            <input type="text" id="expiry" placeholder="MM / YY" className="mt-1 block w-full bg-light-1 dark:bg-dark-3 border-light-3 dark:border-dark-3 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple text-dark-1 dark:text-light-1" required />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="cvc" className="block text-sm font-medium text-dark-3 dark:text-light-3">CVC</label>
                            <input type="text" id="cvc" placeholder="•••" className="mt-1 block w-full bg-light-1 dark:bg-dark-3 border-light-3 dark:border-dark-3 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple text-dark-1 dark:text-light-1" required />
                        </div>
                    </div>
                     <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isProcessing ? <Loader className="w-5 h-5 animate-spin"/> : <Lock className="w-5 h-5" />}
                        <span>Pay $9.99 Securely</span>
                    </motion.button>
                </form>
            )}

            {paymentMethod === 'paypal' && (
                <div className="text-center">
                    <p className="text-dark-3 dark:text-light-3 mb-4">You will be redirected to PayPal to complete your purchase securely.</p>
                    <motion.button 
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={(e) => handleSubmit(e)}
                         disabled={isProcessing}
                         className="w-full flex items-center justify-center space-x-2 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait">
                        {isProcessing ? <Loader className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5" />}
                        <span>Proceed with PayPal</span>
                    </motion.button>
                </div>
            )}
        </div>
    </Modal>
  );
};

export default PaymentModal;