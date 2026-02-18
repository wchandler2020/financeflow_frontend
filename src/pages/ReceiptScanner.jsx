import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { transactionApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiCamera, FiX, FiCheck, FiFileText } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import { useTheme } from '../components/theme/ThemeContext';
import axios from 'axios';

const ReceiptScanner = () => {
    const { isDark } = useTheme();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const scanMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/receipts/scan`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        },
        onSuccess: (data) => setExtractedData(data),
        onError: () => alert('Failed to scan receipt. Please try again.'),
    });

    const createTransactionMutation = useMutation({
        mutationFn: transactionApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions']);
            queryClient.invalidateQueries(['accounts']);
            navigate('/transactions');
        },
    });

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
        if (file.size > 10 * 1024 * 1024) { alert('File size must be less than 10MB'); return; }
        setSelectedFile(file);
        setExtractedData(null);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files[0]);
    };

    const handleSaveTransaction = async () => {
        if (!extractedData) return;
        const accountId = prompt('Enter account ID:');
        createTransactionMutation.mutate({
            accountId: parseInt(accountId),
            categoryId: extractedData.categoryId || 1,
            amount: extractedData.amount,
            transactionType: 'DEBIT',
            description: extractedData.description,
            transactionDate: extractedData.date,
        });
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreview(null);
        setExtractedData(null);
    };

    return (
        <Layout>
            <div className="flex flex-col h-[calc(100vh-10rem)] rounded-2xl overflow-hidden border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">

                {/* ── Header ── */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div
                        className="p-2.5 rounded-xl"
                        style={{ background: 'linear-gradient(135deg,#7c3aed22,#c026d322)' }}
                    >
                        <FiFileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Receipt Scanner</h1>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Powered by GPT-4 · Upload a receipt to extract transaction details</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto px-5 py-6 bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
                    <AnimatePresence mode="wait">

                        {/* Upload dropzone */}
                        {!selectedFile && (
                            <motion.div
                                key="dropzone"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-14 text-center transition-all duration-200 cursor-pointer
                                    ${isDragging
                                        ? 'border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-900/10'
                                        : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-300 dark:hover:border-violet-600'
                                    }`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                                    style={{ background: 'linear-gradient(135deg,#7c3aed22,#c026d322)' }}
                                >
                                    <FiUpload className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                                </div>
                                <p className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                    Drag &amp; drop your receipt here
                                </p>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">or choose an option below</p>

                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-200 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300 transition-all duration-200 shadow-sm"
                                    >
                                        <FiUpload className="w-4 h-4" />
                                        Browse Files
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-md transition-all duration-200"
                                        style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
                                    >
                                        <FiCamera className="w-4 h-4" />
                                        Take Photo
                                    </motion.button>
                                </div>

                                <p className="text-xs text-slate-400 dark:text-slate-600 mt-6">
                                    Supported formats: JPG, PNG, HEIC · Max size: 10MB
                                </p>

                                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files[0])} className="hidden" />
                                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleFileSelect(e.target.files[0])} className="hidden" />
                            </motion.div>
                        )}

                        {/* Preview + results */}
                        {selectedFile && (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-5"
                            >
                                {/* Image preview card */}
                                <div className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                    <img
                                        src={preview}
                                        alt="Receipt preview"
                                        className="w-full h-64 object-contain bg-slate-50 dark:bg-gray-900"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleReset}
                                        className="absolute top-3 right-3 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors duration-200"
                                    >
                                        <FiX className="w-3.5 h-3.5" />
                                    </motion.button>
                                </div>

                                {/* Scan button */}
                                {!extractedData && !scanMutation.isPending && (
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => scanMutation.mutate(selectedFile)}
                                        className="w-full py-3.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                                        style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}
                                    >
                                        <FiCamera className="w-4 h-4" />
                                        Scan Receipt with AI
                                    </motion.button>
                                )}

                                {/* Loading state */}
                                {scanMutation.isPending && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-10 rounded-2xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800"
                                    >
                                        <div className="relative w-12 h-12 mb-4">
                                            <div className="absolute inset-0 rounded-full border-4 border-violet-100 dark:border-violet-900"></div>
                                            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin"></div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">AI is analysing your receipt…</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">This usually takes a few seconds</p>
                                    </motion.div>
                                )}

                                {/* Extracted data */}
                                {extractedData && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
                                    >
                                        {/* Success banner */}
                                        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-900/40">
                                            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                <FiCheck className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Receipt scanned successfully!</p>
                                        </div>

                                        {/* Fields grid */}
                                        <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-gray-700 border-b border-slate-100 dark:border-gray-700">
                                            {[
                                                { label: 'Merchant', value: extractedData.merchantName },
                                                { label: 'Amount', value: `$${extractedData.amount}` },
                                                { label: 'Date', value: extractedData.date },
                                                { label: 'Category', value: extractedData.category },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="px-5 py-4 bg-white dark:bg-gray-800">
                                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 px-5 py-4">
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={handleSaveTransaction}
                                                disabled={createTransactionMutation.isPending}
                                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-200 disabled:opacity-60"
                                                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
                                            >
                                                {createTransactionMutation.isPending ? 'Saving…' : 'Save Transaction'}
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={handleReset}
                                                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300 transition-all duration-200"
                                            >
                                                Scan Another
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Footer note ── */}
                <div className="px-5 py-3 bg-white dark:bg-gray-900 border-t border-slate-100 dark:border-gray-800 transition-colors duration-300">
                    <p className="text-center text-xs text-slate-400 dark:text-slate-600">
                        AI extraction may not be perfectly accurate. Always verify amounts before saving.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default ReceiptScanner;