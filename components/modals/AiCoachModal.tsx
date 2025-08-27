import React, { useState, useEffect, useRef } from 'react';
import * as GeminiService from '../../services/geminiService';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';

type ChatHistory = { role: 'user' | 'model', parts: { text: string }[] };

const AiCoachModal: React.FC = () => {
    const [history, setHistory] = useState<ChatHistory[]>([
        { role: 'model', parts: [{ text: "Hello! I'm your personal coach. How can I help you stay motivated today?" }] }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatHistory = { role: 'user', parts: [{ text: input }] };
        const newHistory = [...history, userMessage];
        setHistory(newHistory);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await GeminiService.getCoachResponse(newHistory);
            const modelMessage: ChatHistory = { role: 'model', parts: [{ text: responseText }] };
            setHistory(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: ChatHistory = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now." }] };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md">
                {history.map((item, index) => (
                    <div key={index} className={`flex items-start gap-3 ${item.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`p-3 rounded-lg max-w-xs ${item.role === 'model' ? 'bg-blue-100 text-[#1a1a1a]' : 'bg-[#0544E3] text-white'}`}>
                            <p className="text-sm">{item.parts[0].text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg bg-blue-100">
                           <LoadingSpinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for advice..."
                    className="flex-1 bg-white border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#0544E3] placeholder:text-gray-500"
                    disabled={isLoading}
                />
                <Button type="submit" className="!rounded-full !p-3" disabled={isLoading || !input.trim()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </Button>
            </form>
        </div>
    );
};

export default AiCoachModal;