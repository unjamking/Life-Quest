
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../Button';

const CreditCardModal: React.FC = () => {
    const { updateUser, showToast, hideModal } = useAppContext();
    const [cardType, setCardType] = useState<'visa' | 'mastercard' | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchase = () => {
        if (!cardNumber || !expiry || !cvv) {
            showToast('Please fill in all card details.', 'error');
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
        <div>
            {!cardType ? (
                <div className="space-y-3">
                    <h3 className="font-semibold text-center">Select Card Type</h3>
                    <Button fullWidth onClick={() => setCardType('visa')}>Visa</Button>
                    <Button fullWidth onClick={() => setCardType('mastercard')}>Mastercard</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="font-semibold text-center">Enter {cardType === 'visa' ? 'Visa' : 'Mastercard'} Details</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Card Number</label>
                        <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3]" placeholder="•••• •••• •••• ••••" />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3]" placeholder="MM/YY" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">CVV</label>
                            <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3]" placeholder="•••" />
                        </div>
                    </div>
                    <Button fullWidth onClick={handlePurchase} disabled={isPurchasing}>
                        {isPurchasing ? 'Processing...' : 'Pay Now'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CreditCardModal;