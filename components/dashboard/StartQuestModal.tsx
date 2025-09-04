import React from 'react';
import Modal from '../common/Modal';
import { Quest } from '../../types';
import { Timer } from 'lucide-react';

interface StartQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quest: Quest | null;
}

const StartQuestModal: React.FC<StartQuestModalProps> = ({ isOpen, onClose, onConfirm, quest }) => {
  if (!quest) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start Quest">
      <div className="text-center space-y-6">
        <Timer className="w-16 h-16 mx-auto text-brand-purple" />
        <p className="text-lg text-dark-2 dark:text-light-2">
          Are you sure you want to start the quest: <strong className="font-bold text-dark-1 dark:text-light-1">{quest.title}</strong>?
        </p>
        <p className="text-sm text-dark-3 dark:text-light-3">
          The timer for <strong className="text-dark-2 dark:text-light-2">{quest.durationMinutes} minutes</strong> will begin immediately.
        </p>
        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={onClose}
            className="w-full bg-light-1 dark:bg-dark-3 hover:bg-light-3 dark:hover:bg-opacity-50 text-dark-2 dark:text-light-2 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Start Quest
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StartQuestModal;
