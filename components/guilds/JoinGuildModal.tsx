import React from 'react';
import Modal from '../common/Modal';
import type { Guild } from '../../types';

interface JoinGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  guild: Guild | null;
}

const JoinGuildModal: React.FC<JoinGuildModalProps> = ({ isOpen, onClose, guild }) => {
    if (!guild) return null;

    const actionText = guild.isPrivate ? "apply to" : "join";
    const buttonText = guild.isPrivate ? "Send Application" : "Confirm Join";

    const handleConfirm = () => {
        alert(`Request sent to ${actionText} "${guild.name}"!`);
        onClose();
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Confirm ${guild.isPrivate ? 'Application' : 'Join'}`}>
        <div className="text-center space-y-6">
           <p className="text-dark-2 dark:text-light-2">Are you sure you want to {actionText} the guild <strong className="text-brand-purple">{guild.name}</strong>?</p>
            <div className="flex justify-center space-x-4">
                 <button 
                    onClick={onClose}
                    className="w-full bg-light-2 dark:bg-dark-3 hover:bg-light-3 dark:hover:bg-opacity-50 text-dark-2 dark:text-light-2 font-semibold py-2 px-4 rounded-lg transition-colors">
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    className="w-full bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    {buttonText}
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default JoinGuildModal;