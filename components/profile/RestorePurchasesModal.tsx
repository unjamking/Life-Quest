import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Loader, CheckCircle } from 'lucide-react';

interface RestorePurchasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RestorePurchasesModal: React.FC<RestorePurchasesModalProps> = ({ isOpen, onClose }) => {
    const [isRestoring, setIsRestoring] = useState(true);

    useEffect(() => {
        if(isOpen) {
            setIsRestoring(true);
            const timer = setTimeout(() => {
                setIsRestoring(false);
            }, 2000); // Simulate network request
            return () => clearTimeout(timer);
        }
    }, [isOpen]);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restore Purchases">
        <div className="text-center p-4">
            {isRestoring ? (
                <div className="space-y-3">
                    <Loader className="w-12 h-12 mx-auto animate-spin text-brand-purple" />
                    <p className="font-semibold text-dark-2 dark:text-light-2">Checking your account for purchases...</p>
                </div>
            ) : (
                 <div className="space-y-3">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                    <p className="font-semibold text-dark-1 dark:text-light-1">Purchases Restored!</p>
                    <p className="text-sm text-dark-3 dark:text-light-3">Your Premium status has been successfully synced.</p>
                     <button 
                        onClick={onClose}
                        className="mt-4 bg-brand-purple hover:bg-brand-purple-light text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                        Awesome!
                    </button>
                </div>
            )}
        </div>
    </Modal>
  );
};

export default RestorePurchasesModal;