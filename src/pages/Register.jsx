import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiCheck } from 'react-icons/fi';

const steps = ['Personal Info', 'Account Details', 'Password'];

const Register = () => {
  const [formData, setFormData] = useState({
    email: '', username: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', country: '', timezone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 4000);
    } else {
      setError(typeof result.error === 'object' ? Object.values(result.error).join(', ') : result.error);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-12 text-center shadow-xl max-w-md w-full mx-6"
          style={{ border: '1px solid #e2e8f0' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheck className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">You're in!</h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            Your account has been created. Please check your email to verify your account before signing in.
          </p>
          <div className="flex items-center justify-center gap-1 text-sm text-slate-400">
            <span>Redirecting to login</span>
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-1 bg-slate-400 rounded-full inline-block ml-0.5"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        .auth-input {
          width: 100%;
          padding: 0.7rem 1rem 0.7rem 2.5rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f8fafc;
          color: #0f172a;
          transition: all 0.2s;
          outline: none;
        }
        .auth-input.no-icon { padding-left: 1rem; }
        .auth-input:focus {
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .auth-input::placeholder { color: #94a3b8; }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-[40%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }}
      >
        <div className="grid-bg absolute inset-0" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-sm">FF</div>
          <span className="text-white font-semibold text-lg">FinanceFlow</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative z-10"
        >
          <h1 className="text-5xl font-bold text-white leading-tight mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
            Start your<br />
            <em className="text-indigo-400 not-italic">financial journey.</em>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Join thousands of people who trust FinanceFlow to manage their money smarter.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 space-y-3"
        >
          {[
            'Free to get started, no credit card required',
            'Secure, encrypted data storage',
            'Real-time sync across all devices',
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FiCheck className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px] py-8"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">FF</div>
            <span className="font-semibold text-slate-800">FinanceFlow</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-1">Create your account</h2>
          <p className="text-slate-500 text-sm mb-7">Get started for free — no credit card needed</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" name="firstName" required className="auth-input"
                    placeholder="John" value={formData.firstName} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Last Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" name="lastName" required className="auth-input"
                    placeholder="Doe" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input type="email" name="email" required className="auth-input"
                  placeholder="you@example.com" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input type="text" name="username" required className="auth-input"
                  placeholder="johndoe" value={formData.username} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input type="password" name="password" required className="auth-input"
                    placeholder="Min. 8 chars" value={formData.password} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Confirm</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input type="password" name="confirmPassword" required className="auth-input"
                    placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} />
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all mt-2"
              style={{ background: '#0f172a' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create account'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;