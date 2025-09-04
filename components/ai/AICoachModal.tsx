import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Bot } from 'lucide-react';
import { getAIChatResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import { modalContentVariants, modalOverlayVariants } from '../../utils/animations';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'bot', text: "Hello! I'm your LifeQuest Coach. How can I help you level up your life today?" }]);
    }
  }, [isOpen, messages.length]);
  
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponseText = await getAIChatResponse(messages, userInput);
      const newBotMessage: ChatMessage = { role: 'bot', text: botResponseText };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { role: 'bot', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <motion.div 
      variants={modalOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <motion.div
        variants={modalContentVariants}
        className="bg-light-2 dark:bg-dark-2 rounded-2xl shadow-2xl w-full max-w-md flex flex-col border border-light-3 dark:border-dark-3 h-[calc(100vh-8rem)] max-h-[700px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-light-3 dark:border-dark-3 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-purple/10 p-2 rounded-full">
                <Sparkles className="w-6 h-6 text-brand-purple" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-dark-1 dark:text-light-1">AI Coach</h2>
                <p className="text-xs text-dark-3 dark:text-light-3">Your personal guide to success</p>
            </div>
          </div>
          <button onClick={onClose} className="text-dark-3 dark:text-light-3 hover:text-dark-1 dark:hover:text-light-1 p-1 rounded-full hover:bg-light-1 dark:hover:bg-dark-3">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <AnimatePresence>
            {messages.map((msg, index) => (
                <motion.div 
                    key={index} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'bot' && <div className="flex-shrink-0 bg-gradient-to-br from-brand-purple to-brand-purple-light text-white rounded-full h-9 w-9 flex items-center justify-center shadow-sm"><Bot size={20}/></div>}
                    <div className={`max-w-xs md:max-w-sm px-4 py-3 ${msg.role === 'user' ? 'bg-gradient-to-br from-brand-purple to-brand-purple-light text-white rounded-3xl rounded-br-lg shadow-md' : 'bg-light-1 dark:bg-dark-3 text-dark-1 dark:text-light-1 rounded-3xl rounded-bl-lg border border-light-3 dark:border-dark-3'}`}>
                       <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                </motion.div>
            ))}
            </AnimatePresence>
            {isLoading && (
                 <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-3 justify-start">
                    <div className="flex-shrink-0 bg-gradient-to-br from-brand-purple to-brand-purple-light text-white rounded-full h-9 w-9 flex items-center justify-center shadow-sm"><Bot size={20}/></div>
                    <div className="max-w-xs md:max-w-sm px-4 py-3 rounded-3xl rounded-bl-lg bg-light-1 dark:bg-dark-3 text-dark-1 dark:text-light-1 border border-light-3 dark:border-dark-3">
                       <div className="flex items-center justify-center gap-1.5">
                           <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                           <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                           <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce"></span>
                       </div>
                    </div>
                </motion.div>
            )}
            <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-light-3 dark:border-dark-3 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask your coach anything..."
                    className="w-full bg-light-1 dark:bg-dark-1 border-2 border-transparent focus:border-brand-purple rounded-full py-2.5 px-5 focus:outline-none focus:ring-0 text-dark-1 dark:text-light-1 transition-colors"
                    disabled={isLoading}
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    disabled={isLoading || !userInput.trim()}
                    className="bg-brand-purple hover:bg-brand-purple-light text-white font-semibold p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    aria-label="Send message"
                >
                    <Send className="w-5 h-5" />
                </motion.button>
            </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AICoachModal;
