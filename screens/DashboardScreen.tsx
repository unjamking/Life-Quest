
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LogoutIcon, FitnessIcon, LearningIcon, SocialSkillIcon, CareerIcon, HobbiesIcon, MindfulnessIcon, RefreshIcon } from '../components/icons';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Quest, QuestStatus, Skill, ModalType, Screen } from '../types';
import Logo from '../components/Logo';

const skillIcons: { [key: string]: React.ReactNode } = {
  Fitness: <FitnessIcon className="w-5 h-5 text-red-500" />,
  Learning: <LearningIcon className="w-5 h-5 text-blue-500" />,
  Social: <SocialSkillIcon className="w-5 h-5 text-yellow-500" />,
  Career: <CareerIcon className="w-5 h-5 text-purple-500" />,
  Hobbies: <HobbiesIcon className="w-5 h-5 text-green-500" />,
  Mindfulness: <MindfulnessIcon className="w-5 h-5 text-indigo-500" />,
};

const skillColors: { [key: string]: string } = {
  Fitness: 'bg-red-500',
  Learning: 'bg-blue-500',
  Social: 'bg-yellow-500',
  Career: 'bg-purple-500',
  Hobbies: 'bg-green-500',
  Mindfulness: 'bg-indigo-500',
};

const skillBgColors: { [key: string]: string } = {
  Fitness: 'bg-red-100',
  Learning: 'bg-blue-100',
  Social: 'bg-yellow-100',
  Career: 'bg-purple-100',
  Hobbies: 'bg-green-100',
  Mindfulness: 'bg-indigo-100',
};


const ProfileCard: React.FC = () => {
    const { user, showModal } = useAppContext();
    if (!user) return null;

    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
            <img src={user.avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full border-2 border-[#0544E3]" />
            <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1a1a1a]">{user.username}</h2>
                <p className="text-sm text-gray-500">Level {user.level}</p>
                <div className="flex items-center mt-1">
                    <ProgressBar value={user.xp} max={user.xpToNextLevel} />
                    <span className="text-xs text-gray-500 ml-2">{user.xp}/{user.xpToNextLevel}</span>
                </div>
            </div>
            {!user.isPremium && (
                 <Button variant="secondary" onClick={() => showModal(ModalType.REWARDED_AD)} className="text-xs !py-1 !px-2">Watch Ad for XP</Button>
            )}
        </div>
    );
}

const SkillTree: React.FC = () => {
    const { user } = useAppContext();
    if (!user) return null;
    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Your Skills</h3>
            <div className="grid grid-cols-2 gap-4">
                {user.skills.map((skill: Skill) => (
                    <div key={skill.category} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                            {skillIcons[skill.category]}
                            <span className="ml-2 font-medium text-sm">{skill.category}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Level {skill.level}</p>
                        <ProgressBar value={skill.xp} max={skill.xpToNextLevel} color={skillColors[skill.category]} />
                    </div>
                ))}
            </div>
        </div>
    )
}

const QuestItem: React.FC<{ quest: Quest }> = ({ quest }) => {
    const { showModal } = useAppContext();
    const isCompleted = quest.status === QuestStatus.COMPLETED;
    const isPending = quest.status === QuestStatus.PENDING_VERIFICATION;
    
    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm flex items-center transition-opacity ${isCompleted ? 'opacity-50' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${skillBgColors[quest.category]}`}>
                {/* FIX: Add type assertion for props to fix 'className' property error in React.cloneElement */}
                {React.cloneElement(skillIcons[quest.category] as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
            </div>
            <div className="flex-1">
                <p className="font-bold text-sm text-[#1a1a1a]">{quest.title}</p>
                <p className="text-xs text-gray-500">{quest.description}</p>
                <p className="text-xs font-medium text-[#0544E3] mt-1">+{quest.xp} XP</p>
            </div>
            {!isCompleted && !isPending && (
                <Button onClick={() => showModal(ModalType.PROOF_UPLOAD, { questId: quest.id })} className="!py-1 !px-3 text-sm">
                    Complete
                </Button>
            )}
            {isPending && <p className="text-xs text-yellow-500 font-medium">Verifying...</p>}
            {isCompleted && <div className="w-6 h-6 bg-green-500 rounded-full text-white flex items-center justify-center">✓</div>}
        </div>
    );
};


const QuestBoard: React.FC = () => {
    const { user, quests, isLoading, showModal } = useAppContext();
    
    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-[#1a1a1a]">Daily Quests</h3>
                <Button variant="ghost" className="!py-1 !px-2" onClick={() => showModal(ModalType.PREFERENCES)}>
                    <RefreshIcon className="w-4 h-4 mr-1"/>
                    <span>Refresh ({user?.dailyQuestRefreshes || 0})</span>
                </Button>
            </div>
            <div className="space-y-3">
                {isLoading && <LoadingSpinner />}
                {!isLoading && quests.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-lg shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p className="text-gray-600 font-semibold text-lg mb-2">Your quest log is empty.</p>
                        <p className="text-gray-500 mb-6 text-sm">Time to start a new adventure!</p>
                        <Button onClick={() => showModal(ModalType.PREFERENCES)}>Generate New Quests</Button>
                    </div>
                )}
                {!isLoading && quests.map(quest => <QuestItem key={quest.id} quest={quest}/>)}
            </div>
        </div>
    )
}


const DashboardScreen: React.FC = () => {
    const { logout, user, setActiveScreen } = useAppContext();

    return (
        <div className="bg-[#f7f8fa] h-full overflow-y-auto pb-24">
            <header className="p-4 flex justify-between items-center bg-white shadow-sm sticky top-0 z-10">
                <Logo className="h-9 w-9 text-[#0544E3]"/>
                <button onClick={logout} className="text-gray-500 hover:text-[#0544E3]">
                    <LogoutIcon />
                </button>
            </header>

            <main className="p-4">
                <ProfileCard/>
                <SkillTree />
                 {!user?.isPremium && (
                    <div className="mt-6 rounded-lg overflow-hidden shadow-md">
                        <div onClick={() => setActiveScreen(Screen.SHOP)} aria-label="Advertisement" className="cursor-pointer">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-lg font-poppins">Upgrade to Premium!</p>
                                    <p className="text-sm">Remove ads and unlock all features.</p>
                                </div>
                                <span className="bg-white text-[#0544E3] font-bold py-1 px-3 rounded-full text-sm">
                                    Go Pro
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <QuestBoard />
            </main>
        </div>
    );
};

export default DashboardScreen;
