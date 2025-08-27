
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../Button';

const ChangePasswordModal: React.FC = () => {
    const { hideModal, showToast, changePassword } = useAppContext();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast('Please fill all fields.', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match.', 'error');
            return;
        }
        if (newPassword.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }

        setIsLoading(true);
        const success = await changePassword(currentPassword, newPassword);
        if (success) {
            hideModal();
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3]"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3]"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3]"
                />
            </div>
            <Button fullWidth onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Password'}
            </Button>
        </div>
    );
};

export default ChangePasswordModal;
