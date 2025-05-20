'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/backoffice/auth/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const UserProfileMenu = () => {
  const t = useTranslations('Backoffice');
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="user-profile-menu" ref={menuRef}>
      <div className="profile-trigger" onClick={toggleMenu}>
        <Image 
          src="/images/team/1.jpg" 
          alt={user?.name || 'User Profile'} 
          width={40} 
          height={40} 
          className="profile-image" 
        />
      </div>
      
      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <Image 
              src="/images/team/1.jpg" 
              alt={user?.name || 'User Profile'} 
              width={60} 
              height={60} 
              className="profile-image" 
            />
            <div className="profile-info">
              <h4>{user?.name || 'User'}</h4>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <ul className="profile-menu">
            <li>
              <Link href="/backoffice/my-profile" onClick={() => setIsOpen(false)}>
                <FaUser />
                <span>{t('myProfile')}</span>
              </Link>
            </li>
            <li>
              <Link href="/backoffice/settings" onClick={() => setIsOpen(false)}>
                <FaCog />
                <span>{t('settings')}</span>
              </Link>
            </li>
            <li className="divider"></li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt />
                <span>{t('logout')}</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
