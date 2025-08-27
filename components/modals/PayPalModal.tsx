
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../Button';

const PayPalModal: React.FC = () => {
    const { updateUser, showToast, hideModal } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchase = () => {
        if (!email || !password) {
            showToast('Please enter your PayPal details.', 'error');
            return;
        }
        setIsPurchasing(true);
        setTimeout(() => {
            updateUser({ isPremium: true });
            showToast('Adventure Pass Activated!', 'success');
            setIsPurchasing(false);
            hideModal();
        }, 2000);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-center">Log in to PayPal</h3>
             <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3]"
                    placeholder="you@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3]"
                    placeholder="••••••••"
                />
            </div>
            <Button fullWidth onClick={handlePurchase} disabled={isPurchasing}>
                {isPurchasing ? 'Processing...' : 'Log In & Pay'}
            </Button>
        </div>
    );
};

export default PayPalModal;
