import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, Skill, Quest } from '../../types';
import { fetchUser, fetchSkills, fetchQuests, completeQuest, refreshQuests, watchAdForXp, checkAndApplyStreakBonus, startQuest } from '../../services/mockApi';
import ProgressBar from '../common/ProgressBar';
import { Plus, Gift, Zap, RefreshCw, Star, Flame } from 'lucide-react';
import QuestGenerationModal from './dashboard/QuestGenerationModal';
import QuestCompletionModal from '../dashboard/QuestCompletionModal';
import StreakBonusModal from '../dashboard/StreakBonusModal';
import { staggerContainer, itemFadeInUp, pageTransition } from '../../utils/animations';
import Avatar from '../common/Avatar';
import QuestTimer from '../common/QuestTimer';
import StartQuestModal from '../dashboard/StartQuestModal';

const ProfileHeader: React.FC<{ user: User | null; onXpGain: (updatedUser: User) => void }> = ({ user, onXpGain }) => {
    const [isAdPlaying, setIsAdPlaying] = useState(false);

    const handleWatchAd = async () => {
        setIsAdPlaying(true);
        // Simulate ad watch time
        setTimeout(async () => {
            try {
                const { xpGained, updatedUser } = await watchAdForXp();
                alert(`You earned ${xpGained} XP!`);
                onXpGain(updatedUser);
            } catch (error) {
                alert("Could not get reward. Please try again.");
            } finally {
                setIsAdPlaying(false);
            }
        }, 2000); // 2-second mock ad
    };

    if (!user) return <div className="bg-light-2 dark:bg-dark-2 rounded-lg p-6 animate-pulse min-h-[120px] shadow"></div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-light-2 dark:bg-dark-2 rounded-lg p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            >
                <Avatar
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-20 h-20 rounded-full border-4 border-brand-purple"
                 />
            </motion.div>
            <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                    <h2 className="text-2xl font-bold text-dark-1 dark:text-light-1">{user.username}</h2>
                     {user.currentStreak > 1 && (
                        <motion.div 
                            className="flex items-center space-x-1.5 text-orange-500 font-bold bg-orange-500/10 px-2.5 py-1 rounded-full" 
                            title={`Daily Streak: ${user.currentStreak} days`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Flame className="w-5 h-5" />
                            <span>{user.currentStreak}</span>
                        </motion.div>
                    )}
                </div>

                <p className="text-sm font-semibold text-brand-purple">{user.rankTitle}</p>
                <p className="text-sm font-semibold text-dark-3 dark:text-light-3">Level {user.level}</p>
                <div className="mt-2">
                    <ProgressBar value={user.xp} max={user.xpForNextLevel} />
                    <p className="text-xs text-dark-3 dark:text-light-3 mt-1 text-right font-medium">{user.xp.toLocaleString()} / {user.xpForNextLevel.toLocaleString()} XP</p>
                </div>
            </div>
            {!user.isPremium && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWatchAd}
                    disabled={isAdPlaying}
                    className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait">
                    <Gift className="w-5 h-5" />
                    <span>{isAdPlaying ? 'Watching...' : 'Watch Ad for XP'}</span>
                </motion.button>
            )}
        </motion.div>
    );
};

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
    const { icon: Icon } = skill;
    return (
        <motion.div
            variants={itemFadeInUp}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-light-2 dark:bg-dark-2 rounded-lg p-4 flex-shrink-0 w-48 text-center space-y-2 border border-light-3 dark:border-dark-3"
        >
            <Icon className="w-8 h-8 text-brand-purple mx-auto" />
            <h3 className="font-semibold text-dark-1 dark:text-light-1">{skill.name}</h3>
            <p className="text-sm text-dark-3 dark:text-light-3">Level {skill.level}</p>
            <ProgressBar value={skill.xp} max={skill.xpForNextLevel} color="green" />
        </motion.div>
    );
};

const QuestCard: React.FC<{ quest: Quest; onStart: (quest: Quest) => void; onComplete: (quest: Quest) => void; disabled: boolean }> = ({ quest, onStart, onComplete, disabled }) => {
    const isStarted = !!quest.startTimestamp;
    const isExpired = quest.expiryTimestamp && Date.now() > quest.expiryTimestamp;

    let buttonContent: React.ReactNode;
    let buttonAction = () => {};
    let isButtonDisabled = false;
    let buttonClass = 'bg-brand-purple hover:bg-brand-purple-light text-white disabled:opacity-50';

    if (isExpired) {
        buttonContent = 'Expired';
        isButtonDisabled = true;
        buttonClass = 'bg-red-500/20 text-red-500';
    } else if (isStarted) {
        buttonContent = 'Complete';
        buttonAction = () => onComplete(quest);
        isButtonDisabled = disabled;
    } else {
        buttonContent = 'Start';
        buttonAction = () => onStart(quest);
    }
    
    return (
        <motion.div
            variants={itemFadeInUp}
            layout
            whileHover={{ y: -4 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-light-2 dark:bg-dark-2 rounded-lg p-4 flex items-center justify-between transition-shadow hover:shadow-lg border border-light-3 dark:border-dark-3"
        >
            <div className="flex-1 mr-4">
                <h4 className="font-bold text-dark-1 dark:text-light-1">{quest.title}</h4>
                <p className="text-sm text-dark-3 dark:text-light-3">{quest.description}</p>
                {isStarted && <QuestTimer expiryTimestamp={quest.expiryTimestamp} />}
            </div>
            <motion.button
                whileHover={{ scale: isButtonDisabled ? 1 : 1.1 }}
                whileTap={{ scale: isButtonDisabled ? 1 : 0.9 }}
                onClick={buttonAction}
                disabled={isButtonDisabled}
                className={`font-bold py-2 px-4 rounded-lg transition-colors text-sm disabled:cursor-not-allowed ${buttonClass}`}
            >
                {buttonContent}
            </motion.button>
        </motion.div>
    );
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isQuestGenModalOpen, setIsQuestGenModalOpen] = useState(false);
  const [questForCompletion, setQuestForCompletion] = useState<Quest | null>(null);
  const [streakBonusInfo, setStreakBonusInfo] = useState<{xp: number, streak: number} | null>(null);
  const [questToStart, setQuestToStart] = useState<Quest | null>(null);


  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const { updatedUser, bonusDetails } = await checkAndApplyStreakBonus();
      
      if (bonusDetails) {
        setTimeout(() => setStreakBonusInfo(bonusDetails), 500);
      }

      const userPromise = updatedUser ? Promise.resolve(updatedUser) : fetchUser();
      const [userData, skillsData, questsData] = await Promise.all([userPromise, fetchSkills(), fetchQuests()]);
      
      setUser(userData);
      setSkills(skillsData);
      setQuests(questsData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleStartQuest = async (questId: string) => {
    try {
        const updatedQuest = await startQuest(questId);
        setQuests(prevQuests => 
            prevQuests.map(q => q.id === questId ? updatedQuest : q)
        );
    } catch (error) {
        alert((error as Error).message);
        console.error("Failed to start quest:", error);
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    try {
      // Optimistic update of the quest list
      setQuests(prevQuests => prevQuests.filter(q => q.id !== questId));
      setQuestForCompletion(null); // Close modal
      
      const { updatedUser } = await completeQuest(questId);
      setUser(updatedUser);

    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
      console.error("Failed to complete quest:", error);
      // On failure, refetch all data to ensure UI consistency
      loadDashboardData(); 
    }
  };

  const handleGenerateQuests = async (selectedSkills: Skill['name'][]) => {
    setIsGenerating(true);
    setIsQuestGenModalOpen(false);
    try {
        const { newQuests, updatedUser } = await refreshQuests(selectedSkills);
        setQuests(newQuests);
        setUser(updatedUser);
    } catch (error) {
        console.error("Failed to generate new quests:", error);
        alert((error as Error).message || "Could not generate quests. The AI might be busy, or the API key is missing. Please try again later.");
    } finally {
        setIsGenerating(false);
    }
  };

  const dailyCompletions = user?.questsCompletedToday ?? 0;
  const dailyRefreshes = user?.refreshesUsedToday ?? 0;

  return (
    <motion.div 
        className="space-y-8"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
    >
      <ProfileHeader user={user} onXpGain={setUser} />

       <QuestGenerationModal 
        isOpen={isQuestGenModalOpen}
        onClose={() => setIsQuestGenModalOpen(false)}
        onGenerate={handleGenerateQuests}
        skills={skills}
        isGenerating={isGenerating}
      />
      
      <StartQuestModal
        isOpen={!!questToStart}
        onClose={() => setQuestToStart(null)}
        onConfirm={() => {
            if (questToStart) {
                handleStartQuest(questToStart.id);
            }
            setQuestToStart(null);
        }}
        quest={questToStart}
      />

      {questForCompletion && (
        <QuestCompletionModal
            quest={questForCompletion}
            isOpen={!!questForCompletion}
            onClose={() => setQuestForCompletion(null)}
            onComplete={handleCompleteQuest}
        />
      )}

      {streakBonusInfo && (
        <StreakBonusModal
            isOpen={!!streakBonusInfo}
            onClose={() => setStreakBonusInfo(null)}
            streak={streakBonusInfo.streak}
            xp={streakBonusInfo.xp}
        />
      )}

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <h3 className="text-xl font-bold mb-4 dark:text-light-1">Your Skills</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-2 px-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-light-2 dark:bg-dark-2 rounded-lg p-4 flex-shrink-0 w-48 h-36 animate-pulse"></div>)
          ) : (
            skills.map(skill => <SkillCard key={skill.id} skill={skill} />)
          )}
        </div>
      </motion.div>
      
      {!user?.isPremium && (
         <motion.div variants={itemFadeInUp} initial="hidden" animate="visible">
             <Link to="/shop">
                 <motion.div 
                    className="block bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white text-center shadow-lg"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <h3 className="font-bold text-lg flex items-center justify-center space-x-2"><Star className="w-5 h-5" /> <span>Upgrade to Adventure Pass!</span></h3>
                    <p className="text-sm">Remove ads and unlock exclusive features.</p>
                 </motion.div>
             </Link>
         </motion.div>
      )}

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="text-xl font-bold dark:text-light-1">Daily Quests</h3>
            <div className="flex items-center space-x-4">
                <div className="text-sm font-semibold text-dark-3 dark:text-light-3 bg-light-2 dark:bg-dark-2 px-3 py-1.5 rounded-lg">
                    <span>Completed: {dailyCompletions}/7</span>
                    <span className="mx-2 text-light-3 dark:text-dark-3">|</span>
                    <span>Refreshes: {dailyRefreshes}/3</span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsQuestGenModalOpen(true)}
                    disabled={isGenerating || dailyRefreshes >= 3}
                    className="flex items-center space-x-2 text-sm font-semibold text-brand-purple hover:text-brand-purple-light disabled:opacity-50 disabled:cursor-not-allowed"
                    title={dailyRefreshes >= 3 ? "No refreshes left today" : "Refresh quests"}
                >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </motion.button>
            </div>
        </div>
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
        >
          <AnimatePresence mode="wait">
          {isGenerating ? (
             <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center bg-light-2 dark:bg-dark-2 rounded-lg p-8 border border-light-3 dark:border-dark-3"
              >
                <Zap className="mx-auto h-12 w-12 text-brand-purple animate-pulse mb-4" />
                <h4 className="text-lg font-semibold text-dark-1 dark:text-light-1">Generating your next adventure...</h4>
                <p className="text-dark-3 dark:text-light-3">The AI is crafting personalized quests for you.</p>
            </motion.div>
          ) : quests.length > 0 ? (
            <AnimatePresence>
                {quests.map(quest => <QuestCard key={quest.id} quest={quest} onStart={setQuestToStart} onComplete={setQuestForCompletion} disabled={dailyCompletions >= 7} />)}
            </AnimatePresence>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center bg-light-2 dark:bg-dark-2 rounded-lg p-8 border border-light-3 dark:border-dark-3"
            >
                <h4 className="text-lg font-semibold text-dark-1 dark:text-light-1">Your quest log is empty.</h4>
                <p className="text-dark-3 dark:text-light-3 mb-4">Time to start a new adventure!</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsQuestGenModalOpen(true)}
                    className="flex items-center justify-center mx-auto space-x-2 bg-brand-purple hover:bg-brand-purple-light text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Generate New Quests</span>
                </motion.button>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
