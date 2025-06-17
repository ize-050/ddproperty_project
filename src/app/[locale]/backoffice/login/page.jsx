'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export const dynamic = "force-dynamic";

const LoginPage = () => {
  const t = useTranslations('Backoffice');
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      window.location.href = '/backoffice';
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connect to the backend authentication API
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      
      // Redirect to dashboard
      window.location.href = '/backoffice';
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link href="/" className="logo">
            <Image 
              src="/images/logo/logo.png" 
              alt="D'Luck Property" 
              width={150} 
              height={50} 
            />
          </Link>
          <h1>{t('adminLogin')}</h1>
          <p>{t('loginDescription')}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              {t('email')}
            </label>
            <input 
              type="email" 
              id="email"
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder={t('enterEmail')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              {t('password')}
            </label>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                name="password" 
                value={formData.password} 
                onChange={handleChange}
                placeholder={t('enterPassword')}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">{t('rememberMe')}</label>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? t('loggingIn') : t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
