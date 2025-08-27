
import React from 'react';
import Button from '../Button';
import { useAppContext } from '../../context/AppContext';

const LegalModal: React.FC = () => {
    const { hideModal } = useAppContext();
    return (
        <div className="space-y-4">
            <h3 className="font-bold">Privacy Policy</h3>
            <p className="text-sm text-gray-600">
                Your privacy is important to us. It is LifeQuest's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
            </p>
            <p className="text-sm text-gray-600">
                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
            </p>
             <h3 className="font-bold mt-4">Terms of Service</h3>
             <p className="text-sm text-gray-600">
                By accessing the app LifeQuest, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
            <Button fullWidth onClick={hideModal} variant="secondary">Close</Button>
        </div>
    );
};

export default LegalModal;