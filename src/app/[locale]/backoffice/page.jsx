'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import DashboardStats from '@/components/backoffice/dashboard/DashboardStats';
import PropertyViews from '@/components/backoffice/dashboard/PropertyViews';
import RecentActivities from '@/components/backoffice/dashboard/RecentActivities';

export const dynamic = "force-dynamic";

const BackofficePage = () => {
  const t = useTranslations('Backoffice');

  return (
    <BackofficeLayout>
      <div className="backoffice-dashboard">
        <div className="profile-banner">
          <h2>{t('manageYourProfile')}</h2>
        </div>
        
        <DashboardStats />
        
        <div className="dashboard-content">
          <div className="property-views-container">
            <PropertyViews />
          </div>
          
          <div className="recent-activities-container">
            <RecentActivities />
          </div>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default BackofficePage;
