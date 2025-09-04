import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { LeaderboardUser } from '../../types';
import { fetchLeaderboard, fetchUser } from '../../services/mockApi';
import { Trophy } from 'lucide-react';
import { staggerContainer, itemFadeInUp, pageTransition } from '../../utils/animations';
import Avatar from '../common/Avatar';

const LeaderboardRow: React.FC<{ user: LeaderboardUser; isCurrentUser: boolean }> = ({ user, isCurrentUser }) => {
    const rankColor = user.rank === 1 ? 'text-yellow-500' : user.rank === 2 ? 'text-gray-400' : user.rank === 3 ? 'text-yellow-700' : 'text-dark-3 dark:text-light-3';

    return (
        <motion.div
            variants={itemFadeInUp}
            whileHover={{ scale: 1.01, zIndex: 1, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.2 }}
            className={`relative flex items-center p-4 rounded-lg transition-colors ${isCurrentUser ? 'bg-brand-purple/10 dark:bg-brand-purple/20 ring-2 ring-brand-purple' : 'bg-light-2 dark:bg-dark-2 shadow-sm'}`}
        >
            <div className={`w-12 text-center font-bold text-lg ${rankColor}`}>#{user.rank}</div>
            <div className="flex items-center flex-1 mx-4">
                <Avatar src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full mr-4" />
                <div>
                    <p className="font-semibold text-dark-1 dark:text-light-1">{user.username}</p>
                    <p className="text-sm text-dark-3 dark:text-light-3">Level {user.level}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-dark-1 dark:text-light-1">{user.totalXp.toLocaleString()} XP</p>
            </div>
        </motion.div>
    );
};

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [leaderboardData, userData] = await Promise.all([fetchLeaderboard(), fetchUser()]);
                setLeaderboard(leaderboardData);
                setCurrentUser(userData);
            } catch (error) {
                console.error("Failed to load leaderboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <motion.div 
            className="space-y-6"
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold dark:text-light-1">Ranks</h1>
            </div>
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-2"
            >
                {loading ? (
                    Array.from({ length: 10 }).map((_, i) => <div key={i} className="bg-light-2 dark:bg-dark-2 rounded-lg p-4 h-20 animate-pulse"></div>)
                ) : (
                    leaderboard.map(user => (
                        <LeaderboardRow key={user.id} user={user} isCurrentUser={user.id === currentUser?.id} />
                    ))
                )}
            </motion.div>
        </motion.div>
    );
};

export default Leaderboard;