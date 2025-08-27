import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../Button';
import { LockClosedIcon, ShieldCheckIcon } from '../icons';

const CreateGuildModal: React.FC = () => {
    const { hideModal, showToast } = useAppContext();
    const [guildName, setGuildName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleCreate = () => {
        if (!guildName.trim() || !description.trim()) {
            showToast('Please fill out all fields.', 'error');
            return;
        }
        // Mock creation logic
        console.log('Creating guild:', { guildName, description, isPrivate });
        showToast(`Guild "${guildName}" created successfully!`, 'success');
        hideModal();
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="guildName" className="block text-sm font-medium text-gray-700">Guild Name</label>
                <input
                    id="guildName"
                    type="text"
                    value={guildName}
                    onChange={(e) => setGuildName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0544E3] focus:border-[#0544E3] placeholder:text-gray-500"
                    placeholder=""
                />
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full h-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0544E3] focus:border-[#0544E3] placeholder:text-gray-500"
                    placeholder="A short, catchy description for your guild."
                />
            </div>
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Guild Type</h4>
                <div className="flex space-x-2">
                     <button onClick={() => setIsPrivate(false)} className={`flex-1 p-3 border-2 rounded-lg flex flex-col items-center ${!isPrivate ? 'border-[#0544E3] bg-blue-50' : 'border-gray-300'}`}>
                         <ShieldCheckIcon className="w-6 h-6 text-green-500 mb-1" />
                         <span className="font-semibold">Public</span>
                         <span className="text-xs text-gray-500">Anyone can join</span>
                    </button>
                    <button onClick={() => setIsPrivate(true)} className={`flex-1 p-3 border-2 rounded-lg flex flex-col items-center ${isPrivate ? 'border-[#0544E3] bg-blue-50' : 'border-gray-300'}`}>
                        <LockClosedIcon className="w-6 h-6 text-gray-600 mb-1" />
                        <span className="font-semibold">Private</span>
                        <span className="text-xs text-gray-500">Members must apply</span>
                    </button>
                </div>
            </div>
            <Button fullWidth onClick={handleCreate}>Create Guild</Button>
        </div>
    );
};

export default CreateGuildModal;