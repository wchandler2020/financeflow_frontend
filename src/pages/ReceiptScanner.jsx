import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { transactionApi } from '../services/api';
import { FiUpload, FiCamera, FiX, FiCheck } from 'react-icons/fi';
import axios from 'axios';

const ReceiptScanner = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Scan receipt mutation
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
        onSuccess: (data) => {
            setExtractedData(data);
        },
        onError: (error) => {
            console.error('Scan error:', error);
            alert('Failed to scan receipt. Please try again.');
        },
    });

    // Create transaction mutation
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

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        setExtractedData(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleScanReceipt = () => {
        if (selectedFile) {
            scanMutation.mutate(selectedFile);
        }
    };

    const handleSaveTransaction = async () => {
        if (!extractedData) return;

        // You'll need to get accountId from user selection
        // For now, we'll need to add account selection
        const accountId = prompt('Enter account ID:'); // Temporary - we'll improve this

        const transactionData = {
            accountId: parseInt(accountId),
            categoryId: extractedData.categoryId || 1, // Will need to map category name to ID
            amount: extractedData.amount,
            transactionType: 'DEBIT',
            description: extractedData.description,
            transactionDate: extractedData.date,
        };

        createTransactionMutation.mutate(transactionData);
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreview(null);
        setExtractedData(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Receipt Scanner</h1>
                <p className="text-gray-600 mb-6">Upload a receipt and let AI extract the transaction details</p>

                {/* Upload Area */}
                {!selectedFile && (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDragging
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-400'
                            }`}
                    >
                        <FiUpload className="mx-auto text-5xl text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            Drag & drop your receipt here
                        </p>
                        <p className="text-sm text-gray-500 mb-6">or</p>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <FiUpload />
                                <span>Browse Files</span>
                            </button>

                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <FiCamera />
                                <span>Take Photo</span>
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            className="hidden"
                        />

                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            className="hidden"
                        />

                        <p className="text-xs text-gray-400 mt-6">
                            Supported formats: JPG, PNG, HEIC • Max size: 10MB
                        </p>
                    </div>
                )}

                {/* Preview & Results */}
                {selectedFile && (
                    <div className="space-y-6">
                        {/* Image Preview */}
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Receipt preview"
                                className="w-full h-64 object-contain bg-gray-50 rounded-lg"
                            />
                            <button
                                onClick={handleReset}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <FiX />
                            </button>
                        </div>

                        {/* Scan Button */}
                        {!extractedData && !scanMutation.isPending && (
                            <button
                                onClick={handleScanReceipt}
                                className="btn-primary w-full py-3 text-lg"
                            >
                                <FiCamera className="inline mr-2" />
                                Scan Receipt with AI
                            </button>
                        )}

                        {/* Loading */}
                        {scanMutation.isPending && (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">AI is analyzing your receipt...</p>
                            </div>
                        )}

                        {/* Extracted Data */}
                        {extractedData && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    <FiCheck className="text-green-600 text-2xl mr-2" />
                                    <h3 className="text-lg font-semibold text-green-900">
                                        Receipt Scanned Successfully!
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Merchant</label>
                                        <p className="text-lg font-semibold text-gray-900">{extractedData.merchantName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Amount</label>
                                        <p className="text-lg font-semibold text-gray-900">${extractedData.amount}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Date</label>
                                        <p className="text-lg font-semibold text-gray-900">{extractedData.date}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Category</label>
                                        <p className="text-lg font-semibold text-gray-900">{extractedData.category}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleSaveTransaction}
                                        disabled={createTransactionMutation.isPending}
                                        className="btn-primary flex-1"
                                    >
                                        {createTransactionMutation.isPending ? 'Saving...' : 'Save Transaction'}
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="btn-secondary"
                                    >
                                        Scan Another
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiptScanner;