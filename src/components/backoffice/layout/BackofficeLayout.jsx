'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeSidebar from '@/components/backoffice/sidebar/BackofficeSidebar';
import AuthGuard from '@/components/backoffice/auth/AuthGuard';
import { useAuth, AuthProvider } from '@/components/backoffice/auth/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaBell, FaChevronDown, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import UserProfileMenu component
import UserProfileMenu from './UserProfileMenu';

const BackofficeLayoutContent = ({ children }) => {
  const t = useTranslations('Backoffice');
  const { user } = useAuth();

  // Check if current path is login page
  const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/login');

  // Don't apply AuthGuard to login page
  if (isLoginPage) {
    return (
      <div className="backoffice-container">
        {/* Main Content */}
        <div className="backoffice-main" style={{ width: '100%' }}>
          {/* Content */}
          <main className="backoffice-content">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Apply AuthGuard to all other backoffice pages
  return (
    <AuthGuard>
      
      <div className="dashboard__main pl0-md">
        <div className="dashboard__content  bgc-f7">
          <div className="row pb40 d-block d-lg-none">
            </div>
            {children}
           </div>
        </div>
   
    </AuthGuard>
  );
};

// Wrapper component that provides AuthContext
const BackofficeLayout = ({ children }) => {
  return (
    <AuthProvider>
      <BackofficeLayoutContent>
        {children}
      </BackofficeLayoutContent>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default BackofficeLayout;
