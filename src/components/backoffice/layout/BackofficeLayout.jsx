'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeSidebar from '@/components/backoffice/sidebar/BackofficeSidebar';
import AuthGuard from '@/components/backoffice/auth/AuthGuard';
import { useAuth, AuthProvider } from '@/components/backoffice/auth/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaBell, FaChevronDown, FaSignOutAlt, FaUser } from 'react-icons/fa';

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
      <div className="backoffice-container">
        {/* Sidebar */}
        <BackofficeSidebar />

        {/* Main Content */}
        <div className="backoffice-main">
          {/* Header */}
          <header className="backoffice-header">
            <div className="header-nav">
              <Link href="/" className="header-logo">
                <Image 
                  src="/images/logo/logo.svg" 
                  alt="D'Luck Property" 
                  width={120} 
                  height={40} 
                />
              </Link>
              <nav className="main-nav">
                <ul>
                  <li><Link href="/">{t('home')}</Link></li>
                  <li><Link href="/for-sale">{t('forSale')}</Link></li>
                  <li><Link href="/for-rent">{t('forRent')}</Link></li>
                  <li><Link href="/blog">{t('blog')}</Link></li>
                  <li><Link href="/about">{t('about')}</Link></li>
                  <li><Link href="/contact">{t('contact')}</Link></li>
                </ul>
              </nav>
            </div>
            <div className="header-actions">
              <div className="language-selector">
                <span className="lang-flag">
                  <Image src="/images/flags/en.svg" alt="English" width={20} height={15} />
                </span>
                <span>EN</span>
                <FaChevronDown size={12} />
              </div>
              <div className="thai-flag">
                <Image src="/images/flags/th.svg" alt="Thai" width={20} height={15} />
              </div>
              <button className="icon-button">
                <FaEnvelope size={18} />
              </button>
              <button className="icon-button">
                <FaBell size={18} />
              </button>
              
              {/* User Profile Menu with Logout */}
              <UserProfileMenu />
            </div>
          </header>

          {/* Content */}
          <main className="backoffice-content">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

// Wrapper component that provides AuthContext
const BackofficeLayout = ({ children }) => {
  return (
    <AuthProvider>
      <BackofficeLayoutContent children={children} />
    </AuthProvider>
  );
};

export default BackofficeLayout;
