import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiHome, FiCreditCard, FiTrendingUp,
    FiTarget, FiBarChart2, FiHeart, FiMessageSquare,
} from 'react-icons/fi';

const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Accounts', href: '/accounts', icon: FiCreditCard },
    { name: 'Transactions', href: '/transactions', icon: FiTrendingUp },
    { name: 'Budgets', href: '/budgets', icon: FiTarget },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart2 },
    { name: 'AI Advisor', href: '/ai-advisor', icon: FiMessageSquare },
];

const Footer = () => {
    const location = useLocation();
    const year = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-auto border-t border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-5 transition-colors duration-300"
        >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Brand */}
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-white"
                        style={{ fontSize: '10px', background: 'linear-gradient(135deg, #7c3aed, #c026d3)' }}
                    >
                        FF
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">FinanceFlow</span>
                </div>

                {/* Quick links */}
                <div className="flex items-center gap-1 flex-wrap justify-center">
                    {navLinks.map((link) => {
                        const active = location.pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${active
                                        ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <link.icon style={{ width: '12px', height: '12px' }} />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Copyright */}
                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    © {year} FinanceFlow
                    <span className="mx-1 text-slate-200 dark:text-slate-700">·</span>
                    Made with <FiHeart className="w-3 h-3 text-rose-400 mx-0.5" fill="currentColor" />
                </p>
            </div>
        </motion.footer>
    );
};

export default Footer;