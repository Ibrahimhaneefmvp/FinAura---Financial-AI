
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';
import { PaperAirplaneIcon, UserCircleIcon } from './icons';
import { RocketLaunchIcon } from './icons';
import { SUGGESTED_PROMPTS } from '../constants';

interface ChatProps {
    financialDataSummary: string;
}

const Chat: React.FC<ChatProps> = ({ financialDataSummary }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = useCallback(async (prompt: string) => {
        if (!prompt.trim()) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: prompt };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const modelResponseText = await getChatResponse(prompt, messages, financialDataSummary);
            const modelMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: modelResponseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Failed to get response from Gemini:", error);
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, financialDataSummary]);
    

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                             <RocketLaunchIcon className="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-700" />
                            <h2 className="text-2xl font-bold">Financial AI Assistant</h2>
                            <p className="mt-2">Ask me anything about your finances!</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white"><RocketLaunchIcon className="w-5 h-5"/></div>}
                            <div className={`max-w-xl p-4 rounded-xl ${msg.role === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.role === 'user' && <UserCircleIcon className="w-8 h-8 text-gray-400" />}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-4 justify-start">
                           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white"><RocketLaunchIcon className="w-5 h-5 animate-pulse-fast"/></div>
                            <div className="max-w-xl p-4 rounded-xl bg-gray-100 dark:bg-gray-700">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-4 flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                        <button key={i} onClick={() => handleSendMessage(prompt)} disabled={isLoading} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            {prompt}
                        </button>
                    ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a financial question..."
                        disabled={isLoading}
                        className="flex-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button type="submit" disabled={isLoading} className="p-3 text-white rounded-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
