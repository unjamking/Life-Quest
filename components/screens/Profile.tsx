import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Award, Upload, KeyRound, FileText, ShoppingCart, Flame, Trophy, Trash2 } from 'lucide-react';
import type { User, Skill } from '../../types';
import { fetchUser, saveProfileChanges, fetchSkills, deleteCurrentUser } from '../../services/mockApi';
import AvatarUploadModal from '../profile/AvatarUploadModal';
import ChangePasswordModal from '../profile/ChangePasswordModal';
import LegalModal from '../profile/LegalModal';
import RestorePurchasesModal from '../profile/RestorePurchasesModal';
import DeleteAccountModal from '../profile/DeleteAccountModal';
import { itemFadeInUp, pageTransition } from '../../utils/animations';
import Avatar from '../common/Avatar';

const SettingsTab: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    
    useEffect(() => {
        fetchUser().then(setUser);
    }, []);

    const handleSaveChanges = async () => {
        if (!user) return;
        try {
            await saveProfileChanges(user.username, user.email);
            alert("Changes saved successfully!");
        } catch (error) {
            alert("Failed to save changes.");
        }
    };
    
    const handleAvatarUpdate = (newAvatarUrl: string) => {
        if(user) {
            setUser({...user, avatarUrl: newAvatarUrl });
        }
    };
    
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            const result = await deleteCurrentUser();
            if (result.success) {
                setIsDeleteModalOpen(false);
                onLogout(); // This will clear session and redirect
            } else {
                setDeleteError("Failed to delete account. Please try again.");
            }
        } catch (error) {
            setDeleteError("An unexpected error occurred.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!user) return <div>Loading...</div>

    return (
        <>
        <AvatarUploadModal 
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            onAvatarUploaded={handleAvatarUpdate}
        />
        <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
        <LegalModal isOpen={isLegalModalOpen} onClose={() => setIsLegalModalOpen(false)} />
        <RestorePurchasesModal isOpen={isRestoreModalOpen} onClose={() => setIsRestoreModalOpen(false)} />
        <DeleteAccountModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirmDelete={handleConfirmDelete}
            isDeleting={isDeleting}
            error={deleteError}
        />


        <div className="space-y-6">
             <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <Avatar src={user.avatarUrl} className="w-32 h-32 rounded-full object-cover border-4 border-light-3 dark:border-dark-3" alt="avatar" />
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="absolute bottom-0 right-0 bg-brand-purple text-white rounded-full p-2 hover:bg-brand-purple-light transition-colors shadow-md">
                        <Upload className="w-5 h-5"/>
                    </motion.button>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-bold">{user.username}</h3>
                    <p className="font-semibold text-brand-purple">{user.rankTitle}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-light-3 dark:border-dark-3">
                <div className="bg-light-1 dark:bg-dark-3 p-4 rounded-lg text-center">
                    <Flame className="w-8 h-8 mx-auto text-orange-500 mb-2" />
                    <p className="text-2xl font-bold text-dark-1 dark:text-light-1">{user.currentStreak}</p>
                    <p className="text-sm font-semibold text-dark-3 dark:text-light-3">Current Streak</p>
                </div>
                <div className="bg-light-1 dark:bg-dark-3 p-4 rounded-lg text-center">
                    <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                    <p className="text-2xl font-bold text-dark-1 dark:text-light-1">{user.longestStreak || user.currentStreak}</p>
                    <p className="text-sm font-semibold text-dark-3 dark:text-light-3">Longest Streak</p>
                </div>
            </div>

            <div>
                <label htmlFor="username" className="block text-sm font-medium text-dark-3 dark:text-light-3">Username</label>
                <input type="text" id="username" value={user.username} onChange={(e) => setUser({...user, username: e.target.value})} className="mt-1 block w-full bg-light-1 dark:bg-dark-3 border-light-3 dark:border-dark-3 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple text-dark-1 dark:text-light-1" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-3 dark:text-light-3">Email</label>
                <input type="email" id="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="mt-1 block w-full bg-light-1 dark:bg-dark-3 border-light-3 dark:border-dark-3 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple text-dark-1 dark:text-light-1" />
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveChanges}
                className="w-full bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Save Changes
            </motion.button>
            
            <div className="space-y-2 pt-4 border-t border-light-3 dark:border-dark-3">
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center justify-center space-x-2 bg-light-1 dark:bg-dark-3 hover:bg-light-3 dark:hover:bg-opacity-50 text-dark-2 dark:text-light-2 font-semibold py-2 px-4 rounded-lg transition-colors"><KeyRound className="w-4 h-4" /><span>Change Password</span></motion.button>
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsLegalModalOpen(true)} className="w-full flex items-center justify-center space-x-2 bg-light-1 dark:bg-dark-3 hover:bg-light-3 dark:hover:bg-opacity-50 text-dark-2 dark:text-light-2 font-semibold py-2 px-4 rounded-lg transition-colors"><FileText className="w-4 h-4" /><span>Legal & Privacy</span></motion.button>
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsRestoreModalOpen(true)} className="w-full flex items-center justify-center space-x-2 bg-light-1 dark:bg-dark-3 hover:bg-light-3 dark:hover:bg-opacity-50 text-dark-2 dark:text-light-2 font-semibold py-2 px-4 rounded-lg transition-colors"><ShoppingCart className="w-4 h-4" /><span>Restore Purchases</span></motion.button>
                 <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => setIsDeleteModalOpen(true)} 
                    className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                 </motion.button>
            </div>
        </div>
        </>
    );
}

const AchievementCard: React.FC<{ name: string; description: string; unlocked: boolean }> = ({ name, description, unlocked }) => {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className={`p-4 rounded-lg flex items-center space-x-4 ${unlocked ? 'bg-light-1 dark:bg-dark-3' : 'bg-light-1 dark:bg-dark-3 opacity-60'}`}
        >
            <div className={`p-3 rounded-full ${unlocked ? 'bg-yellow-400' : 'bg-gray-400'}`}>
                <Award className="w-6 h-6 text-white" />
            </div>
            <div>
                <h4 className={`font-bold ${unlocked ? 'text-dark-1 dark:text-light-1' : 'text-dark-3 dark:text-light-3'}`}>{name}</h4>
                <p className="text-sm text-dark-3 dark:text-light-3">{description}</p>
            </div>
        </motion.div>
    )
}

const AchievementsTab: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [userData, skillsData] = await Promise.all([fetchUser(), fetchSkills()]);
                setUser(userData);
                setSkills(skillsData);
            } catch (error) {
                console.error("Failed to load achievement data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const achievements = user ? [
        // Quest Completion
        { name: "Quest Starter", description: "Complete your first quest.", unlocked: user.questsCompleted >= 1 },
        { name: "Quest Novice", description: "Complete 10 quests.", unlocked: user.questsCompleted >= 10 },
        { name: "Quest Adept", description: "Complete 50 quests.", unlocked: user.questsCompleted >= 50 },
        { name: "Quest Master", description: "Complete 100 quests.", unlocked: user.questsCompleted >= 100 },
        { name: "Quest Legend", description: "Complete 250 quests.", unlocked: user.questsCompleted >= 250 },
        { name: "Daily Champion", description: "Complete all 7 daily quests in a single day.", unlocked: user.questsCompletedToday >= 7 },

        // Level & XP
        { name: "Level 10 Hero", description: "Reach player level 10.", unlocked: user.level >= 10 },
        { name: "Level 25 Paragon", description: "Reach player level 25.", unlocked: user.level >= 25 },
        { name: "XP Accumulator", description: "Earn a total of 10,000 XP.", unlocked: user.totalXp >= 10000 },
        { name: "XP Titan", description: "Earn a total of 50,000 XP.", unlocked: user.totalXp >= 50000 },
        { name: "XP Overlord", description: "Earn a total of 100,000 XP.", unlocked: user.totalXp >= 100000 },

        // Skills
        { name: "Jack of All Trades", description: "Reach level 2 in all skills.", unlocked: skills.every(s => s.level >= 2) },
        { name: "Skill Virtuoso", description: "Reach level 10 in any skill.", unlocked: skills.some(s => s.level >= 10) },
        { name: "Master of All", description: "Reach level 10 in all skills.", unlocked: skills.every(s => s.level >= 10) },
        { name: "Specialist", description: "Reach level 20 in any skill.", unlocked: skills.some(s => s.level >= 20) },

        // Streaks
        { name: "Week-long Warrior", description: "Maintain a 7-day login streak.", unlocked: (user.longestStreak || 0) >= 7 },
        { name: "Monthly Marauder", description: "Maintain a 30-day login streak.", unlocked: (user.longestStreak || 0) >= 30 },
        { name: "Streak Centurion", description: "Maintain a 100-day login streak.", unlocked: (user.longestStreak || 0) >= 100 },
        
        // Guild & Social
        { name: "Guild Member", description: "Join your first guild.", unlocked: true }, // This would need DB logic to be accurate
        { name: "Guild Contributor", description: "Contribute to a guild quest.", unlocked: (user.questsContributedToGuildToday ?? 0) > 0 },

        // Premium
        { name: "Adventure Patron", description: "Support the app with the Adventure Pass.", unlocked: user.isPremium },
    ].sort((a, b) => (a.unlocked === b.unlocked) ? 0 : a.unlocked ? -1 : 1) : []; // Sorts unlocked to the top
    
    if (loading) return <div>Loading Achievements...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(ach => <AchievementCard key={ach.name} {...ach} />)}
        </div>
    );
}

interface ProfileProps {
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'achievements'>('settings');
  
  const tabButtonClasses = (tabName: 'settings' | 'achievements') =>
    `relative flex-1 text-center py-3 px-4 font-semibold transition-colors rounded-t-lg ${
      activeTab !== tabName && 'hover:bg-light-1 dark:hover:bg-dark-3 text-dark-3 dark:text-light-3'
    }`;


  return (
    <motion.div
        className="space-y-6 max-w-2xl mx-auto"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
    >
       <div className="flex items-center space-x-3">
        <UserCircle className="w-8 h-8 text-brand-purple" />
        <h1 className="text-3xl font-bold dark:text-light-1">Profile</h1>
      </div>
      
      <div className="bg-light-2 dark:bg-dark-2 rounded-lg shadow-sm border border-light-3 dark:border-dark-3">
          <div className="flex border-b border-light-3 dark:border-dark-3">
              <button className={tabButtonClasses('settings')} onClick={() => setActiveTab('settings')}>
                  <span className={activeTab === 'settings' ? 'text-brand-purple' : ''}>Settings</span>
                  {activeTab === 'settings' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple" layoutId="underline" />}
              </button>
              <button className={tabButtonClasses('achievements')} onClick={() => setActiveTab('achievements')}>
                  <span className={activeTab === 'achievements' ? 'text-brand-purple' : ''}>Achievements</span>
                  {activeTab === 'achievements' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple" layoutId="underline" />}
              </button>
          </div>
          
          <div className="p-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={itemFadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {activeTab === 'settings' ? <SettingsTab onLogout={onLogout} /> : <AchievementsTab />}
                </motion.div>
            </AnimatePresence>
          </div>
      </div>
    </motion.div>
  );
};

export default Profile;