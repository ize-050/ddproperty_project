'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaEnvelope, 
  FaPlus, 
  FaHome, 
  FaBlog, 
  FaUser, 
  FaGlobe, 
  FaDollarSign 
} from 'react-icons/fa';

const BackofficeSidebar = () => {
  const t = useTranslations('backoffice');
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname.includes(path);
  };

  return (
    <div className="backoffice-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">MAIN</h3>
        <ul className="sidebar-menu">
          <li className={isActive('/backoffice') && !isActive('/backoffice/') ? 'active' : ''}>
            <Link href="/backoffice">
              <FaTachometerAlt />
              <span>{t('dashboard')}</span>
            </Link>
          </li>
          <li className={isActive('/backoffice/message') ? 'active' : ''}>
            <Link href="/backoffice/message">
              <FaEnvelope />
              <span>{t('message')}</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">MANAGE LISTINGS</h3>
        <ul className="sidebar-menu">
          <li className={isActive('/backoffice/add-property') ? 'active' : ''}>
            <Link href="/backoffice/add-property">
              <FaPlus />
              <span>{t('addNewProperty')}</span>
            </Link>
          </li>
          <li className={isActive('/backoffice/my-properties') ? 'active' : ''}>
            <Link href="/backoffice/my-properties">
              <FaHome />
              <span>{t('myProperties')}</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">BLOG</h3>
        <ul className="sidebar-menu">
          <li className={isActive('/backoffice/blog') ? 'active' : ''}>
            <Link href="/backoffice/blog">
              <FaBlog />
              <span>{t('allPost')}</span>
            </Link>
          </li>
          <li className={isActive('/backoffice/blog/add') ? 'active' : ''}>
            <Link href="/backoffice/blog/add">
              <FaPlus />
              <span>{t('addNewPost')}</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">SETTING</h3>
        <ul className="sidebar-menu">
          <li className={isActive('/backoffice/all-user') ? 'active' : ''}>
            <Link href="/backoffice/all-user">
              <FaUser />
              <span>{t('allUser')}</span>
            </Link>
          </li>
          <li className={isActive('/backoffice/language') ? 'active' : ''}>
            <Link href="/backoffice/language">
              <FaGlobe />
              <span>{t('language')}</span>
            </Link>
          </li>
          <li className={isActive('/backoffice/currency') ? 'active' : ''}>
            <Link href="/backoffice/currency">
              <FaDollarSign />
              <span>{t('currency')}</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">MANAGE ACCOUNT</h3>
        <ul className="sidebar-menu">
          <li className={isActive('/backoffice/my-profile') ? 'active' : ''}>
            <Link href="/backoffice/my-profile">
              <FaUser />
              <span>{t('myProfile')}</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BackofficeSidebar;
