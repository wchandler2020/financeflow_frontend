import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useAIChat } from '../hooks/useAIAdvisor';
import { useTheme } from '../components/theme/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMessageSquare, FiZap, FiUser } from 'react-icons/fi';

const SUGGESTED = [
    'How am I doing financially this month?',
    'Where am I spending the most?',
    'How can I save more money?',
    'Am I on track with my budgets?',
];

const TypingDots = () => (
    <div className="flex items-center gap-1.5 py-1">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-400 dark:bg-violet-500"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
            />
        ))}
    </div>
);

const AIAdvisor = () => {
    const { isDark } = useTheme();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your AI financial advisor. I can help you understand your spending, create budgets, and make better financial decisions. What would you like to know?",
        },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const chatMutation = useAIChat();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, chatMutation.isPending]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [input]);

    const handleSend = async () => {
        if (!input.trim() || chatMutation.isPending) return;
        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        try {
            const response = await chatMutation.mutateAsync(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const onSuggestion = (q) => {
        setInput(q);
        textareaRef.current?.focus();
    };

    const hasOnlyWelcome = messages.length === 1;

    return (
        <Layout>
            {/* Wrapper: fills the layout's flex-1 area */}
            <div className="flex flex-col h-[calc(100vh-10rem)] rounded-2xl overflow-hidden border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">

                {/* ── Header ── */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg,#7c3aed22,#c026d322)' }}>
                        <FiZap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Financial Advisor</h1>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Powered by GPT-4 · Analysing your financial data</p>
                    </div>
                    {/* live pulse */}
                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                    </div>
                </div>

                {/* ── Messages ── */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* Avatar — assistant only */}
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center self-end mb-1"
                                        style={{ background: 'linear-gradient(135deg, #7c3aed, #c026d3)' }}>
                                        <FiZap className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'text-white rounded-br-sm'
                                        : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-gray-700 rounded-bl-sm'
                                        }`}
                                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #7c3aed, #9333ea)' } : {}}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>

                                {/* Avatar — user only */}
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center self-end mb-1 bg-slate-200 dark:bg-gray-700">
                                        <FiUser className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    {chatMutation.isPending && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center self-end mb-1"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #c026d3)' }}>
                                <FiZap className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                <TypingDots />
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* ── Suggested questions ── */}
                {hasOnlyWelcome && (
                    <div className="px-5 py-3 bg-slate-50 dark:bg-gray-950 border-t border-slate-100 dark:border-gray-800">
                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Try asking…</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {SUGGESTED.map((q, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onSuggestion(q)}
                                    className="text-left px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300 transition-all duration-200 font-medium"
                                >
                                    {q}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Input bar ── */}
                <div className="px-5 py-4 bg-white dark:bg-gray-900 border-t border-slate-100 dark:border-gray-800 transition-colors duration-300">
                    <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask me about your finances…"
                                rows={1}
                                disabled={chatMutation.isPending}
                                className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all duration-200
                  bg-slate-50 dark:bg-gray-800
                  text-slate-900 dark:text-slate-100
                  placeholder:text-slate-400 dark:placeholder:text-slate-500
                  border border-slate-200 dark:border-gray-700
                  focus:border-violet-400 dark:focus:border-violet-600
                  focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/40
                  disabled:opacity-60"
                                style={{ minHeight: '48px', maxHeight: '120px' }}
                            />
                        </div>
                        <motion.button
                            onClick={handleSend}
                            disabled={!input.trim() || chatMutation.isPending}
                            whileHover={input.trim() && !chatMutation.isPending ? { scale: 1.05 } : {}}
                            whileTap={input.trim() && !chatMutation.isPending ? { scale: 0.95 } : {}}
                            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md"
                            style={
                                input.trim() && !chatMutation.isPending
                                    ? { background: 'linear-gradient(135deg, #7c3aed, #9333ea)', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }
                                    : { background: isDark ? '#374151' : '#e2e8f0' }
                            }
                        >
                            <FiSend className={`w-4 h-4 ${input.trim() && !chatMutation.isPending ? 'text-white' : 'text-slate-400'}`} />
                        </motion.button>
                    </div>
                    <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-2">
                        AI responses may not be perfectly accurate. Verify important financial decisions.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default AIAdvisor;