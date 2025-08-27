
import { Type } from "@google/genai";
import type { SkillCategory } from './types';

export const APP_NAME = "LifeQuest";

export const MOCK_USER = {
  id: 'user-123',
  username: 'HeroPlayer',
  email: 'hero@lifequest.app',
  level: 5,
  xp: 150,
  xpToNextLevel: 500,
  avatarUrl: 'https://picsum.photos/seed/user123/100/100',
  isPremium: false,
  dailyQuestRefreshes: 3,
  skills: [
    { category: 'Fitness' as SkillCategory, level: 3, xp: 120, xpToNextLevel: 300 },
    { category: 'Learning' as SkillCategory, level: 4, xp: 50, xpToNextLevel: 400 },
    { category: 'Social' as SkillCategory, level: 2, xp: 200, xpToNextLevel: 250 },
    { category: 'Career' as SkillCategory, level: 2, xp: 80, xpToNextLevel: 250 },
  ],
};

export const QUEST_GENERATION_SCHEMA = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: 'A short, engaging title for the quest (max 10 words).',
            },
            description: {
                type: Type.STRING,
                description: 'A brief, clear description of the task (max 30 words).',
            },
            category: {
                type: Type.STRING,
                description: 'The skill category this quest belongs to.',
                enum: ['Fitness', 'Learning', 'Social', 'Career', 'Hobbies', 'Mindfulness'],
            },
            xp: {
                type: Type.INTEGER,
                description: 'Experience points awarded, between 10 and 100, based on difficulty.',
            },
        },
        required: ['title', 'description', 'category', 'xp'],
    },
};
