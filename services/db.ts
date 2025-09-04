import { Heart, BrainCircuit, Users, Zap, Palette, Droplets, Banknote } from 'lucide-react';
import type { User, Skill, Quest, Guild } from '../types';
import type { ComponentType } from 'react';

const DB_KEY = 'lifequest_db_v1';

// Icons cannot be stringified, so we map them by name
export const iconMap: Record<Skill['name'], ComponentType<{ className?: string }>> = {
    Fitness: Heart,
    Learning: BrainCircuit,
    Social: Users,
    Productivity: Zap,
    Creativity: Palette,
    Mindfulness: Droplets,
    Finance: Banknote
};

// Define skill templates without user-specific data or the icon component
const SKILL_TEMPLATES: { name: Skill['name'] }[] = [
    { name: 'Fitness' },
    { name: 'Learning' },
    { name: 'Social' },
    { name: 'Productivity' },
    { name: 'Creativity' },
    { name: 'Mindfulness' },
    { name: 'Finance' },
];

// This function will be used by mockApi to create skills for a new user
export const createSkillsForUser = (userId: string): Omit<Skill, 'icon'>[] => {
    return SKILL_TEMPLATES.map((template, i) => ({
        id: `skill_${i + 1}_${userId}`,
        name: template.name,
        level: 1,
        xp: 0,
        xpForNextLevel: 100,
        userId: userId,
    }));
};

const INITIAL_DATA = {
  users: [],
  skills: [],
  quests: [],
  guilds: [],
};

const getInitialData = () => JSON.parse(JSON.stringify(INITIAL_DATA));

export const initDB = () => {
  if (!localStorage.getItem(DB_KEY)) {
    console.log("Initializing fresh database in localStorage...");
    localStorage.setItem(DB_KEY, JSON.stringify(getInitialData()));
  }
};

export const getDB = () => {
    try {
        const dbString = localStorage.getItem(DB_KEY);
        if (!dbString) {
            initDB();
            return getInitialData();
        }
        const db = JSON.parse(dbString);
        // Re-hydrate icons on skills
        db.skills = db.skills.map((skill: Skill) => ({
            ...skill,
            icon: iconMap[skill.name]
        }));
        return db;
    } catch (error) {
        console.error("Failed to parse DB from localStorage, resetting.", error);
        resetDB();
        return getInitialData();
    }
};

export const saveDB = (db: any) => {
    try {
        // Create a copy to modify without affecting the running app's state
        const dbToSave = JSON.parse(JSON.stringify(db));
        // Remove non-serializable icon components before saving
        if (dbToSave.skills) {
            dbToSave.skills = dbToSave.skills.map((skill: { icon: any; }) => {
                const { icon, ...rest } = skill;
                return rest;
            });
        }
        localStorage.setItem(DB_KEY, JSON.stringify(dbToSave));
    } catch (error) {
        console.error("Failed to save DB to localStorage.", error);
    }
};

export const resetDB = () => {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem('currentUserId');
  initDB();
};