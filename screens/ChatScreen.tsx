import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

const MOCK_MESSAGES: Omit<ChatMessage, 'id' | 'isSelf'>[] = [
    { username: 'AlphaPlayer', avatarUrl: 'https://picsum.photos/seed/user1/100/100', message: "Just hit level 15! The new quests are tough.", timestamp: "10:30 AM" },
    { username: 'QuestMaster', avatarUrl: 'https://picsum.photos/seed/user2/100/100', message: "Congrats! Any tips for the 'Mindful Marathon' quest?", timestamp: "10:31 AM" },
];

const ChatScreen: React.FC = () => {
    const { user } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initialMessages = MOCK_MESSAGES.map((msg, i) => ({
            ...msg,
            id: `msg-${i}`,
            isSelf: false
        }));
        setMessages(initialMessages);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user) return;
        
        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            username: user.username,
            avatarUrl: user.avatarUrl,
            message: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSelf: true
        };
        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
                        <img src={msg.avatarUrl} alt={msg.username} className="w-8 h-8 rounded-full"/>
                        <div className={`p-3 rounded-lg max-w-xs ${msg.isSelf ? 'bg-blue-100 text-[#1a1a1a]' : 'bg-white text-[#1a1a1a]'}`}>
                            {!msg.isSelf && <p className="text-xs font-bold text-blue-600">{msg.username}</p>}
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 text-right ${msg.isSelf ? 'text-gray-500' : 'text-gray-400'}`}>{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#0544E3] focus:border-[#0544E3] placeholder:text-gray-500"
                />
                <Button type="submit" className="!rounded-full !p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </Button>
            </form>
        </div>
    );
};

export default ChatScreen;