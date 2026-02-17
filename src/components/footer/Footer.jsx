import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiHome, FiCreditCard, FiTrendingUp,
    FiTarget, FiBarChart2, FiHeart
} from 'react-icons/fi';

const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Accounts', href: '/accounts', icon: FiCreditCard },
    { name: 'Transactions', href: '/transactions', icon: FiTrendingUp },
    { name: 'Budgets', href: '/budgets', icon: FiTarget },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart2 },
];

const Footer = () => {
    const location = useLocation();
    const year = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-auto border-t border-slate-100 bg-white px-6 py-5"
        >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Brand */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center font-bold text-white" style={{ fontSize: '10px' }}>
                        FF
                    </div>
                    <span className="text-sm font-semibold text-slate-700">FinanceFlow</span>
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
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                <link.icon style={{ width: '12px', height: '12px' }} />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Copyright */}
                <p className="text-xs text-slate-400 flex items-center gap-1">
                    © {year} FinanceFlow
                    <span className="mx-1 text-slate-200">·</span>
                    Made with <FiHeart className="w-3 h-3 text-red-400 mx-0.5" fill="currentColor" />
                </p>
            </div>
        </motion.footer>
    );
};

export default Footer;