import { GoogleGenAI, Type } from "@google/genai";
import { Quest, QuestDifficulty, Skill, ChatMessage } from "../types";

// FIX: Adhered to Gemini API guidelines by initializing the client directly and assuming the API key is present. Removed conditional logic.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    const fullHistory = [
        ...history,
        { role: 'user', text: newMessage }
    ];

    // Simple history-to-string conversion
    const contents = fullHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n');

    const prompt = `You are LifeQuest Coach, a friendly, inspiring, and helpful AI assistant for a productivity app. Your tone should be encouraging and positive. A user is chatting with you. Continue the conversation naturally based on the history.

Conversation History:
${contents}

bot: `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
                topK: 1,
                topP: 1,
                maxOutputTokens: 256,
                stopSequences: ["user:", "bot:"], // Stop generation if it starts hallucinating turns
                thinkingConfig: { thinkingBudget: 0 }
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching AI chat response:", error);
        return "I'm having a little trouble connecting right now. Let's try again in a moment!";
    }
};

export const generateQuestsFromSkills = async (skills: Skill['name'][]): Promise<Omit<Quest, 'id' | 'isCompleted' | 'userId' | 'expiryTimestamp'>[]> => {
    const prompt = `
        You are a quest generator for a gamified productivity app called LifeQuest.
        Your task is to create between 5 and 7 engaging and actionable real-life quests for a user.
        The user wants to focus on the following skill areas: ${skills.join(', ')}.
        
        For each quest, provide a title, a short description, a type (must be one of the selected skills), 
        a difficulty ('easy', 'medium', or 'hard'), an appropriate xpReward (e.g., easy=50-100, medium=100-200, hard=200-350),
        and a 'durationMinutes'. The 'durationMinutes' is your estimate of how long the quest should take to complete in minutes.
        Be realistic. Examples: 'Go for a 20-minute walk' should have durationMinutes: 20. 'Read a chapter of a book' might be 45. 'Organize your closet' could be 120.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            type: { type: Type.STRING, enum: skills },
                            difficulty: { type: Type.STRING, enum: [QuestDifficulty.EASY, QuestDifficulty.MEDIUM, QuestDifficulty.HARD] },
                            xpReward: { type: Type.INTEGER },
                            durationMinutes: { type: Type.INTEGER, description: "The estimated time in minutes to complete the quest." },
                        },
                        required: ["title", "description", "type", "difficulty", "xpReward", "durationMinutes"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const generatedQuests = JSON.parse(jsonText);
        return generatedQuests;

    } catch (error) {
        console.error("Error generating quests with Gemini:", error);
        throw new Error("Failed to generate quests from AI. Please try again.");
    }
};