import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiShield, FiPieChart, FiTarget, FiBarChart2, FiCheck, FiZap } from 'react-icons/fi';

const G = 'linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)';

const features = [
    { icon: FiTrendingUp, title: 'Smart Tracking', desc: 'Automatically categorize transactions and track spending in real time.', color: '#d946ef' },
    { icon: FiPieChart, title: 'Visual Insights', desc: 'Beautiful charts that make your financial data easy to understand.', color: '#7c3aed' },
    { icon: FiTarget, title: 'Budget Goals', desc: 'Set monthly budgets and get alerts before you overspend.', color: '#10b981' },
    { icon: FiBarChart2, title: 'Analytics', desc: 'Spot trends and patterns in your spending over time.', color: '#f97316' },
    { icon: FiShield, title: 'Secure by Default', desc: 'Bank-level encryption keeps your financial data safe.', color: '#ec4899' },
    { icon: FiZap, title: 'AI Advisor', desc: 'Get personalised financial advice powered by GPT-4.', color: '#f59e0b' },
];

const stats = [
    { value: '100%', label: 'Free to start' },
    { value: '256-bit', label: 'Encryption' },
    { value: 'Real-time', label: 'Data sync' },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.5 + i * 0.08, duration: 0.45, ease: 'easeOut' } }),
};

const Landing = () => (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');
      .hero-bg {
        background: linear-gradient(145deg, #0a0812 0%, #1a0a2e 45%, #0f0d1a 100%);
        position: relative; overflow: hidden;
      }
      .grid-overlay {
        position: absolute; inset: 0;
        background-image: linear-gradient(rgba(217,70,239,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(217,70,239,0.04) 1px,transparent 1px);
        background-size: 52px 52px;
      }
      .glow-fuchsia {
        position: absolute; border-radius: 50%; pointer-events: none;
        top: -20%; right: -10%; width: 700px; height: 700px;
        background: radial-gradient(circle, rgba(217,70,239,0.2) 0%, transparent 65%);
      }
      .glow-violet {
        position: absolute; border-radius: 50%; pointer-events: none;
        bottom: -30%; left: -10%; width: 500px; height: 500px;
        background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%);
      }
      .mock-card {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(217,70,239,0.2);
        border-radius: 20px;
        backdrop-filter: blur(12px);
      }
      .ff-glow { box-shadow: 0 0 20px rgba(217,70,239,0.5); }
    `}</style>

        {/* Nav */}
        <motion.nav
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5"
        >
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs ff-glow" style={{ background: G }}>FF</div>
                <span className="text-white font-bold text-lg">FinanceFlow</span>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-4 py-2">Sign in</Link>
                <Link to="/register" className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all ff-glow" style={{ background: G }}>
                    Get started
                </Link>
            </div>
        </motion.nav>

        {/* Hero */}
        <div className="hero-bg min-h-screen flex items-center">
            <div className="grid-overlay" /><div className="glow-fuchsia" /><div className="glow-violet" />
            <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pt-28 pb-24 flex flex-col lg:flex-row items-center gap-16">
                {/* Left */}
                <div className="flex-1 text-center lg:text-left">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 bg-white/10 border border-fuchsia-500/20 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse" />
                        Free to use · No credit card required
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        Take control of<br />
                        <em className="not-italic" style={{ background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your finances.</em>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                        Track spending, set budgets, and understand your money — all in one beautiful, simple app.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                        className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                        <Link to="/register">
                            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl text-sm cursor-pointer ff-glow"
                                style={{ background: G }}>
                                Start for free <FiArrowRight className="w-4 h-4" />
                            </motion.div>
                        </Link>
                        <Link to="/login">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 text-slate-300 hover:text-white font-medium px-5 py-3.5 rounded-xl text-sm cursor-pointer transition-colors border border-white/10 hover:border-fuchsia-500/30">
                                Sign in to your account
                            </motion.div>
                        </Link>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                        className="flex items-center gap-10 mt-12 justify-center lg:justify-start">
                        {stats.map((s, i) => (
                            <div key={i}>
                                <p className="text-white font-bold text-xl" style={{ background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</p>
                                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right — Mock card */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex-1 w-full max-w-sm lg:max-w-md">
                    <div className="mock-card p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs">Total Balance</p>
                                <p className="text-white text-3xl font-bold mt-1">$24,830.00</p>
                            </div>
                            <div className="text-emerald-400 text-xs font-semibold flex items-center gap-1 bg-emerald-400/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                                <FiTrendingUp className="w-3 h-3" /> +8.2%
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[{ label: 'Income', val: '$6,400.00', c: 'text-emerald-400' }, { label: 'Expenses', val: '$2,180.00', c: 'text-red-400' }].map(s => (
                                <div key={s.label} className="bg-white/5 border border-white/5 rounded-xl p-3.5">
                                    <p className="text-slate-400 text-xs mb-1">{s.label}</p>
                                    <p className={`font-bold ${s.c}`}>{s.val}</p>
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-semibold mb-3 uppercase tracking-wide">Recent</p>
                            <div className="space-y-3">
                                {[
                                    { name: 'Whole Foods', cat: '🛒 Groceries', amount: '-$84.20', c: 'text-red-400' },
                                    { name: 'Salary', cat: '💼 Income', amount: '+$4,200.00', c: 'text-emerald-400' },
                                    { name: 'Netflix', cat: '🎬 Entertainment', amount: '-$15.99', c: 'text-red-400' },
                                ].map((tx, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
                                        className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white text-sm font-medium">{tx.name}</p>
                                            <p className="text-slate-500 text-xs">{tx.cat}</p>
                                        </div>
                                        <p className={`text-sm font-bold ${tx.c}`}>{tx.amount}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="pt-3 border-t border-fuchsia-500/10">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-slate-400 text-xs">Monthly Budget</p>
                                <p className="text-slate-300 text-xs font-semibold">68% used</p>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ delay: 1, duration: 0.9, ease: 'easeOut' }}
                                    className="h-full rounded-full ff-glow" style={{ background: G }} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Features */}
        <div className="bg-white py-24 px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Everything you need</h2>
                    <p className="text-slate-500 text-lg max-w-lg mx-auto">Powerful tools to help you understand and improve your financial health.</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f, i) => (
                        <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants}
                            className="rounded-2xl p-6 border border-slate-100 bg-slate-50 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-105 transition-transform"
                                style={{ background: `linear-gradient(135deg,${f.color},${f.color}99)` }}>
                                <f.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>

        {/* CTA */}
        <div className="hero-bg py-24 px-8 relative overflow-hidden">
            <div className="grid-overlay" /><div className="glow-fuchsia" style={{ top: '-40%', right: '-20%', opacity: 0.8 }} />
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Ready to get started?
                </h2>
                <p className="text-slate-400 text-lg mb-10">Join and take control of your financial future — completely free.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link to="/register">
                        <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl text-sm cursor-pointer ff-glow"
                            style={{ background: G }}>
                            Create free account <FiArrowRight className="w-4 h-4" />
                        </motion.div>
                    </Link>
                    <Link to="/login">
                        <motion.div whileHover={{ scale: 1.02 }}
                            className="text-slate-300 hover:text-white font-medium px-5 py-3.5 rounded-xl text-sm cursor-pointer transition-colors border border-white/10 hover:border-fuchsia-500/30">
                            I already have an account
                        </motion.div>
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-8 mt-10">
                    {['No credit card required', 'Cancel anytime', 'Free forever plan'].map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <FiCheck className="w-3 h-3 text-fuchsia-400" />{t}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-[#0a0812] py-8 px-8 border-t border-fuchsia-950/30">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white ff-glow" style={{ fontSize: '10px', background: G }}>FF</div>
                    <span className="text-slate-400 text-sm font-medium">FinanceFlow</span>
                </div>
                <p className="text-slate-700 text-xs">© {new Date().getFullYear()} FinanceFlow. Built for personal use.</p>
            </div>
        </div>
    </div>
);

export default Landing;