
import React, { useState, useRef } from 'react';
import type { Achievement } from '../types';
import { ModalType } from '../types';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { UploadIcon, LogoutIcon } from '../components/icons';
import Logo from '../components/Logo';

const SettingsTab: React.FC = () => {
    const { user, updateUser, showToast, showModal } = useAppContext();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (!user) return;
        // Check if data actually changed
        if (username === user.username && email === user.email) {
            showToast('No changes to save.', 'info');
            return;
        }
        updateUser({ username, email });
        showToast('Profile updated successfully!', 'success');
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageSrc = URL.createObjectURL(file);
            showModal(ModalType.AVATAR_EDITOR, { imageSrc });
            // Reset file input value to allow selecting the same file again
            e.target.value = '';
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    return (
        <div className="p-4">
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    <img src={user?.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white shadow-lg"/>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <button onClick={triggerFileSelect} className="absolute bottom-1 right-1 bg-[#0544E3] text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-md">
                        <UploadIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-xs mx-auto space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2.5 px-4 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3] placeholder:text-gray-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 shadow-sm appearance-none border rounded-lg w-full py-2.5 px-4 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3] placeholder:text-gray-500"/>
                </div>

                <Button fullWidth onClick={handleSave} className="mt-6">Save Changes</Button>
                
                <div className="pt-6 border-t border-gray-200 space-y-3 mt-6">
                    <Button fullWidth variant="secondary" onClick={() => showModal(ModalType.CHANGE_PASSWORD)}>Change Password</Button>
                    <Button fullWidth variant="secondary" onClick={() => showModal(ModalType.LEGAL)}>Legal & Privacy</Button>
                    <Button fullWidth variant="secondary">Restore Purchases</Button>
                    <Button fullWidth variant="danger" onClick={() => showModal(ModalType.DELETE_ACCOUNT)}>Delete Account</Button>
                </div>
            </div>
        </div>
    )
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
    { id: 'a1', name: 'First Quest', description: 'Complete your first quest.', unlocked: true },
    { id: 'a2', name: 'Level 5 Hero', description: 'Reach level 5.', unlocked: true },
    { id: 'a3', name: 'Fitness Fanatic', description: 'Complete 10 fitness quests.', unlocked: false },
    { id: 'a4', name: 'Social Butterfly', description: 'Complete 10 social quests.', unlocked: true },
    { id: 'a5', name: 'Bookworm', description: 'Complete 10 learning quests.', unlocked: false },
    { id: 'a6', name: 'Premium Member', description: 'Purchase the Adventure Pass.', unlocked: false },
];

const AchievementsTab: React.FC = () => {
    return (
        <div className="p-4 space-y-3">
            {MOCK_ACHIEVEMENTS.map(ach => (
                <div key={ach.id} className={`p-4 rounded-lg shadow-sm bg-white transition-opacity ${!ach.unlocked ? 'opacity-40' : ''}`}>
                    <h3 className="font-bold text-[#1a1a1a]">{ach.name}</h3>
                    <p className="text-sm text-gray-600">{ach.description}</p>
                </div>
            ))}
        </div>
    );
}

const ProfileScreen: React.FC = () => {
    const { logout } = useAppContext();
    const [activeTab, setActiveTab] = useState<'settings' | 'achievements'>('settings');

    const TabButton: React.FC<{ tab: 'settings' | 'achievements', label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-semibold border-b-2 transition-colors ${activeTab === tab ? 'border-[#0544E3] text-[#0544E3]' : 'border-transparent text-gray-500'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-[#f7f8fa]">
            <header className="p-4 flex justify-between items-center bg-white shadow-sm sticky top-0 z-10 flex-shrink-0">
                <Logo className="h-9 w-9 text-[#0544E3]"/>
                <h1 className="text-2xl font-poppins font-bold text-[#1a1a1a] absolute left-1/2 -translate-x-1/2">Profile</h1>
                <button onClick={logout} className="text-gray-500 hover:text-[#0544E3]">
                    <LogoutIcon />
                </button>
            </header>
            <div className="flex bg-white flex-shrink-0">
                <TabButton tab="settings" label="Settings" />
                <TabButton tab="achievements" label="Achievements" />
            </div>
            <div className="flex-1 overflow-y-auto pb-24">
                {activeTab === 'settings' ? <SettingsTab /> : <AchievementsTab />}
            </div>
        </div>
    );
};

export default ProfileScreen;