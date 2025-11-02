"use client";

import React from 'react';

const LoadingAnimation = ({ card = false, type = 'default' }) => {
  // Property detail loading style
  if (type === 'property-detail') {
    return (
      <div className="property-detail-loading">
        <div className="container">
          <div className="row">
            {/* Header skeleton */}
            <div className="col-lg-12 mb-4">
              <div className="skeleton-header">
                <div className="skeleton-breadcrumb"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-subtitle"></div>
              </div>
            </div>
            
            {/* Gallery skeleton */}
            <div className="col-lg-12 mb-4">
              <div className="skeleton-gallery">
                <div className="skeleton-main-image"></div>
                <div className="skeleton-thumbnails">
                  <div className="skeleton-thumb"></div>
                  <div className="skeleton-thumb"></div>
                  <div className="skeleton-thumb"></div>
                  <div className="skeleton-thumb"></div>
                </div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="col-lg-8">
              <div className="skeleton-content">
                <div className="skeleton-tabs"></div>
                <div className="skeleton-text-block"></div>
                <div className="skeleton-text-block"></div>
                <div className="skeleton-text-block short"></div>
              </div>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="col-lg-4">
              <div className="skeleton-sidebar">
                <div className="skeleton-price"></div>
                <div className="skeleton-agent"></div>
                <div className="skeleton-button"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Card style loading
  if (card) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 18px rgba(30,30,40,0.09)',
        padding: 36,
        minHeight: 240,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        maxWidth: 380
      }}>
        <div style={{ marginBottom: 18 }}>
          <img src="/images/logo/logo.png" alt="DDProperty Logo" width="92" />
        </div>
        <div className="loading-spinner-dots" style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
        <div style={{ fontSize: '1.06rem', color: '#222', fontWeight: 500, letterSpacing: 0.2 }}>กำลังโหลด...</div>
      </div>
    );
  }
  
  // Default empty loading with full overlay
  return (
   <div style={{
     position: 'fixed',
     top: 0,
     left: 0,
     width: '100%',
     height: '100%',
     backgroundColor: 'rgba(255, 255, 255, 0.95)',
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'center',
     zIndex: 9999,
   }}>
    <div className="loading-spinner-dots" style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
      <div className="dot dot1"></div>
      <div className="dot dot2"></div>
      <div className="dot dot3"></div>
    </div>
    <div style={{ fontSize: '1.06rem', color: '#222', fontWeight: 500, letterSpacing: 0.2 }}>กำลังโหลด...</div>
   </div>
  );
};

export default LoadingAnimation;
