import { getDB, saveDB, initDB, createSkillsForUser, iconMap } from './db';
import { QuestDifficulty } from '../types';
import type { User, Quest, Guild, Skill } from '../types';
import { generateQuestsFromSkills } from './geminiService';

// Initialize the database from localStorage on load
initDB();

const getCurrentUserId = (): string | null => localStorage.getItem('currentUserId') || sessionStorage.getItem('currentUserId');

// --- LEVELING SYSTEM ---
const BASE_XP = 800;
const EXPONENT = 1.5;

const RANK_TITLES: { [key: number]: string } = {
    1: 'Novice Adventurer',
    10: 'Apprentice Quester',
    20: 'Seasoned Explorer',
    30: 'Elite Vanguard',
    40: 'Quest Master',
    50: 'Legend of the Realm',
};

const getRankTitle = (level: number): string => {
    let title = RANK_TITLES[1];
    for (const levelThreshold in RANK_TITLES) {
        if (level >= parseInt(levelThreshold)) {
            title = RANK_TITLES[levelThreshold];
        }
    }
    return title;
};

const getXpForLevel = (level: number): number => {
    return Math.floor(BASE_XP * Math.pow(level, EXPONENT));
};

const getLevelFromXp = (totalXp: number): { level: number; currentLevelXp: number; xpForNextLevel: number } => {
    let level = 1;
    let xpForNext = getXpForLevel(level);
    let cumulativeXp = 0;

    while (totalXp >= cumulativeXp + xpForNext) {
        cumulativeXp += xpForNext;
        level++;
        xpForNext = getXpForLevel(level);
    }

    return {
        level: level,
        currentLevelXp: totalXp - cumulativeXp,
        xpForNextLevel: xpForNext,
    };
};
// --- END LEVELING SYSTEM ---

// FIX: Use a generic type to preserve additional properties like 'password' on the user object after stats calculation. This prevents type errors downstream when trying to access properties that were being stripped from the type.
const calculateUserStats = <T extends User & { totalXp: number }>(user: T): T => {
    const { level, currentLevelXp, xpForNextLevel } = getLevelFromXp(user.totalXp);
    return {
        ...user,
        level,
        xp: currentLevelXp,
        xpForNextLevel,
        rankTitle: getRankTitle(level),
    };
};

const simulateDelay = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
}

export const loginUser = (usernameOrEmail: string, password: string, rememberMe: boolean): Promise<User | null> => {
    const db = getDB();
    const user = db.users.find(
        (u: User & { password?: string }) => 
            (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && u.password === password
    );
    if (user) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('currentUserId', user.id);
        const { password, ...userWithoutPassword } = user;
        return simulateDelay(userWithoutPassword);
    }
    return simulateDelay(null);
}

const validatePassword = (password: string): { isValid: boolean, message: string } => {
    if (password.length < 8) {
        return { isValid: false, message: "Password must be at least 8 characters long." };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one uppercase letter." };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one number." };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one symbol." };
    }
    return { isValid: true, message: "" };
};

export const registerUser = (username: string, email: string, password: string, avatarFile: File | null): Promise<{ success: boolean; message: string; user: User | null }> => {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return simulateDelay({ success: false, message: passwordValidation.message, user: null });
    }

    const db = getDB();
    if (db.users.some((u: User) => u.username.toLowerCase() === username.toLowerCase())) {
        return simulateDelay({ success: false, message: 'Username already taken.', user: null });
    }
    if (db.users.some((u: User) => u.email.toLowerCase() === email.toLowerCase())) {
        return simulateDelay({ success: false, message: 'Email already registered.', user: null });
    }
    
    const newUser: User & { password?: string } = {
        id: `user_${Date.now()}`,
        email,
        username,
        password,
        avatarUrl: avatarFile ? URL.createObjectURL(avatarFile) : '',
        level: 1,
        xp: 0,
        totalXp: 0,
        xpForNextLevel: 800,
        rankTitle: 'Novice Adventurer',
        coins: 0,
        isPremium: false,
        questsCompleted: 0,
        questsCompletedToday: 0,
        refreshesUsedToday: 0,
        lastLoginDate: new Date().toISOString().split('T')[0],
        currentStreak: 1,
        longestStreak: 1,
        questsContributedToGuildToday: 0,
    };
    
    const calculatedUser = calculateUserStats(newUser);
    db.users.push(calculatedUser);
    
    // Add default skills for the new user, ensuring they are fully hydrated with icons
    const defaultSkillsData = createSkillsForUser(newUser.id);
    const defaultSkills: Skill[] = defaultSkillsData.map(s => ({
        ...s,
        icon: iconMap[s.name],
    }));
    db.skills = [...db.skills, ...defaultSkills];
    
    saveDB(db);
    
    localStorage.setItem('currentUserId', calculatedUser.id);
    const { password: _, ...userToReturn } = calculatedUser;
    
    return simulateDelay({ success: true, message: 'Registration successful!', user: userToReturn });
}

export const logoutUser = () => {
    localStorage.removeItem('currentUserId');
    sessionStorage.removeItem('currentUserId');
    return Promise.resolve();
};

export const fetchUser = async (): Promise<User | null> => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return simulateDelay(null);
    const db = getDB();
    // FIX: Add password to user type to allow destructuring without a type error.
    const user = db.users.find((u: User & { password?: string }) => u.id === currentUserId);
    if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return simulateDelay(userWithoutPassword);
    }
    return simulateDelay(null);
};


const getDayDifference = (date1Str: string, date2Str: string): number => {
    const d1 = new Date(date1Str);
    const d2 = new Date(date2Str);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};


export const checkAndApplyStreakBonus = async (): Promise<{
    bonusDetails: { xp: number; streak: number } | null;
    updatedUser: User | null;
}> => {
    const db = getDB();
    const currentUserId = getCurrentUserId();
    const userIndex = db.users.findIndex((u: User) => u.id === currentUserId);
    if (userIndex === -1) {
        return { bonusDetails: null, updatedUser: null };
    }

    let user = db.users[userIndex];
    let bonusDetails: { xp: number; streak: number } | null = null;

    const todayString = new Date().toISOString().split('T')[0];
    
    const diffDays = getDayDifference(user.lastLoginDate, todayString);
    
    if (diffDays > 0) {
        // Reset daily counters for any new day
        user.questsCompletedToday = 0;
        user.refreshesUsedToday = 0;
        user.questsContributedToGuildToday = 0;
        
        if (diffDays === 1) { // Consecutive day
            user.currentStreak = (user.currentStreak || 1) + 1;
            if (user.currentStreak > (user.longestStreak || 0)) {
                user.longestStreak = user.currentStreak;
            }
            const bonusXp = user.currentStreak * 10;
            user.totalXp += bonusXp;
            bonusDetails = { xp: bonusXp, streak: user.currentStreak };
        } else { // Broken streak
            user.currentStreak = 1;
        }
        user.lastLoginDate = todayString;
        
        const updatedUserWithStats = calculateUserStats(user);
        db.users[userIndex] = updatedUserWithStats;
        saveDB(db);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userToReturn } = updatedUserWithStats;
        return { bonusDetails, updatedUser: userToReturn };

    } else { // Same day login, no changes
        const { password, ...userToReturn } = user;
        // Even if no streak change, we should return the current user state
        return { bonusDetails: null, updatedUser: userToReturn };
    }
};

export const fetchSkills = () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return simulateDelay([]);
    return simulateDelay(getDB().skills.filter((s: Skill) => s.userId === currentUserId));
};

export const fetchQuests = () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return simulateDelay([]);
    return simulateDelay(getDB().quests.filter((q: Quest) => q.userId === currentUserId && !q.isCompleted));
};
export const fetchLeaderboard = () => {
    const db = getDB();
    
    // Use only real users from the database for the leaderboard
    const leaderboard = db.users.map((user: User) => ({
        rank: 0,
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        level: user.level,
        totalXp: user.totalXp,
    }));

    leaderboard.sort((a, b) => b.totalXp - a.totalXp);
    const rankedLeaderboard = leaderboard.map((user, index) => ({ ...user, rank: index + 1 }));
    return simulateDelay(rankedLeaderboard);
};
export const fetchGuilds = () => simulateDelay(getDB().guilds);
export const fetchGuildById = (id: string) => simulateDelay(getDB().guilds.find(g => g.id === id));


const setQuests = (db: any, newQuests: Quest[]) => {
    const currentUserId = getCurrentUserId();
    // Remove old quests for the user
    const otherUserQuests = db.quests.filter((q: Quest) => q.userId !== currentUserId);
    db.quests = [...otherUserQuests, ...newQuests];
    return db.quests.filter((q: Quest) => q.userId === currentUserId);
};

export const refreshQuests = async (selectedSkills: Skill['name'][]): Promise<{ updatedUser: User, newQuests: Quest[] }> => {
    const db = getDB();
    const currentUserId = getCurrentUserId();
    const userIndex = db.users.findIndex((u: User) => u.id === currentUserId);
    if (userIndex === -1) throw new Error("User not found");

    const user = db.users[userIndex];
    if (user.refreshesUsedToday >= 3) {
        throw new Error("Daily refresh limit reached. Come back tomorrow!");
    }
    
    user.refreshesUsedToday = (user.refreshesUsedToday || 0) + 1;
    db.users[userIndex] = user;
    
    const newQuestData = await generateQuestsFromSkills(selectedSkills);
    const newQuestsWithIds: Quest[] = newQuestData.map((q, i) => ({
        ...q,
        id: `quest_${Date.now()}_${i}`,
        isCompleted: false,
        userId: user.id,
    }));
    
    setQuests(db, newQuestsWithIds);
    saveDB(db);
    
    const updatedUser = await fetchUser();
    return simulateDelay({ updatedUser: updatedUser!, newQuests: newQuestsWithIds });
};

export const startQuest = (questId: string): Promise<Quest> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const db = getDB();
            const currentUserId = getCurrentUserId();
            const questIndex = db.quests.findIndex((q: Quest) => q.id === questId && q.userId === currentUserId);
            
            if (questIndex === -1) {
                return reject(new Error("Quest not found."));
            }

            let quest = db.quests[questIndex];

            if (quest.startTimestamp) {
                return reject(new Error("Quest has already been started."));
            }

            if (!quest.durationMinutes) {
                return reject(new Error("Cannot start a quest with no duration."));
            }

            quest.startTimestamp = Date.now();
            quest.expiryTimestamp = Date.now() + quest.durationMinutes * 60 * 1000;
            
            db.quests[questIndex] = quest;
            saveDB(db);

            resolve(quest);
        }, 300); // simulate network delay
    });
};


export const completeQuest = (questId: string) => {
    return new Promise<{ quest: Quest, updatedUser: User }>((resolve, reject) => {
        setTimeout(() => {
            const db = getDB();
            const currentUserId = getCurrentUserId();
            const quest = db.quests.find((q: Quest) => q.id === questId && q.userId === currentUserId);
            
            const userIndex = db.users.findIndex((u: User) => u.id === currentUserId);
            if (userIndex === -1) {
                return reject(new Error("User not found"));
            }
            let user = db.users[userIndex];
            
            if ((user.questsCompletedToday ?? 0) >= 7) {
                return reject(new Error("Daily quest completion limit reached. Come back tomorrow!"));
            }

            if (quest && !quest.isCompleted) {
                if (!quest.startTimestamp) {
                    return reject(new Error("Quest has not been started yet."));
                }
                if (quest.expiryTimestamp && Date.now() > quest.expiryTimestamp) {
                    quest.isCompleted = true; // Mark as done to remove from list
                    saveDB(db);
                    return reject(new Error("Quest has expired!"));
                }

                quest.isCompleted = true;
                
                user.totalXp += quest.xpReward;
                user.questsCompleted = (user.questsCompleted || 0) + 1;
                user.questsCompletedToday = (user.questsCompletedToday || 0) + 1;
                const updatedUserWithStats = calculateUserStats(user);
                db.users[userIndex] = updatedUserWithStats;
                saveDB(db);
                
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...userToReturn } = updatedUserWithStats;
                resolve({ quest, updatedUser: userToReturn });
            } else if (quest) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...userToReturn } = user;
                resolve({ quest, updatedUser: userToReturn }); // Idempotent
            } else {
                reject(new Error("Quest not found"));
            }
        }, 500);
    });
};

export const watchAdForXp = async () => {
    const db = getDB();
    const currentUserId = getCurrentUserId();
    const userIndex = db.users.findIndex((u: User) => u.id === currentUserId);
    if(userIndex === -1) throw new Error("User not found");

    const xpGain = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    let user = db.users[userIndex];
    user.totalXp += xpGain;
    db.users[userIndex] = calculateUserStats(user);
    saveDB(db);
    const updatedUser = await fetchUser();
    return simulateDelay({ xpGained: xpGain, updatedUser: updatedUser! });
};

export const processPayment = async () => {
    const db = getDB();
    const currentUserId = getCurrentUserId();
    const userIndex = db.users.findIndex((u: User) => u.id === currentUserId);
    if(userIndex === -1) throw new Error("User not found");
    
    db.users[userIndex].isPremium = true;
    saveDB(db);
    const updatedUser = await fetchUser();
    return simulateDelay({ success: true, updatedUser: updatedUser! });
};

export const uploadAvatar = async (file: File) => {
    const db = getDB();
    const currentUserId = getCurrentUserId();
    const userIndex = db.users.findIndex((u: User) => u.id === currentUserId);
    if(userIndex === -1) throw new Error("User not found");
    
    const newAvatarUrl = URL.createObjectURL(file);
    db.users[userIndex].avatarUrl = newAvatarUrl;
    saveDB(db);
    return simulateDelay({ success: true, newAvatarUrl });
};

export const createGuild = async (name: string, description: string) => {
    const db = getDB();
    const currentUser = await fetchUser();
    if(!currentUser) throw new Error("User not found");

    const durationMinutes = 30 * 24 * 60; // 30 days
    const expiryTimestamp = Date.now() + durationMinutes * 60 * 1000;

    const newGuild: Guild = {
        id: `guild_${Date.now()}`,
        name,
        description,
        imageUrl: `https://picsum.photos/seed/${name}/200/200`,
        memberCount: 1,
        maxMembers: 50,
        isPrivate: false,
        members: [ { id: currentUser.id, username: currentUser.username, avatarUrl: currentUser.avatarUrl, level: currentUser.level }],
        chat: [{id: `msg_${Date.now()}`, username: 'Guild Bot', avatarUrl: '/vite.svg', text: `Welcome to ${name}!`, timestamp: new Date().toISOString() }],
        quest: {
            id: `gquest_${Date.now()}`,
            title: 'Community Growth',
            description: 'Work together to complete 100 quests as a guild!',
            type: 'Social',
            difficulty: QuestDifficulty.HARD,
            xpReward: 10000,
            isCompleted: false,
            userId: 'guild',
            progress: 0,
            target: 100,
            contributors: [],
            durationMinutes: durationMinutes,
            expiryTimestamp: expiryTimestamp,
        }
    };
    db.guilds.unshift(newGuild);
    saveDB(db);
    return simulateDelay({ success: true, newGuild });
};

export const saveProfileChanges = async (username: string, email: string) => {
    const db = getDB();
    const currentUserId = getCurrentUserId();
    const userIndex = db.users.findIndex((u: User) => u.id === currentUserId);
    if(userIndex === -1) throw new Error("User not found");

    db.users[userIndex].username = username;
    db.users[userIndex].email = email;
    saveDB(db);
    const updatedUser = await fetchUser();
    return simulateDelay({ success: true, updatedUser: updatedUser! });
};

export const deleteCurrentUser = async (): Promise<{ success: boolean }> => {
    const db = getDB();
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return simulateDelay({ success: false });

    // Filter out the user, their skills, and their quests
    db.users = db.users.filter((u: User) => u.id !== currentUserId);
    db.skills = db.skills.filter((s: Skill) => s.userId !== currentUserId);
    db.quests = db.quests.filter((q: Quest) => q.userId !== currentUserId);

    // Remove user from any guilds they are a member of
    db.guilds.forEach((g: Guild) => {
        const memberIndex = g.members.findIndex(m => m.id === currentUserId);
        if (memberIndex > -1) {
            g.members.splice(memberIndex, 1);
            g.memberCount--;
        }
    });

    saveDB(db);
    // The calling function will now handle logging the user out upon success.
    return simulateDelay({ success: true });
};

export const joinGuild = async (guildId: string): Promise<{ success: true; guild: Guild } | { success: false }> => {
    const db = getDB();
    const currentUser = await fetchUser();
    if(!currentUser) return simulateDelay({ success: false });

    const guild = db.guilds.find((g: Guild) => g.id === guildId);
    if (guild && guild.memberCount < guild.maxMembers) {
        guild.memberCount++;
        guild.members.push({ id: currentUser.id, username: currentUser.username, avatarUrl: currentUser.avatarUrl, level: currentUser.level });
        guild.chat.push({id: `msg_${Date.now()}`, username: 'Guild Bot', avatarUrl: '/vite.svg', text: `${currentUser.username} has joined the guild!`, timestamp: new Date().toISOString() });
        saveDB(db);
        return simulateDelay({ success: true, guild });
    }
    return simulateDelay({ success: false });
};

export const contributeToGuildQuest = async (guildId: string): Promise<{ success: boolean; message: string; updatedUser?: User; updatedGuild?: Guild }> => {
    const db = getDB();
    const currentUserId = getCurrentUserId();
    const userIndex = db.users.findIndex((u: User) => u.id === currentUserId);
    const guildIndex = db.guilds.findIndex((g: Guild) => g.id === guildId);

    if (userIndex === -1 || guildIndex === -1) {
        return simulateDelay({ success: false, message: "User or Guild not found." });
    }

    let user = db.users[userIndex];
    let guild = db.guilds[guildIndex];

    if ((user.questsContributedToGuildToday ?? 0) >= (user.questsCompletedToday ?? 0)) {
        return simulateDelay({ success: false, message: "You have no completed quests to contribute today. Complete more quests first!" });
    }
    
    if (guild.quest.isCompleted) {
        return simulateDelay({ success: false, message: "The guild quest is already completed!" });
    }

    // Process contribution
    user.questsContributedToGuildToday = (user.questsContributedToGuildToday ?? 0) + 1;
    guild.quest.progress += 1;
    
    if (!guild.quest.contributors.includes(user.username)) {
        guild.quest.contributors.push(user.username);
    }

    // Give a small reward to the contributor
    const contributionRewardXp = 50;
    user.totalXp += contributionRewardXp;
    
    // Check for quest completion
    if (guild.quest.progress >= guild.quest.target) {
        guild.quest.isCompleted = true;
        // Award XP to all members
        db.users.forEach((u: User, index: number) => {
            const isMember = guild.members.some(m => m.id === u.id);
            if (isMember) {
                db.users[index].totalXp += guild.quest.xpReward;
                db.users[index] = calculateUserStats(db.users[index]);
            }
        });
    }

    db.users[userIndex] = calculateUserStats(user);
    db.guilds[guildIndex] = guild;
    saveDB(db);

    const { password, ...userToReturn } = db.users[userIndex];
    
    const message = guild.quest.isCompleted
        ? `You completed the final quest for the guild! All members received ${guild.quest.xpReward.toLocaleString()} XP!`
        : `Contribution successful! You earned ${contributionRewardXp} XP.`;

    return simulateDelay({
        success: true,
        message,
        updatedUser: userToReturn,
        updatedGuild: guild,
    });
};

export const sendPasswordReset = async (email: string): Promise<{ success: boolean }> => {
    console.log(`Password reset requested for: ${email}. In a real app, an email would be sent.`);
    // Always return success to prevent email enumeration attacks
    return simulateDelay({ success: true });
};