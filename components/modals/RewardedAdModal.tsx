
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../Button';

const RewardedAdModal: React.FC = () => {
    const { user, updateUser, hideModal, showToast } = useAppContext();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleClaimReward = () => {
        if (!user) return;
        const rewardXP = 50;
        updateUser({ xp: user.xp + rewardXP });
        showToast(`+${rewardXP} XP Awarded!`, 'success');
        hideModal();
    };

    return (
        <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Watching sponsored content...</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                    className="bg-[#0544E3] h-4 rounded-full transition-all duration-1000 linear" 
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                ></div>
            </div>
            <p className="text-gray-600 mb-6">
                Your reward will be available in <span className="font-bold text-xl text-[#0544E3]">{countdown}</span> seconds.
            </p>
            <Button fullWidth onClick={handleClaimReward} disabled={countdown > 0}>
                {countdown > 0 ? 'Waiting...' : 'Claim Reward'}
            </Button>
        </div>
    );
};

export default RewardedAdModal;