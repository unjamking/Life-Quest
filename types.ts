// FIX: Import ComponentType to resolve 'Cannot find namespace React' error.
import type { ComponentType } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  level: number;
  xp: number;
  // FIX: Add totalXp to the User type to align with its usage in the mock API for level calculation.
  totalXp: number;
  xpForNextLevel: number;
  rankTitle: string;
  coins: number;
  isPremium: boolean;
  questsCompleted: number;
  questsCompletedToday: number;
  refreshesUsedToday: number;
  lastLoginDate: string;
  currentStreak: number;
  longestStreak: number;
  questsContributedToGuildToday: number;
}

export interface Skill {
  id: string;
  name: "Fitness" | "Learning" | "Social" | "Productivity" | "Creativity" | "Mindfulness" | "Finance";
  icon: ComponentType<{ className?: string }>;
  level: number;
  xp: number;
  xpForNextLevel: number;
  userId: string;
}

export enum QuestDifficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard'
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: Skill['name'];
  difficulty: QuestDifficulty;
  xpReward: number;
  isCompleted: boolean;
  userId: string;
  durationMinutes?: number; // AI-suggested duration in minutes
  startTimestamp?: number; // The timestamp when the user started the quest
  expiryTimestamp?: number; // The timestamp when the quest expires
}

export interface GuildQuest extends Quest {
    progress: number;
    target: number;
    contributors: string[]; // Usernames of contributors
}

export interface LeaderboardUser {
    rank: number;
    id: string;
    username: string;
    avatarUrl: string;
    level: number;
    totalXp: number;
}

export interface GuildMember {
    id: string;
    username: string;
    avatarUrl: string;
    level: number;
}

export interface GuildChatMessage {
    id: string;
    username: string;
    avatarUrl: string;
    text: string;
    timestamp: string;
}


export interface Guild {
    id:string;
    name: string;
    description: string;
    imageUrl: string;
    memberCount: number;
    maxMembers: number;
    isPrivate: boolean;
    members: GuildMember[];
    chat: GuildChatMessage[];
    quest: GuildQuest;
}

export interface ChatMessage {
    role: 'user' | 'bot';
    text: string;
}