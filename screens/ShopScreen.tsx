
import React from 'react';
import { CheckCircleIcon, LogoutIcon } from '../components/icons';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';
import Logo from '../components/Logo';
import { ModalType } from '../types';

const ShopScreen: React.FC = () => {
  const { user, showModal, logout } = useAppContext();

  const handlePurchase = () => {
    showModal(ModalType.PAYMENT_METHOD);
  }

  return (
    <div className="flex flex-col h-full bg-[#f7f8fa]">
      <header className="p-4 flex justify-between items-center bg-white shadow-sm sticky top-0 z-10 flex-shrink-0">
          <Logo className="h-9 w-9 text-[#0544E3]"/>
          <h1 className="text-2xl font-poppins font-bold text-[#1a1a1a] absolute left-1/2 -translate-x-1/2">Shop</h1>
          <button onClick={logout} className="text-gray-500 hover:text-[#0544E3]">
              <LogoutIcon />
          </button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-poppins font-bold text-[#1a1a1a]">Adventure Pass</h1>
          <p className="text-gray-600">Unlock your full potential.</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          {user?.isPremium ? (
              <div className="flex flex-col items-center justify-center h-64">
                  <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-semibold text-green-600">You are a Premium Member!</h2>
                  <p className="text-gray-600 mt-2">Enjoy your ad-free experience and exclusive perks.</p>
              </div>
          ) : (
              <>
                  <div className="mb-6">
                      <span className="text-4xl font-bold text-[#0544E3]">$9.99</span>
                      <span className="text-gray-500"> / one-time</span>
                  </div>
                  
                  <ul className="text-left space-y-3 mb-8">
                      <li className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700"><span className="font-semibold text-[#1a1a1a]">Ad-Free Experience</span> - Focus on your quests without interruptions.</span>
                      </li>
                      <li className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700"><span className="font-semibold text-[#1a1a1a]">Unlimited Quest Refreshes</span> - Get new quests whenever you want.</span>
                      </li>
                      <li className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700"><span className="font-semibold text-[#1a1a1a]">Exclusive Avatar Badge</span> - Show off your premium status.</span>
                      </li>
                      <li className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700"><span className="font-semibold text-[#1a1a1a]">Priority AI Coach</span> - Get faster responses from your AI mentor.</span>
                      </li>
                  </ul>

                  <Button fullWidth onClick={handlePurchase}>
                      Go Premium
                  </Button>
              </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;