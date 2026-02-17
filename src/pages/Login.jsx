import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { FiMail, FiLock, FiTrendingUp, FiShield, FiPieChart, FiCheck } from 'react-icons/fi';

const G = 'linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)';

const features = [
  { icon: FiTrendingUp, text: 'Track income & expenses in real time' },
  { icon: FiPieChart, text: 'Visual insights into your spending' },
  { icon: FiShield, text: 'Bank-level security for your data' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const result = await login({ email, password });
    if (result.success) navigate('/dashboard');
    else setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        .auth-input {
          width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 0.9375rem; font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f8fafc; color: #0f172a; transition: all 0.2s; outline: none;
        }
        .auth-input:focus { border-color: #d946ef; background: white; box-shadow: 0 0 0 3px rgba(217,70,239,0.1); }
        .auth-input::placeholder { color: #94a3b8; }
        .grid-bg {
          background-image: linear-gradient(rgba(217,70,239,0.04) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(217,70,239,0.04) 1px,transparent 1px);
          background-size: 48px 48px;
        }
        .ff-glow { box-shadow: 0 0 18px rgba(217,70,239,0.5); }
      `}</style>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0a0812 0%, #1a0a2e 50%, #0f0d1a 100%)' }}>
        <div className="grid-bg absolute inset-0" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(217,70,239,0.2) 0%,transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)', transform: 'translate(-30%,30%)' }} />

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm ff-glow" style={{ background: G }}>FF</div>
          <span className="text-white font-bold text-lg">FinanceFlow</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-tight mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your money,<br />
            <em className="not-italic" style={{ background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>under control.</em>
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-sm">
            The smart way to track, manage, and grow your personal finances.
          </p>
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.1 }}
                className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(217,70,239,0.12)', border: '1px solid rgba(217,70,239,0.2)' }}>
                  <f.icon className="w-4 h-4 text-fuchsia-400" />
                </div>
                <span className="text-slate-300 text-sm">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="relative z-10 rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(217,70,239,0.15)' }}>
          <p className="text-slate-300 text-sm italic leading-relaxed">"Finally an app that makes managing money feel effortless."</p>
          <p className="text-slate-500 text-xs mt-2">— FinanceFlow early user</p>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs ff-glow" style={{ background: G }}>FF</div>
            <span className="font-bold text-slate-800">FinanceFlow</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 mb-8 text-sm">Sign in to continue to your dashboard</p>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="email" required className="auth-input" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="password" required className="auth-input" placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all mt-2"
              style={{ background: loading ? '#a855f7' : G, boxShadow: loading ? 'none' : '0 4px 16px rgba(217,70,239,0.4)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700 transition-colors">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;