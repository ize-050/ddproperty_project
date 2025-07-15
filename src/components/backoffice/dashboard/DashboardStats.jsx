'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FaHome, FaChartLine, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/components/backoffice/auth/AuthContext';

const DashboardStats = () => {
  const t = useTranslations('backoffice.dashboard');
  const { user } = useAuth();
  const [stats, setStats] = useState({
    allProperties: 0,
    totalViews: 0,
    totalEnquiries: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage or sessionStorage
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        
        // Determine API endpoint based on user role
        const isAdmin = user?.role === 'ADMIN';
        const apiEndpoint = isAdmin 
          ? 'http://localhost:5001/api/dashboard/stats' // Admin sees all data
          : `http://localhost:5001/api/dashboard/stats/user/${user?.id}`; // Non-admin sees only own data
        
        // Make API request
        const response = await fetch(apiEndpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(t('apiRequestFailed', { status: response.status }));
        }
        
        const data = await response.json();
        
        if (data.success) {
          setStats({
            allProperties: data.data.totalProperties || 0,
            totalViews: data.data.propertiesViews || 0,
            totalEnquiries: data.data.totalMessages || 0
          });
        } else {
          throw new Error(data.message || t('errorLoadingStats'));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-stats loading">
        <FaSpinner className="spinner" />
        <p>{t('loadingStats')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-stats error">
        <p>{t('errorLoadingStats')}: {error}</p>
      </div>
    );
  }

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
