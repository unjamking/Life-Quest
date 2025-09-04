import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalContentVariants, modalOverlayVariants } from '../../utils/animations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = 'max-w-md' }) => {

  return (
    <AnimatePresence>
        {isOpen && (
        <motion.div 
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
          <motion.div 
            variants={modalContentVariants}
            className={`bg-light-2 dark:bg-dark-2 rounded-xl shadow-2xl w-full p-6 border border-light-3 dark:border-dark-3 ${className}`}
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="modal-title" className="text-xl font-bold text-dark-1 dark:text-light-1">{title}</h2>
              <button onClick={onClose} className="text-dark-3 dark:text-light-3 hover:text-dark-1 dark:hover:text-light-1 p-1 rounded-full hover:bg-light-1 dark:hover:bg-dark-3">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div>
                {children}
            </div>
          </motion.div>
        </motion.div>
        )}
    </AnimatePresence>
  );
};

export default Modal;
