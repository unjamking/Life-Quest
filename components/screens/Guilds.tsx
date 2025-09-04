import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Search, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Guild } from '../../types';
import { fetchGuilds, joinGuild } from '../../services/mockApi';
import CreateGuildModal from '../guilds/CreateGuildModal';
import JoinGuildModal from '../guilds/JoinGuildModal';
import { staggerContainer, itemFadeInUp, pageTransition } from '../../utils/animations';

const GuildCard: React.FC<{ guild: Guild, onAction: (guild: Guild) => void, onJoin: (guildId: string) => void }> = ({ guild, onAction, onJoin }) => {
    
    const handleJoinClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        if(guild.isPrivate) {
            onAction(guild);
        } else {
            onJoin(guild.id);
        }
    }
    
    return (
        <motion.div variants={itemFadeInUp} whileHover={{ y: -4 }}>
            <Link to={`/guilds/${guild.id}`} className="block bg-light-2 dark:bg-dark-2 p-4 rounded-lg shadow-sm border border-light-3 dark:border-dark-3 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 hover:ring-2 hover:ring-brand-purple transition-all">
                <img src={guild.imageUrl} alt={guild.name} className="w-24 h-24 sm:w-20 sm:h-20 rounded-lg object-cover" />
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <h3 className="font-bold text-dark-1 dark:text-light-1">{guild.name}</h3>
                        {guild.isPrivate && <Lock className="w-4 h-4 text-dark-3 dark:text-light-3" />}
                    </div>
                    <p className="text-sm text-dark-3 dark:text-light-3 mt-1">{guild.description}</p>
                    <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs text-dark-3 dark:text-light-3 mt-2">
                      <Users className="w-3 h-3"/>
                      <span>{guild.memberCount} / {guild.maxMembers} members</span>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleJoinClick}
                    className={`w-full sm:w-auto font-semibold py-2 px-4 rounded-lg text-sm transition-colors ${guild.isPrivate ? 'bg-light-1 dark:bg-dark-3 text-dark-2 dark:text-light-2 hover:bg-light-3 dark:hover:bg-opacity-50' : 'bg-brand-purple text-white hover:bg-brand-purple-light'}`}
                >
                    {guild.isPrivate ? 'Apply' : 'Join'}
                </motion.button>
            </Link>
        </motion.div>
    )
}

const Guilds: React.FC = () => {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedGuildForApply, setSelectedGuildForApply] = useState<Guild | null>(null);

    const loadGuilds = async () => {
        setLoading(true);
        try {
            const guildsData = await fetchGuilds();
            setGuilds(guildsData);
        } catch (error) {
            console.error("Failed to load guilds", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadGuilds();
    }, []);

    const handleJoinGuild = async (guildId: string) => {
        try {
            const result = await joinGuild(guildId);
            if(result.success) {
// FIX: With the improved type from joinGuild, we can safely access result.guild.
                alert(`Successfully joined ${result.guild.name}!`);
// FIX: The non-null assertion `!` is no longer needed due to correct type narrowing.
                setGuilds(prevGuilds => prevGuilds.map(g => g.id === guildId ? result.guild : g));
            } else {
                 alert("Could not join guild. It might be full.");
            }
        } catch (error) {
             alert("An error occurred while trying to join the guild.");
        }
    };

    const filteredGuilds = useMemo(() => {
        return guilds.filter(guild =>
            guild.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [guilds, searchTerm]);

    return (
        <motion.div
            className="space-y-6"
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <CreateGuildModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onGuildCreated={(newGuild) => setGuilds(prev => [newGuild, ...prev])}
            />
            <JoinGuildModal
                guild={selectedGuildForApply}
                isOpen={!!selectedGuildForApply}
                onClose={() => setSelectedGuildForApply(null)}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-brand-purple" />
                    <h1 className="text-3xl font-bold dark:text-light-1">Guilds</h1>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreateModalOpen(true)} 
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-purple-light text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                    <span>Create Guild</span>
                </motion.button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-3 dark:text-light-3" />
                <input
                    type="text"
                    placeholder="Search guilds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-light-2 dark:bg-dark-2 border border-light-3 dark:border-dark-3 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-purple focus:outline-none"
                />
            </div>
            
            <div>
                <h2 className="text-xl font-bold mb-4 dark:text-light-1">Suggested For You</h2>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    <AnimatePresence>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-light-2 dark:bg-dark-2 rounded-lg p-4 h-28 animate-pulse"></div>)
                    ) : filteredGuilds.length > 0 ? (
                        filteredGuilds.map(guild => <GuildCard key={guild.id} guild={guild} onAction={setSelectedGuildForApply} onJoin={handleJoinGuild} />)
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-10 bg-light-2 dark:bg-dark-2 rounded-lg"
                        >
                            <p className="text-dark-3 dark:text-light-3">No guilds found matching "{searchTerm}".</p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Guilds;