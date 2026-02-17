import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { FiCheck, FiX, FiMail } from 'react-icons/fi';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link. Please request a new one.');
            return;
        }
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
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8fafc' }}
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-12 text-center shadow-xl max-w-md w-full"
                style={{ border: '1px solid #e2e8f0' }}
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">FF</div>
                    <span className="font-semibold text-slate-800">FinanceFlow</span>
                </div>

                {status === 'verifying' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                            style={{ background: '#f1f5f9' }}>
                            <FiMail className="w-9 h-9 text-slate-400" />
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mb-4">
                            <span className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            <span className="text-slate-600 font-medium text-sm">Verifying your email...</span>
                        </div>
                        <p className="text-slate-400 text-sm">This should only take a moment.</p>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <FiCheck className="w-10 h-10 text-white" strokeWidth={3} />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
                        <p className="text-slate-500 text-sm mb-6">{message}</p>
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
                )}

                {status === 'error' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <FiX className="w-10 h-10 text-white" strokeWidth={3} />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
                        <p className="text-slate-500 text-sm mb-8">{message}</p>
                        <motion.button
                            onClick={() => navigate('/register')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
                            style={{ background: '#0f172a' }}
                        >
                            Back to Register
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;