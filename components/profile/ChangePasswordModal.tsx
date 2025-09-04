import React, { useState } from 'react';
import Modal from '../common/Modal';
import { KeyRound, Loader } from 'lucide-react';
import PasswordInput from '../auth/PasswordInput';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
        if(newPassword.length < 8) {
            alert("New password must be at least 8 characters long.");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert("Password changed successfully! (This is a simulation)");
            onClose();
        }, 1500);
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-dark-3 dark:text-light-3">Current Password</label>
                <PasswordInput value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-dark-3 dark:text-light-3">New Password</label>
                <PasswordInput value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-dark-3 dark:text-light-3">Confirm New Password</label>
                <PasswordInput value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
             <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
                {isLoading ? <Loader className="animate-spin w-5 h-5"/> : <KeyRound className="w-5 h-5" />}
                <span>{isLoading ? "Updating..." : "Update Password"}</span>
            </button>
        </form>
    </Modal>
  );
};

export default ChangePasswordModal;