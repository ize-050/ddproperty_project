'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import DashboardStats from '@/components/backoffice/dashboard/DashboardStats';
import PropertyViews from '@/components/backoffice/dashboard/PropertyViews';
import RecentActivities from '@/components/backoffice/dashboard/RecentActivities';

export const dynamic = "force-dynamic";

const BackofficePage = () => {
  const t = useTranslations('backoffice');

  return (
<>
      <div className="row align-items-center pb0">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>{t('manageYourProfile')}</h2>
            <p className="text">We are glad to see you again!</p>
          </div>
        </div>
      </div>
      <div className="row">
      <div className="col-xl-12">
      <div className="backoffice-dashboard">
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
      </div>
      </div>
</>
  );
};

export default BackofficePage;
