
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ModalType } from '../../types';
import { MastercardIcon, PayPalIcon, VisaIcon } from '../icons';

const PaymentMethodModal: React.FC = () => {
    const { showModal, hideModal } = useAppContext();

    const handleSelectCard = () => {
        hideModal();
        showModal(ModalType.CREDIT_CARD);
    };

    const handleSelectPayPal = () => {
        hideModal();
        showModal(ModalType.PAYPAL);
    };

    return (
        <div className="space-y-4">
            <p className="text-center text-gray-600">How would you like to pay for your Adventure Pass?</p>
            
            <button
              onClick={handleSelectCard}
              className="w-full flex flex-col items-center justify-center p-5 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#0544E3] rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center justify-center space-x-4 h-10 mb-2">
                <VisaIcon className="h-5 transition-transform group-hover:scale-105" />
                <MastercardIcon className="h-8 transition-transform group-hover:scale-105" />
              </div>
              <span className="font-semibold text-base text-gray-700 group-hover:text-[#0544E3]">Pay with Credit Card</span>
            </button>
            
            <button
              onClick={handleSelectPayPal}
              className="w-full flex flex-col items-center justify-center p-5 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#009cde] rounded-xl transition-all duration-200 group"
            >
                <div className="flex items-center justify-center h-10 mb-2">
                    <PayPalIcon className="h-7 transition-transform group-hover:scale-105"/>
                </div>
                <span className="font-semibold text-base text-gray-700 group-hover:text-[#003087]">Pay with PayPal</span>
            </button>
        </div>
    );
};

export default PaymentMethodModal;