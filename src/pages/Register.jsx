import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    country: '',
    timezone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
 
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      if (typeof result.error === 'object') {
        const errorMessages = Object.values(result.error).join(', ');
        setError(errorMessages);
      } else {
        setError(result.error);
      }
    }
   
    setLoading(false);
  };

  if (success) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
          
          .success-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            position: relative;
            overflow: hidden;
          }

          .success-card {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 480px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            padding: 3rem 2.5rem;
            text-align: center;
            animation: successSlideUp 0.6s ease-out;
          }

          @keyframes successSlideUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .success-icon-wrapper {
            width: 96px;
            height: 96px;
            margin: 0 auto 2rem;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.4);
            animation: successPulse 2s ease-in-out infinite;
          }

          @keyframes successPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 25px 50px -10px rgba(16, 185, 129, 0.6); }
          }

          .checkmark {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: drawCheck 0.8s ease-out 0.3s forwards;
          }

          @keyframes drawCheck {
            to { stroke-dashoffset: 0; }
          }

          .success-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 0.75rem;
            letter-spacing: -0.02em;
          }

          .success-message {
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1.5rem;
            line-height: 1.6;
          }

          .redirect-text {
            font-family: 'Inter', sans-serif;
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .loading-dots {
            display: flex;
            gap: 4px;
          }

          .loading-dots span {
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: dotPulse 1.5s ease-in-out infinite;
          }

          .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
          .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

          @keyframes dotPulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>

        <div className="success-container">
          <div className="success-card">
            <div className="success-icon-wrapper">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path 
                  className="checkmark"
                  d="M6 12l4 4l8-8" 
                  stroke="white" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="success-title">Welcome to FinanceFlow!</h2>
            <p className="success-message">
              Your account has been created successfully.<br />
              Please check your email to verify your account.
            </p>
            <div className="redirect-text">
              <span>Redirecting to login</span>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          position: relative;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          overflow: hidden;
        }

        .register-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: registerFloat 20s ease-in-out infinite;
        }

        .register-container::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: registerFloat 15s ease-in-out infinite reverse;
        }

        @keyframes registerFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        .register-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 520px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
                      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
          padding: 2.5rem 2rem;
          animation: registerSlideUp 0.6s ease-out;
        }

        @keyframes registerSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .register-logo-container {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-logo-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.4);
          animation: registerPulse 2s ease-in-out infinite;
        }

        @keyframes registerPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 15px 35px -5px rgba(139, 92, 246, 0.6); }
        }

        .register-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.25rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .register-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 300;
          letter-spacing: 0.02em;
        }

        .register-form-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .register-input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s ease;
          z-index: 1;
        }

        .register-form-group.focused .register-input-icon {
          color: #8b5cf6;
        }

        .register-form-input {
          font-family: 'Inter', sans-serif;
          width: 100%;
          padding: 0.875rem 0.875rem 0.875rem 2.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .register-form-input.no-icon {
          padding-left: 0.875rem;
        }

        .register-form-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .register-form-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1),
                      0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .register-form-label {
          font-family: 'Inter', sans-serif;
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }

        .register-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .register-error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 0.875rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          animation: registerShake 0.5s ease;
          line-height: 1.5;
        }

        @keyframes registerShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .register-submit-button {
          font-family: 'Inter', sans-serif;
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.02em;
          margin-top: 0.25rem;
        }

        .register-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .register-submit-button:hover::before {
          left: 100%;
        }

        .register-submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 35px -10px rgba(139, 92, 246, 0.5);
        }

        .register-submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .register-submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .register-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: registerSpin 0.8s linear infinite;
          margin-right: 8px;
        }

        @keyframes registerSpin {
          to { transform: rotate(360deg); }
        }

        .register-footer-text {
          font-family: 'Inter', sans-serif;
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .register-footer-link {
          color: #8b5cf6;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          position: relative;
        }

        .register-footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #8b5cf6;
          transition: width 0.3s ease;
        }

        .register-footer-link:hover {
          color: #a78bfa;
        }

        .register-footer-link:hover::after {
          width: 100%;
        }

        .register-divider {
          display: flex;
          align-items: center;
          margin: 1.75rem 0 1.25rem;
          color: rgba(255, 255, 255, 0.3);
          font-family: 'Inter', sans-serif;
          font-size: 0.8125rem;
        }

        .register-divider::before,
        .register-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
        }

        .register-divider span {
          padding: 0 1rem;
        }

        @media (max-width: 640px) {
          .register-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="register-container">
        <div className="register-card">
          <div className="register-logo-container">
            <div className="register-logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h2 className="register-title">Join FinanceFlow</h2>
            <p className="register-subtitle">Start managing your finances today</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="register-error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="register-grid">
              <div className={`register-form-group ${focusedField === 'firstName' ? 'focused' : ''}`}>
                <label htmlFor="firstName" className="register-form-label">First Name</label>
                <div style={{ position: 'relative' }}>
                  <div className="register-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="register-form-input"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div className={`register-form-group ${focusedField === 'lastName' ? 'focused' : ''}`}>
                <label htmlFor="lastName" className="register-form-label">Last Name</label>
                <div style={{ position: 'relative' }}>
                  <div className="register-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="register-form-input"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            </div>

            <div className={`register-form-group ${focusedField === 'email' ? 'focused' : ''}`}>
              <label htmlFor="email" className="register-form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <div className="register-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="register-form-input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div className={`register-form-group ${focusedField === 'username' ? 'focused' : ''}`}>
              <label htmlFor="username" className="register-form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <div className="register-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <polyline points="17 11 19 13 23 9"/>
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="register-form-input"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div className={`register-form-group ${focusedField === 'password' ? 'focused' : ''}`}>
              <label htmlFor="password" className="register-form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <div className="register-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="register-form-input"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div className={`register-form-group ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
              <label htmlFor="confirmPassword" className="register-form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <div className="register-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="register-form-input"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="register-submit-button"
            >
              {loading && <span className="register-spinner"></span>}
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="register-divider">
            <span>Already have an account?</span>
          </div>

          <p className="register-footer-text">
            <Link to="/login" className="register-footer-link">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;