
export enum Screen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  LEADERBOARD = 'LEADERBOARD',
  GUILDS = 'GUILDS',
  SHOP = 'SHOP',
  PROFILE = 'PROFILE',
}

export enum ModalType {
  PREFERENCES = 'PREFERENCES',
  PROOF_UPLOAD = 'PROOF_UPLOAD',
  REWARDED_AD = 'REWARDED_AD',
  AI_COACH = 'AI_COACH',
  LEGAL = 'LEGAL',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  CREATE_GUILD = 'CREATE_GUILD',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  AVATAR_EDITOR = 'AVATAR_EDITOR',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
}

export enum QuestStatus {
  INCOMPLETE = 'INCOMPLETE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export type SkillCategory = 'Fitness' | 'Learning' | 'Social' | 'Career' | 'Hobbies' | 'Mindfulness';

export const QUEST_CATEGORIES: SkillCategory[] = ['Fitness', 'Learning', 'Social', 'Career', 'Hobbies', 'Mindfulness'];

export interface Skill {
  category: SkillCategory;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  avatarUrl: string;
  isPremium: boolean;
  dailyQuestRefreshes: number;
  skills: Skill[];
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: SkillCategory;
  xp: number;
  status: QuestStatus;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  level: number;
  xp: number;
  avatarUrl: string;
  isCurrentUser: boolean;
}

export interface ChatMessage {
  id: string;
  username: string;
  avatarUrl: string;
  message: string;
  timestamp: string;
  isSelf: boolean;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Guild {
    id: string;
    name: string;
    avatarUrl: string;
    description: string;
    members: number;
    capacity: number;
    isPrivate: boolean;
}