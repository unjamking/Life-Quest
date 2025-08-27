
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Quest, SkillCategory } from '../types';
import { QUEST_GENERATION_SCHEMA } from '../constants';

const API_KEY = process.env.API_KEY;

const useMock = !API_KEY;
let ai: GoogleGenAI | null = null;
if (!useMock) {
  ai = new GoogleGenAI({ apiKey: API_KEY as string });
}

// MOCK DATA
// FIX: Updated type to Omit 'userId' as it's not available at this stage and is added later. This resolves the errors on lines 16-21.
const MOCK_QUESTS: Omit<Quest, 'id' | 'status' | 'userId'>[] = [
    { title: "Morning Mobility Flow", description: "Complete a 10-minute stretching or yoga routine.", category: "Fitness", xp: 25 },
    { title: "Read a Chapter", description: "Read one chapter of a non-fiction book.", category: "Learning", xp: 30 },
    { title: "Connect with a Friend", description: "Call or message a friend you haven't spoken to this week.", category: "Social", xp: 40 },
    { title: "Plan Your Top 3 Tasks", description: "Identify and write down your three most important tasks for the day.", category: "Career", xp: 20 },
    { title: "Creative Doodle", description: "Spend 15 minutes doodling or sketching without a specific goal.", category: "Hobbies", xp: 35 },
    { title: "Mindful Minute", description: "Practice one minute of focused breathing, paying attention to your breath.", category: "Mindfulness", xp: 15 },
];


export const generateQuests = async (categories: SkillCategory[], mood: string): Promise<Omit<Quest, 'id' | 'status' | 'userId'>[]> => {
    if (useMock || !ai) {
        console.log("Using mock quest generation.");
        // Filter mock quests by selected categories, or return a random mix if none selected
        const selectedCategories = categories.length > 0 ? categories : MOCK_QUESTS.map(q => q.category);
        return MOCK_QUESTS.filter(q => selectedCategories.includes(q.category)).slice(0, 5);
    }
    
    const prompt = `You are the Gamemaster for LifeQuest, a life RPG. Your goal is to create inspiring and engaging real-world quests.
    Generate 5 actionable quests for a user.
    
    User's chosen skill categories: ${categories.length > 0 ? categories.join(', ') : 'Any'}.
    User's current mood: "${mood || 'not specified'}".
    
    RULES:
    - The quests must be completable within a day.
    - Tailor the difficulty and nature of quests to the user's mood. For example, if they're "tired", suggest low-energy, restorative tasks. If "energetic", suggest more active quests.
    - Be creative and specific. Instead of "Exercise", suggest "Try a 10-minute beginner's HIIT workout video on YouTube".
    - Ensure a diverse mix of tasks if multiple categories are selected.
    - The XP value should reflect the quest's relative difficulty and time commitment (10-100).
    - Output ONLY the valid JSON array matching the provided schema. Do not include any other text or markdown formatting.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: QUEST_GENERATION_SCHEMA,
            },
        });
        const jsonString = response.text.trim();
        const generatedQuests = JSON.parse(jsonString);
        return generatedQuests as Omit<Quest, 'id' | 'status' | 'userId'>[];
    } catch (error) {
        console.error("Error generating quests with Gemini:", error);
        return MOCK_QUESTS.slice(0, 5); // Fallback to mock data on API error
    }
};

export const verifyQuestProof = async (questTitle: string, notes: string, image?: File): Promise<{ success: boolean; feedback: string }> => {
    if (useMock || !ai) {
        console.log("Using mock quest verification.");
        return new Promise(resolve => setTimeout(() => resolve({ success: true, feedback: "Great job! Your dedication is inspiring. Quest approved!" }), 1500));
    }
    
    const prompt = `You are an AI Quest Verifier for LifeQuest. Your role is to be fair, encouraging, and clear.
    A user has submitted proof for the quest: "${questTitle}".
    
    User's notes: "${notes}"
    ${image ? "An image proof was also provided. Assume it's relevant unless the notes strongly contradict it." : "No image was provided."}
    
    VERIFICATION TASK:
    1. Analyze the user's notes to determine if they plausibly completed the quest.
    2. Be encouraging and positive, even if denying the quest. Focus on what they can do next time.
    3. Your feedback should be short, friendly, and under 25 words.
    
    Respond ONLY with a valid JSON object in the format: {"success": boolean, "feedback": "your short, encouraging message"}.`;
    
    // FIX: Explicitly type the 'parts' array to handle multimodal content (text and images).
    // The previous implementation inferred a text-only type, causing an error when adding an image part.
    // Also, convert the provided image file to a base64 string as required by the Gemini API.
    const textPart = { text: prompt };
    const parts: ({ text: string; } | { inlineData: { mimeType: string; data: string; }; })[] = [textPart];
    
    if (image) {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
      });
      parts.push({ inlineData: { mimeType: image.type, data: base64Data } });
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts },
             config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        success: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING }
                    },
                    required: ['success', 'feedback'],
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error verifying quest proof:", error);
        return { success: true, feedback: "Verification system is offline. Approved automatically!" };
    }
};

export const moderateText = async (text: string): Promise<{ safe: boolean; reason?: string, category?: string }> => {
    if (useMock || !ai) {
        console.log("Using mock text moderation.");
        const isBad = text.toLowerCase().includes('badword');
        return { safe: !isBad, reason: isBad ? "Inappropriate language detected." : undefined, category: isBad ? "Explicit Content" : "None" };
    }
    
    const prompt = `You are a content moderation AI. Analyze the following text for harmful content based on these categories: Hate Speech, Harassment, Explicit Content, Self-Harm.
    Text: "${text}"
    Respond ONLY with a valid JSON object in the format: {"safe": boolean, "reason": "A brief explanation if not safe.", "category": "The specific category if not safe, otherwise 'None'"}.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        safe: { type: Type.BOOLEAN },
                        reason: { type: Type.STRING },
                        category: { type: Type.STRING }
                    },
                    required: ['safe'],
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error moderating text:", error);
        return { safe: true };
    }
};

let chat: Chat | null = null;

export const getCoachResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> => {
    if (useMock || !ai) {
        console.log("Using mock AI coach.");
        return "Remember, every small step forward is still progress. You're doing great!";
    }

    try {
        if (!chat || history.length <= 1) { // Reset if it's a new conversation
            chat = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                systemInstruction: `You are Sparky, the LifeQuest AI Coach! 🤸 Your personality is 110% enthusiastic, positive, and supportive. You're like a pocket-sized cheerleader!
        
                YOUR MISSION:
                - Be the user's #1 fan. Celebrate their wins, big or small!
                - Provide motivational boosts and actionable, bite-sized self-improvement tips.
                - Help users understand app features if they ask.
                - ALWAYS keep your replies short, sweet, and to the point (under 70 words).
                - Use emojis to convey energy and friendliness! ✨🚀🎉
                
                Let's make every day a new adventure! Ready, set, GO!`,
              },
              history: history.slice(0, -1), // Pass all but the latest message as history
            });
        }
        
        const lastMessage = history[history.length - 1].parts[0].text;
        const result = await chat.sendMessage({ message: lastMessage });

        return result.text;
    } catch (error) {
        console.error("Error with AI coach:", error);
        chat = null; // Reset chat on error
        return "I'm having a little trouble connecting right now, but remember to stay positive!";
    }
};
