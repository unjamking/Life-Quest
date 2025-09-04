import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Guild, GuildChatMessage, User } from '../../types';
import { fetchGuildById, fetchUser, contributeToGuildQuest } from '../../services/mockApi';
import { Shield, MessageSquare, Users, Swords, ChevronLeft, Send, Loader, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { itemFadeInUp, pageTransition } from '../../utils/animations';
import Avatar from '../common/Avatar';
import QuestTimer from '../common/QuestTimer';

const GuildDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'quest'>('quest');
  const [chatInput, setChatInput] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [contributionFeedback, setContributionFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [guildData, userData] = await Promise.all([fetchGuildById(id), fetchUser()]);
        setGuild(guildData || null);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to load guild details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if(!chatInput.trim() || !currentUser) return;

      const newMessage: GuildChatMessage = {
          id: `msg_${Date.now()}`,
          username: currentUser.username,
          avatarUrl: currentUser.avatarUrl,
          text: chatInput,
          timestamp: new Date().toISOString()
      };
      
      setGuild(prev => prev ? ({...prev, chat: [...prev.chat, newMessage]}) : null);
      setChatInput('');
      // In a real app, this would be sent to a server. Here we just update local state.
  };

  const handleContribute = async () => {
    if (!guild) return;
    setIsContributing(true);
    setContributionFeedback(null);
    try {
        const result = await contributeToGuildQuest(guild.id);
        setContributionFeedback({ type: result.success ? 'success' : 'error', message: result.message });
        if (result.success && result.updatedGuild && result.updatedUser) {
            setGuild(result.updatedGuild);
            setCurrentUser(result.updatedUser);
        }
    } catch (error) {
        console.error("Failed to contribute to guild quest:", error);
        setContributionFeedback({ type: 'error', message: "An error occurred while contributing." });
    } finally {
        setIsContributing(false);
        setTimeout(() => setContributionFeedback(null), 5000);
    }
  };

  if (loading) return <div className="text-center p-10">Loading Guild...</div>;
  if (!guild) return <div className="text-center p-10">Guild not found.</div>;
  
  const tabButtonClasses = (tabName: 'chat' | 'members' | 'quest') =>
    `relative flex-1 text-center py-3 px-4 font-semibold transition-colors rounded-t-lg flex items-center justify-center space-x-2 ${
      activeTab !== tabName && 'hover:bg-light-1 dark:hover:bg-dark-3 text-dark-3 dark:text-light-3'
    }`;

  const canContribute = currentUser && (currentUser.questsCompletedToday > (currentUser.questsContributedToGuildToday ?? 0));
  const isQuestCompleted = guild.quest.isCompleted;

  const ContributionAlert = () => (
    <AnimatePresence>
        {contributionFeedback && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-4 text-sm font-semibold p-3 rounded-lg flex items-start space-x-2 ${
                    contributionFeedback.type === 'success'
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : 'bg-red-500/10 text-red-700 dark:text-red-400'
                }`}
            >
                {contributionFeedback.type === 'success' ? <Info className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
                <span>{contributionFeedback.message}</span>
            </motion.div>
        )}
    </AnimatePresence>
  );

  return (
    <motion.div 
        className="space-y-6"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
    >
      <Link to="/guilds" className="flex items-center space-x-2 text-sm font-semibold text-dark-3 dark:text-light-3 hover:text-brand-purple">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to All Guilds</span>
      </Link>

      <div className="bg-light-2 dark:bg-dark-2 p-6 rounded-lg shadow-sm border border-light-3 dark:border-dark-3 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img src={guild.imageUrl} alt={guild.name} className="w-28 h-28 rounded-lg object-cover" />
        <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold dark:text-light-1">{guild.name}</h1>
            <p className="text-dark-3 dark:text-light-3 mt-1">{guild.description}</p>
        </div>
      </div>
      
      <div className="bg-light-2 dark:bg-dark-2 rounded-lg shadow-sm border border-light-3 dark:border-dark-3">
          <div className="flex border-b border-light-3 dark:border-dark-3">
              <button className={tabButtonClasses('chat')} onClick={() => setActiveTab('chat')}>
                  <MessageSquare className="w-4 h-4" />
                  <span className={activeTab === 'chat' ? 'text-brand-purple' : ''}>Chat</span>
                  {activeTab === 'chat' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple" layoutId="guild-underline" />}
              </button>
              <button className={tabButtonClasses('members')} onClick={() => setActiveTab('members')}>
                   <Users className="w-4 h-4" />
                  <span className={activeTab === 'members' ? 'text-brand-purple' : ''}>Members</span>
                  {activeTab === 'members' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple" layoutId="guild-underline" />}
              </button>
               <button className={tabButtonClasses('quest')} onClick={() => setActiveTab('quest')}>
                   <Swords className="w-4 h-4" />
                  <span className={activeTab === 'quest' ? 'text-brand-purple' : ''}>Guild Quest</span>
                  {activeTab === 'quest' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple" layoutId="guild-underline" />}
              </button>
          </div>
          
          <div className="p-4 md:p-6 min-h-[400px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={itemFadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {activeTab === 'chat' && (
                        <div className="flex flex-col h-[50vh]">
                            <div className="flex-1 overflow-y-auto space-y-4 p-2">
                                {guild.chat.map(msg => (
                                    <div key={msg.id} className={`flex items-start gap-2.5 ${msg.username === currentUser?.username ? 'justify-end' : ''}`}>
                                        <Avatar className="w-8 h-8 rounded-full" src={msg.avatarUrl} alt={msg.username} />
                                        <div className="flex flex-col gap-1 max-w-[320px]">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{msg.username}</span>
                                            </div>
                                            <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                                <p className="text-sm font-normal text-gray-900 dark:text-white">{msg.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-4 border-t border-light-3 dark:border-dark-3">
                                <input value={chatInput} onChange={e => setChatInput(e.target.value)} type="text" placeholder="Type a message..." className="w-full bg-light-1 dark:bg-dark-3 border-light-3 dark:border-dark-3 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-purple text-dark-1 dark:text-light-1" />
                                <button type="submit" className="p-2 bg-brand-purple rounded-lg text-white"><Send className="w-5 h-5"/></button>
                            </form>
                        </div>
                    )}
                    {activeTab === 'members' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {guild.members.map(member => (
                                <div key={member.id} className="bg-light-1 dark:bg-dark-3 p-4 rounded-lg text-center">
                                    <Avatar src={member.avatarUrl} alt={member.username} className="w-16 h-16 rounded-full mx-auto mb-2"/>
                                    <p className="font-semibold text-dark-1 dark:text-light-1">{member.username}</p>
                                    <p className="text-sm text-dark-3 dark:text-light-3">Level {member.level}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'quest' && (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Quest Details Pane */}
                            <div className="md:col-span-2 bg-light-1 dark:bg-dark-3 p-6 rounded-lg space-y-4">
                                <h3 className="text-2xl font-bold text-brand-purple">{guild.quest.title}</h3>
                                <QuestTimer expiryTimestamp={guild.quest.expiryTimestamp} className="-mt-2 text-sm" />
                                <p className="text-dark-3 dark:text-light-3">{guild.quest.description}</p>
                                <div>
                                    <ProgressBar value={guild.quest.progress} max={guild.quest.target} color="yellow" height="h-4"/>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xl font-bold text-dark-1 dark:text-light-1">
                                            {guild.quest.progress.toLocaleString()} / <span className="text-base font-medium text-dark-3 dark:text-light-3">{guild.quest.target.toLocaleString()}</span>
                                        </p>
                                        <p className="text-sm font-semibold text-yellow-500">
                                            {Math.min(100, (guild.quest.progress / guild.quest.target) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                                <p className="text-md font-semibold text-dark-2 dark:text-light-2 pt-4 border-t border-light-3 dark:border-dark-3">
                                    Reward: <strong className="text-yellow-500">{guild.quest.xpReward.toLocaleString()} XP</strong> for all members!
                                </p>
                            </div>

                            {/* Contribution Pane */}
                            <div className="md:col-span-1 bg-light-1 dark:bg-dark-3 p-6 rounded-lg flex flex-col justify-between">
                                <div>
                                    {isQuestCompleted ? (
                                        <div className="text-center">
                                            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                                            <h4 className="mt-4 text-xl font-bold text-dark-1 dark:text-light-1">Quest Completed!</h4>
                                            <p className="text-dark-3 dark:text-light-3">Great work, team!</p>
                                        </div>
                                    ) : (
                                        <>
                                            <h4 className="font-bold text-lg text-dark-1 dark:text-light-1 mb-2 text-center">Your Contribution</h4>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleContribute}
                                                disabled={!canContribute || isContributing}
                                                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                {isContributing ? (
                                                    <><Loader className="w-5 h-5 animate-spin" /> <span className="ml-2">Contributing...</span></>
                                                ) : (
                                                    <><Swords className="w-5 h-5" /> <span className="ml-2">Contribute Quest</span></>
                                                )}
                                            </motion.button>
                                            <p className="text-xs text-dark-3 dark:text-light-3 mt-2 text-center">
                                                {currentUser && canContribute 
                                                    ? `You have ${currentUser.questsCompletedToday - (currentUser.questsContributedToGuildToday ?? 0)} completed quest(s) to contribute.`
                                                    : "Complete more daily quests to contribute."}
                                            </p>
                                            <ContributionAlert />
                                        </>
                                    )}
                                </div>
                                <div className="mt-6 pt-4 border-t border-light-3 dark:border-dark-3">
                                    <h4 className="font-bold text-dark-1 dark:text-light-1 mb-2">Contributors ({guild.quest.contributors.length})</h4>
                                    {guild.quest.contributors.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                                            {guild.quest.contributors.map((name, index) => (
                                                <span key={index} className="bg-light-2 dark:bg-dark-1 px-2.5 py-1 rounded-full text-sm font-semibold text-dark-3 dark:text-light-3">
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-dark-3 dark:text-light-3 italic">Be the first to contribute!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
          </div>
      </div>
    </motion.div>
  );
};

export default GuildDetail;