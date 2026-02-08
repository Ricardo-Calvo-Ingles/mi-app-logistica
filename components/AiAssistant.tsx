
import React, { useState, useContext, useRef, useEffect } from 'react';
import { InventoryContext } from '../App';
import { queryGemini } from '../services/geminiService';
import { SendIcon, BoxIcon } from './icons';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export const AiAssistant: React.FC = () => {
    const { inventory, serializedUnits, technicians } = useContext(InventoryContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const inventoryContext = {
                items: inventory,
                units: serializedUnits,
                technicians
            };
            const aiResponse = await queryGemini(input, inventoryContext);
            const aiMessage: Message = { sender: 'ai', text: aiResponse };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error querying Gemini:", error);
            const errorMessage: Message = { sender: 'ai', text: "SYSTEM_ERR: Error en el núcleo de procesamiento." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-altri-orange text-white rounded-2xl p-4 shadow-2xl hover:scale-110 transition-all z-50 border border-white/20"
                aria-label="Open AI Assistant"
            >
                <BoxIcon className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse border-2 border-altri-dark"></div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 w-[400px] h-[600px] glass shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col z-[70] rounded-[2rem] border border-white/10 overflow-hidden animate-slide-in">
            <div className="p-5 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-altri-orange rounded-full animate-pulse"></div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-white">IA_LOGISTICS_KERNEL</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-black/40 font-mono text-[11px] space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-10 opacity-30">
                        <p className="tracking-widest uppercase">Esperando consulta...</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-2xl px-5 py-3 max-w-[85%] ${msg.sender === 'user' ? 'bg-altri-orange text-white shadow-lg' : 'bg-white/5 text-gray-300 border border-white/5'}`}>
                            {msg.sender === 'ai' && <span className="text-altri-orange font-bold mr-2">LOG:</span>}
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-altri-orange animate-pulse">
                           PROCESANDO_NÚCLEO...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-white/5 bg-white/5">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="CONSULTAR DATASET..."
                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-altri-orange transition-all placeholder:text-gray-700"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-altri-orange text-white rounded-xl hover:shadow-[0_0_15px_rgba(255,102,0,0.5)] transition-all disabled:opacity-20">
                        <SendIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
