import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiShield, FiPieChart, FiTarget, FiBarChart2, FiCheck } from 'react-icons/fi';

const features = [
    {
        icon: FiTrendingUp,
        title: 'Smart Tracking',
        desc: 'Automatically categorize transactions and track spending in real time.',
        color: 'indigo',
    },
    {
        icon: FiPieChart,
        title: 'Visual Insights',
        desc: 'Beautiful charts that make your financial data easy to understand.',
        color: 'sky',
    },
    {
        icon: FiTarget,
        title: 'Budget Goals',
        desc: 'Set monthly budgets and get alerts before you overspend.',
        color: 'emerald',
    },
    {
        icon: FiBarChart2,
        title: 'Analytics',
        desc: 'Spot trends and patterns in your spending over time.',
        color: 'violet',
    },
    {
        icon: FiShield,
        title: 'Secure by Default',
        desc: 'Bank-level encryption keeps your financial data safe.',
        color: 'amber',
    },
];

const colorMap = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
    sky: { bg: 'bg-sky-50', icon: 'text-sky-600', border: 'border-sky-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
};

const stats = [
    { value: '100%', label: 'Free to start' },
    { value: '256-bit', label: 'Encryption' },
    { value: 'Real-time', label: 'Data sync' },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: 0.6 + i * 0.1, duration: 0.45, ease: 'easeOut' }
    }),
};

const Landing = () => {
    return (
        <div
            className="min-h-screen bg-slate-50 overflow-x-hidden"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');

        .hero-bg {
          background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%);
          position: relative;
          overflow: hidden;
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .glow-1 {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }
        .glow-2 {
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }
        .mock-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          backdrop-filter: blur(12px);
        }
      `}</style>

            {/* Nav */}
            <motion.nav
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5"
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-xs">FF</div>
                    <span className="text-white font-bold text-lg">FinanceFlow</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-4 py-2"
                    >
                        Sign in
                    </Link>
                    <Link
                        to="/register"
                        className="bg-white text-slate-900 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        Get started
                    </Link>
                </div>
            </motion.nav>

            {/* Hero */}
            <div className="hero-bg min-h-screen flex items-center">
                <div className="grid-overlay" />
                <div className="glow-1" />
                <div className="glow-2" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pt-28 pb-24 flex flex-col lg:flex-row items-center gap-16">
                    {/* Left - Copy */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6"
                        >
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            Free to use · No credit card required
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Take control of<br />
                            <em className="text-indigo-400 not-italic">your finances.</em>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
                        >
                            Track spending, set budgets, and understand your money — all in one beautiful, simple app.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.45 }}
                            className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
                        >
                            <Link to="/register">
                                <motion.div
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-7 py-3.5 rounded-xl text-sm cursor-pointer transition-colors shadow-lg shadow-indigo-500/30"
                                >
                                    Start for free
                                    <FiArrowRight className="w-4 h-4" />
                                </motion.div>
                            </Link>
                            <Link to="/login">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 text-slate-300 hover:text-white font-medium px-5 py-3.5 rounded-xl text-sm cursor-pointer transition-colors border border-white/10 hover:border-white/20"
                                >
                                    Sign in to your account
                                </motion.div>
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center gap-8 mt-12 justify-center lg:justify-start"
                        >
                            {stats.map((s, i) => (
                                <div key={i} className="text-center lg:text-left">
                                    <p className="text-white font-bold text-xl">{s.value}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right - Mock UI */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="flex-1 w-full max-w-sm lg:max-w-md"
                    >
                        <div className="mock-card p-6 space-y-4">
                            {/* Mock header */}
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-slate-400 text-xs">Total Balance</p>
                                    <p className="text-white text-3xl font-bold mt-1">$24,830.00</p>
                                </div>
                                <div className="text-emerald-400 text-xs font-medium flex items-center gap-1 bg-emerald-400/10 px-2.5 py-1.5 rounded-lg">
                                    <FiTrendingUp className="w-3 h-3" />
                                    +8.2%
                                </div>
                            </div>

                            {/* Mock stat pills */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 rounded-xl p-3.5">
                                    <p className="text-slate-400 text-xs mb-1">Income</p>
                                    <p className="text-emerald-400 font-bold">$6,400.00</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3.5">
                                    <p className="text-slate-400 text-xs mb-1">Expenses</p>
                                    <p className="text-red-400 font-bold">$2,180.00</p>
                                </div>
                            </div>

                            {/* Mock transactions */}
                            <div>
                                <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wide">Recent</p>
                                <div className="space-y-2.5">
                                    {[
                                        { name: 'Whole Foods', cat: '🛒 Groceries', amount: '-$84.20', color: 'text-red-400' },
                                        { name: 'Salary', cat: '💼 Income', amount: '+$4,200.00', color: 'text-emerald-400' },
                                        { name: 'Netflix', cat: '🎬 Entertainment', amount: '-$15.99', color: 'text-red-400' },
                                    ].map((tx, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + i * 0.1 }}
                                            className="flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-white text-sm font-medium">{tx.name}</p>
                                                <p className="text-slate-500 text-xs">{tx.cat}</p>
                                            </div>
                                            <p className={`text-sm font-bold ${tx.color}`}>{tx.amount}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Mock budget bar */}
                            <div className="pt-2 border-t border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-slate-400 text-xs">Monthly Budget</p>
                                    <p className="text-slate-300 text-xs font-medium">68% used</p>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '68%' }}
                                        transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                                        className="h-full bg-indigo-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-24 px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-14"
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Everything you need
                        </h2>
                        <p className="text-slate-500 text-lg max-w-lg mx-auto">
                            Powerful tools to help you understand and improve your financial health.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => {
                            const c = colorMap[f.color];
                            return (
                                <motion.div
                                    key={f.title}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={cardVariants}
                                    className={`rounded-2xl p-6 border ${c.border} ${c.bg}`}
                                >
                                    <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                                        <f.icon className={`w-5 h-5 ${c.icon}`} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="hero-bg py-24 px-8 relative overflow-hidden">
                <div className="grid-overlay" />
                <div className="glow-1" style={{ top: '-40%', right: '-20%', opacity: 0.7 }} />
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-2xl mx-auto text-center"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Ready to get started?
                    </h2>
                    <p className="text-slate-400 text-lg mb-10">
                        Join and take control of your financial future — completely free.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/register">
                            <motion.div
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl text-sm cursor-pointer transition-colors shadow-lg shadow-indigo-500/30"
                            >
                                Create free account
                                <FiArrowRight className="w-4 h-4" />
                            </motion.div>
                        </Link>
                        <Link to="/login">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="text-slate-300 hover:text-white font-medium px-5 py-3.5 rounded-xl text-sm cursor-pointer transition-colors border border-white/10 hover:border-white/20"
                            >
                                I already have an account
                            </motion.div>
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-10">
                        {['No credit card required', 'Cancel anytime', 'Free forever plan'].map((t, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-slate-400 text-xs">
                                <FiCheck className="w-3 h-3 text-emerald-400" />
                                {t}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="bg-slate-900 py-8 px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white" style={{ fontSize: '10px' }}>FF</div>
                        <span className="text-slate-400 text-sm font-medium">FinanceFlow</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                        © {new Date().getFullYear()} FinanceFlow. Built for personal use.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Landing;