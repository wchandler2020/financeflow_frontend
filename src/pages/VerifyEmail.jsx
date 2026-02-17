import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { FiCheck, FiX, FiMail } from 'react-icons/fi';

const G = 'linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) { setStatus('error'); setMessage('Invalid verification link. Please request a new one.'); return; }
        const verify = async () => {
            try {
                const response = await authAPI.verifyEmail(token);
                setStatus('success');
                setMessage(response.data);
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data || 'Verification failed. The link may have expired.');
            }
        };
        verify();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'linear-gradient(145deg,#0a0812 0%,#1a0a2e 50%,#0f0d1a 100%)' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .grid-bg {
          background-image: linear-gradient(rgba(217,70,239,0.04) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(217,70,239,0.04) 1px,transparent 1px);
          background-size: 48px 48px;
        }
        .ff-glow { box-shadow: 0 0 24px rgba(217,70,239,0.5); }
      `}</style>

            {/* Background glows */}
            <div className="grid-bg absolute inset-0" />
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(217,70,239,0.2) 0%,transparent 70%)', transform: 'translate(30%,-30%)' }} />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)', transform: 'translate(-30%,30%)' }} />

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="relative z-10 rounded-3xl p-12 text-center max-w-md w-full"
                style={{ background: 'rgba(19,18,31,0.9)', border: '1px solid rgba(217,70,239,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}>

                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-10">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs ff-glow" style={{ background: G }}>FF</div>
                    <span className="font-bold text-white text-base">FinanceFlow</span>
                </div>

                {/* Verifying */}
                {status === 'verifying' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(217,70,239,0.1)', border: '1px solid rgba(217,70,239,0.2)' }}>
                            <FiMail className="w-9 h-9 text-fuchsia-400" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="w-4 h-4 border-2 border-fuchsia-900 border-t-fuchsia-400 rounded-full animate-spin" />
                            <span className="text-slate-300 font-medium text-sm">Verifying your email...</span>
                        </div>
                        <p className="text-slate-500 text-sm">This should only take a moment.</p>
                    </motion.div>
                )}

                {/* Success */}
                {status === 'success' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ff-glow"
                            style={{ background: G }}>
                            <FiCheck className="w-10 h-10 text-white" strokeWidth={3} />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                        <p className="text-slate-400 text-sm mb-6">{message}</p>
                        <div className="flex items-center justify-center gap-1 text-sm text-slate-500">
                            <span>Redirecting to login</span>
                            {[0, 1, 2].map(i => (
                                <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-1 h-1 bg-fuchsia-500 rounded-full inline-block ml-0.5" />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Error */}
                {status === 'error' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                            style={{ boxShadow: '0 0 24px rgba(239,68,68,0.4)' }}>
                            <FiX className="w-10 h-10 text-white" strokeWidth={3} />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                        <p className="text-slate-400 text-sm mb-8">{message}</p>
                        <motion.button onClick={() => navigate('/register')}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className="px-7 py-3 rounded-xl font-semibold text-white text-sm ff-glow"
                            style={{ background: G }}>
                            Back to Register
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;