import React from 'react';
import Modal from '../common/Modal';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Legal & Privacy" className="max-w-2xl">
        <div className="space-y-4 text-sm text-dark-3 dark:text-light-3 max-h-[60vh] overflow-y-auto pr-2">
            <h3 className="font-bold text-dark-1 dark:text-light-1">Terms of Service</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque, sapien eget consequat cursus, felis libero gravida nisi, at maximus felis ipsum at lorem. Vivamus tincidunt, purus eget feugiat consectetur, eros nisl viverra est, a consectetur magna enim ac erat. ...</p>
            <p>Donec in quam ut nunc finibus vestibulum. Proin eu elit vel mauris interdum iaculis. Integer nec velit in libero aliquam tempor. Fusce nec libero nec mauris interdum tincidunt. ...</p>
            
            <h3 className="font-bold text-dark-1 dark:text-light-1 pt-4 border-t border-light-3 dark:border-dark-3">Privacy Policy</h3>
            <p>Praesent quis sagittis justo. Sed bibendum, turpis ut egestas tincidunt, odio justo consectetur mi, id facilisis dolor nisi vel nunc. Nam efficitur, ex vitae vulputate pretium, erat est aliquet mi, ac maximus enim mi vitae justo. ...</p>
            <p>Phasellus eget est eu augue aliquam sodales. Ut in nisi non quam interdum sollicitudin. Vivamus quis magna at turpis interdum pulvinar. ...</p>
        </div>
        <div className="mt-6 text-right">
             <button 
                onClick={onClose}
                className="bg-brand-purple hover:bg-brand-purple-light text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Close
            </button>
        </div>
    </Modal>
  );
};

export default LegalModal;