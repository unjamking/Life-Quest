
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Quest, ModalType, ToastMessage, SkillCategory, Screen, QuestStatus } from '../types';
import { MOCK_USER } from '../constants';
import * as GeminiService from '../services/geminiService';
import * as dbService from '../services/dbService';

interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  quests: Quest[];
  activeScreen: Screen;
  activeModal: { type: ModalType; props?: any } | null;
  toast: ToastMessage | null;
  isLoading: boolean;
  login: (username: string, password?: string) => void;
  signUp: (username: string, email: string, password?: string) => void;
  logout: () => void;
  setActiveScreen: (screen: Screen) => void;
  showModal: (type: ModalType, props?: any) => void;
  hideModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  generateQuests: (categories: SkillCategory[], mood: string) => Promise<void>;
  submitQuestProof: (questId: string, notes: string, image?: File) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.LOGIN);
  const [activeModal, setActiveModal] = useState<{ type: ModalType; props?: any } | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
        try {
            const userId = await dbService.getCurrentSession();
            if (userId) {
                const sessionUser = await dbService.getUser(userId);
                if (sessionUser) {
                    const { password, ...userToSet } = sessionUser;
                    const userQuests = await dbService.getQuestsByUserId(userId);
                    setUser(userToSet);
                    setQuests(userQuests);
                    setIsAuthenticated(true);
                    setActiveScreen(Screen.DASHBOARD);
                } else {
                    await dbService.clearCurrentSession();
                }
            }
        } catch (error) {
            console.error("Failed to initialize session from DB", error);
        } finally {
            setIsLoading(false);
        }
    };
    checkSession();
  }, []);

  const login = async (usernameOrEmail: string, password = '') => {
    setIsLoading(true);
    try {
        const users = await dbService.getAllUsers();
        const normalizedInput = usernameOrEmail.toLowerCase().trim();
        const foundUser = users.find(u =>
            (u.username.toLowerCase() === normalizedInput || u.email.toLowerCase() === normalizedInput)
        );

        if (!foundUser || foundUser.password !== password) {
            showToast('Invalid username or password.', 'error');
            return;
        }

        const { password: _, ...userToSet } = foundUser;
        const userQuests = await dbService.getQuestsByUserId(userToSet.id);

        await dbService.setCurrentSession(userToSet.id);
        setUser(userToSet);
        setQuests(userQuests);
        setIsAuthenticated(true);
        setActiveScreen(Screen.DASHBOARD);
        showToast(`Welcome back, ${userToSet.username}!`, 'success');
    } catch (error) {
        showToast('An error occurred during login.', 'error');
    } finally {
        setIsLoading(false);
    }
  };

  const signUp = async (username: string, email: string, password = '') => {
    setIsLoading(true);
    try {
        const users = await dbService.getAllUsers();
        const normalizedUsername = username.toLowerCase().trim();
        const normalizedEmail = email.toLowerCase().trim();

        if (users.some(u => u.username.toLowerCase() === normalizedUsername)) {
            showToast('Username already exists.', 'error');
            return;
        }
        if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
            showToast('Email is already in use.', 'error');
            return;
        }

        const newUser: User = {
            ...MOCK_USER,
            id: `user-${Date.now()}`,
            username: username.trim(),
            email: email.trim(),
            password: password,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            skills: MOCK_USER.skills.map(skill => ({ ...skill, level: 1, xp: 0, xpToNextLevel: 100 })),
        };

        await dbService.addUser(newUser);

        const { password: _, ...userToSet } = newUser;
        await dbService.setCurrentSession(userToSet.id);
        setUser(userToSet);
        setQuests([]);
        setIsAuthenticated(true);
        setActiveScreen(Screen.DASHBOARD);
        showToast(`Welcome to LifeQuest, ${username}! Let's begin.`, 'success');
    } catch (error) {
        showToast('An error occurred during sign up.', 'error');
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async () => {
    await dbService.clearCurrentSession();
    setIsAuthenticated(false);
    setUser(null);
    setQuests([]);
    setActiveScreen(Screen.LOGIN);
    showToast('You have been logged out.');
  };

  const showModal = (type: ModalType, props?: any) => setActiveModal({ type, props });
  const hideModal = () => setActiveModal(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToast(newToast);
    setTimeout(() => setToast(currentToast => (currentToast?.id === newToast.id ? null : currentToast)), 3000);
  };
  
  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    try {
        const userInDb = await dbService.getUser(user.id);
        if (userInDb) {
            await dbService.updateUser({ ...userInDb, ...data });
        }
    } catch (error) {
        showToast('Failed to save profile changes.', 'error');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
      if (!user) return false;

      try {
          const userInDb = await dbService.getUser(user.id);
          if (!userInDb) {
              showToast('An error occurred. Please log in again.', 'error');
              return false;
          }

          if (userInDb.password !== currentPassword) {
              showToast('Current password is incorrect.', 'error');
              return false;
          }

          await dbService.updateUser({ ...userInDb, password: newPassword });
          showToast('Password updated successfully!', 'success');
          return true;
      } catch (error) {
          showToast('Failed to update password.', 'error');
          return false;
      }
  }

  const generateQuests = async (categories: SkillCategory[], mood: string) => {
    if (!user) return;
    setIsLoading(true);
    hideModal();
    try {
        const newQuestData = await GeminiService.generateQuests(categories, mood);
        const newQuests: Quest[] = newQuestData.map((q, index) => ({
            ...q,
            id: `quest-${Date.now()}-${index}`,
            userId: user.id,
            status: QuestStatus.INCOMPLETE,
        }));
        await dbService.replaceUserQuests(user.id, newQuests);
        setQuests(newQuests);
        showToast('New quests have been generated!', 'success');
    } catch (error) {
        showToast('Failed to generate new quests.', 'error');
    } finally {
        setIsLoading(false);
    }
  };

  const submitQuestProof = async (questId: string, notes: string, image?: File) => {
      const questToVerify = quests.find(q => q.id === questId);
      if (!questToVerify || !user) return;

      hideModal();
      setQuests(quests.map(q => q.id === questId ? { ...q, status: QuestStatus.PENDING_VERIFICATION } : q));
      setIsLoading(true);

      try {
          const result = await GeminiService.verifyQuestProof(questToVerify.title, notes, image);
          showToast(result.feedback, result.success ? 'success' : 'error');

          const newStatus = result.success ? QuestStatus.COMPLETED : QuestStatus.FAILED;
          const updatedQuest = { ...questToVerify, status: newStatus };
          await dbService.updateQuest(updatedQuest);
          
          setQuests(prevQuests => prevQuests.map(q => q.id === questId ? updatedQuest : q));

          if (result.success) {
              let newXp = user.xp + questToVerify.xp;
              let newLevel = user.level;
              let xpToNextLevel = user.xpToNextLevel;

              if (newXp >= user.xpToNextLevel) {
                  newLevel += 1;
                  newXp -= user.xpToNextLevel;
                  xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
                  showToast(`Level Up! You are now Level ${newLevel}!`, 'success');
              }
              
              const userUpdates = { xp: newXp, level: newLevel, xpToNextLevel };
              updateUser(userUpdates); // This updates state and DB
          }
      } catch (error) {
          showToast('An error occurred during verification.', 'error');
          const revertedQuest = { ...questToVerify, status: QuestStatus.INCOMPLETE };
          await dbService.updateQuest(revertedQuest);
          setQuests(prevQuests => prevQuests.map(q => q.id === questId ? revertedQuest : q));
      } finally {
          setIsLoading(false);
      }
  };


  const value = {
    isAuthenticated,
    user,
    quests,
    activeScreen,
    activeModal,
    toast,
    isLoading,
    login,
    signUp,
    logout,
    setActiveScreen,
    showModal,
    hideModal,
    showToast,
    generateQuests,
    submitQuestProof,
    updateUser,
    changePassword,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};