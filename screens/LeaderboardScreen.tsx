
import React, { useState, useEffect } from 'react';
import type { LeaderboardUser } from '../types';
import { useAppContext } from '../context/AppContext';
import Logo from '../components/Logo';
import { LogoutIcon } from '../components/icons';

const MOCK_LEADERBOARD: Omit<LeaderboardUser, 'isCurrentUser' | 'rank'>[] = [
    { username: 'AlphaPlayer', level: 15, xp: 1200, avatarUrl: 'https://picsum.photos/seed/user1/100/100' },
    { username: 'QuestMaster', level: 14, xp: 950, avatarUrl: 'https://picsum.photos/seed/user2/100/100' },
    { username: 'DailyGrinder', level: 12, xp: 500, avatarUrl: 'https://picsum.photos/seed/user3/100/100' },
    { username: 'Newbie', level: 2, xp: 100, avatarUrl: 'https://picsum.photos/seed/user5/100/100' },
];

const LeaderboardScreen: React.FC = () => {
    const { user, logout } = useAppContext();
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

    useEffect(() => {
        if (!user) return;

        const currentUserData = {
            username: user.username,
            level: user.level,
            xp: user.xp,
            avatarUrl: user.avatarUrl,
        };

        const allPlayers = [...MOCK_LEADERBOARD, currentUserData];

        // Sort players by level (desc), then XP (desc) to determine rank
        const rankedPlayers = allPlayers
            .sort((a, b) => b.level - a.level || b.xp - a.xp)
            .map((player, index) => ({
                ...player,
                rank: index + 1, // Assign rank based on sorted position
                isCurrentUser: player.username === user.username,
            }));
        
        setLeaderboard(rankedPlayers);
    }, [user]);

    if (!user) return null;

    return (
        <div className="flex flex-col h-full bg-[#f7f8fa]">
             <header className="p-4 flex justify-between items-center bg-white shadow-sm sticky top-0 z-10">
                <Logo className="h-9 w-9 text-[#0544E3]"/>
                <h1 className="text-2xl font-poppins font-bold text-[#1a1a1a] absolute left-1/2 -translate-x-1/2">Ranks</h1>
                <button onClick={logout} className="text-gray-500 hover:text-[#0544E3]">
                    <LogoutIcon />
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                {leaderboard.map(player => (
                    <div 
                        key={player.username}
                        className={`flex items-center p-3 rounded-lg shadow-sm ${
                            player.isCurrentUser ? 'bg-blue-100 text-[#1a1a1a]' : 'bg-white text-[#1a1a1a]'
                        }`}
                    >
                        <span className={`font-bold w-8 text-lg ${player.isCurrentUser ? 'text-blue-800' : 'text-gray-500'}`}>{player.rank}</span>
                        <img src={player.avatarUrl} alt={player.username} className="w-10 h-10 rounded-full mr-3 border-2 border-white"/>
                        <div className="flex-1">
                            <p className="font-semibold">{player.username}</p>
                            <p className={`text-xs ${player.isCurrentUser ? 'text-gray-600' : 'text-gray-500'}`}>Level {player.level}</p>
                        </div>
                        <span className="font-bold">{player.xp} XP</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardScreen;