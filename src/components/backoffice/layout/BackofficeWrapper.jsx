'use client';

import React from 'react';
import { AuthProvider } from '@/components/backoffice/auth/AuthContext';
import BackofficeSidebar from '@/components/backoffice/sidebar/BackofficeSidebar';
import BackofficeLayout from './BackofficeLayout';

const BackofficeWrapper = ({ children }) => {
  return (
    <AuthProvider>
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <BackofficeSidebar />
          <BackofficeLayout>{children}</BackofficeLayout>
        </div>
      </div>
    </AuthProvider>
  );
};

export default BackofficeWrapper;
