import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../services/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await authApi.verifyEmail(token);
                setStatus('success');
                setMessage(response.data);

                // Redirect to login after 3 seconds
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data || 'Verification failed');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl text-center">
                {status === 'verifying' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Verifying Email...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Email Verified!
                        </h2>
                        <p className="text-gray-600">{message}</p>
                        <p className="text-sm text-gray-500 mt-4">
                            Redirecting to login...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-red-500 text-6xl mb-4">✗</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Verification Failed
                        </h2>
                        <p className="text-gray-600">{message}</p>
                        <button
                            onClick={() => navigate('/register')}
                            className="mt-6 btn-primary"
                        >
                            Back to Register
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;