'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

/**
 * AuthGuard component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const AuthGuard = ({ children }) => {
  const router = useRouter();
  const t = useTranslations('Backoffice');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        // Redirect to login page if no token found
        window.location.href = '/backoffice/login';
        return;
      }

      // Verify token with backend
      const verifyToken = async () => {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            // Token is invalid, clear localStorage and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            router.push('/backoffice/login');
            return;
          }

          // Token is valid
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error verifying token:', error);
          // On error, assume token is invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          router.push('/backoffice/login');
        } finally {
          setIsLoading(false);
        }
      };

      verifyToken();
    };

    checkAuth();
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>{t('verifyingAuth')}</p>
      </div>
    );
  }

  // If authenticated, render children
  return isAuthenticated ? children : null;
};

export default AuthGuard;
