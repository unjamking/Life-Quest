import React from 'react';
import Modal from '../common/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader, AlertTriangle } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  isDeleting?: boolean;
  error: string | null;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirmDelete, isDeleting = false, error }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account">
      <div className="text-center space-y-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold p-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="text-dark-2 dark:text-light-2">
            Are you absolutely sure? This action cannot be undone. All of your quests, skills, and progress will be permanently deleted.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full bg-light-2 dark:bg-dark-3 hover:bg-light-3 dark:hover:bg-opacity-50 text-dark-2 dark:text-light-2 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            disabled={isDeleting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-wait"
          >
            {isDeleting && <Loader className="w-5 h-5 animate-spin" />}
            <span>{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;