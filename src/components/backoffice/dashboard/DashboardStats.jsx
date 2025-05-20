'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { FaHome, FaChartLine, FaEnvelope } from 'react-icons/fa';

const DashboardStats = () => {
  const t = useTranslations('Backoffice');

  // Mock data for statistics
  const stats = {
    allProperties: 567,
    totalViews: 1263,
    totalEnquiries: 85
  };

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-content">
          <h3 className="stat-title">{t('allProperties')}</h3>
          <p className="stat-value">{stats.allProperties}</p>
        </div>
        <div className="stat-icon">
          <FaHome size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <h3 className="stat-title">{t('totalViews')}</h3>
          <p className="stat-value">{stats.totalViews}</p>
        </div>
        <div className="stat-icon">
          <FaChartLine size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <h3 className="stat-title">{t('totalEnquiries')}</h3>
          <p className="stat-value">{stats.totalEnquiries}</p>
        </div>
        <div className="stat-icon">
          <FaEnvelope size={24} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
