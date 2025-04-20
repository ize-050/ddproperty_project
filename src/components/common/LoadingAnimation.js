"use client";

import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-logo">
          <img src="/images/logo/logo-ddproperty.svg" alt="DDProperty Logo" width="180" />
        </div>
        <div className="loading-spinner-container">
          <div className="loading-spinner-dots">
            <div className="dot dot1"></div>
            <div className="dot dot2"></div>
            <div className="dot dot3"></div>
          </div>
          <div className="loading-text">กำลังโหลด...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
