
import React, { useState } from 'react';
import type { Guild } from '../types';
import { ModalType } from '../types';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { SearchIcon, PlusIcon, LockClosedIcon, ShieldCheckIcon, LogoutIcon } from '../components/icons';
import ChatScreen from './ChatScreen';
import Logo from '../components/Logo';

const MOCK_GUILDS: Guild[] = [
    { id: 'g1', name: 'Elite Adventurers', description: 'For the most dedicated players aiming for the top.', members: 48, capacity: 50, isPrivate: true, avatarUrl: 'https://picsum.photos/seed/g1/100/100' },
    { id: 'g2', name: 'Casual Questers', description: 'A relaxed guild for completing daily quests together.', members: 89, capacity: 100, isPrivate: false, avatarUrl: 'https://picsum.photos/seed/g2/100/100' },
    { id: 'g3', name: 'Learning League', description: 'Focused on skill-building and personal growth.', members: 34, capacity: 50, isPrivate: false, avatarUrl: 'https://picsum.photos/seed/g3/100/100' },
    { id: 'g4', name: 'Fitness Fanatics', description: 'A guild for those who love fitness challenges.', members: 15, capacity: 25, isPrivate: true, avatarUrl: 'https://picsum.photos/seed/g4/100/100' },
];

const GuildItem: React.FC<{ guild: Guild; onJoin: (guild: Guild) => void }> = ({ guild, onJoin }) => (
    <div className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-3">
        <img src={guild.avatarUrl} alt={guild.name} className="w-12 h-12 rounded-md" />
        <div className="flex-1 min-w-0">
            <div className="flex items-center">
                <h3 className="font-bold text-md text-[#1a1a1a] truncate">{guild.name}</h3>
                {guild.isPrivate ? <LockClosedIcon className="w-4 h-4 ml-2 text-gray-500 flex-shrink-0" /> : <ShieldCheckIcon className="w-4 h-4 ml-2 text-green-500 flex-shrink-0" />}
            </div>
            <p className="text-sm text-gray-600 truncate">{guild.description}</p>
            <p className="text-xs text-gray-500 mt-1">{guild.members} / {guild.capacity} members</p>
        </div>
        <Button onClick={() => onJoin(guild)} variant="secondary" className="!py-1 !px-3 text-sm flex-shrink-0">
            {guild.isPrivate ? 'Apply' : 'Join'}
        </Button>
    </div>
);


const GuildScreen: React.FC = () => {
    const { showModal, logout } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);

    const filteredGuilds = MOCK_GUILDS.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedGuild) {
        return (
             <div className="flex flex-col h-full bg-[#f7f8fa]">
                <header className="p-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
                    <button onClick={() => setSelectedGuild(null)} className="mr-4 text-gray-600 hover:text-[#0544E3] p-2 rounded-full -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-poppins font-bold text-center text-[#1a1a1a] flex-1">{selectedGuild.name} Chat</h1>
                </header>
                <div className="flex-1 overflow-hidden">
                    <ChatScreen />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-[#f7f8fa]">
            <header className="p-4 flex justify-between items-center bg-white shadow-sm sticky top-0 z-10">
                <Logo className="h-9 w-9 text-[#0544E3]"/>
                <h1 className="text-2xl font-poppins font-bold text-[#1a1a1a] absolute left-1/2 -translate-x-1/2">Guilds</h1>
                <button onClick={logout} className="text-gray-500 hover:text-[#0544E3]">
                    <LogoutIcon />
                </button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                <div className="flex space-x-2">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search guilds..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0544E3] placeholder:text-gray-500"
                        />
                    </div>
                    {/* FIX: Use ModalType enum for type safety. */}
                    <Button onClick={() => showModal(ModalType.CREATE_GUILD)} className="!px-3">
                        <PlusIcon className="w-5 h-5"/>
                    </Button>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">Suggested For You</h2>
                    <div className="space-y-3">
                        {filteredGuilds.length > 0 ? (
                            filteredGuilds.map(guild => <GuildItem key={guild.id} guild={guild} onJoin={setSelectedGuild} />)
                        ) : (
                            <p className="text-center text-gray-500 py-8">No guilds found.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GuildScreen;