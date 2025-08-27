
import React from 'react';
import Button from '../Button';
import { useAppContext } from '../../context/AppContext';

const DeleteAccountModal: React.FC = () => {
    const { logout } = useAppContext();
    return (
        <div className="space-y-4 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
            <p className="text-sm text-gray-500">
                Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4 pt-4">
                 <Button onClick={logout} variant="danger">Yes, Delete It</Button>
            </div>
        </div>
    );
};

export default DeleteAccountModal;