"use client";

import React from 'react';

const LoadingAnimation = ({ card = false }) => {
  // ถ้า card เป็น true จะใช้ style แบบ card
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
        <div style={{marginBottom: 18}}>
          <img src="/images/logo/logo.png" alt="DDProperty Logo" width="92" />
        </div>
        <div className="loading-spinner-dots" style={{display:'flex',gap:10,marginBottom:12}}>
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
        <div style={{fontSize:'1.06rem',color:'#222',fontWeight:500,letterSpacing:0.2}}>กำลังโหลด...</div>
      </div>
    );
  }
  // แบบ global เต็มจอ
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-logo">
          <img src="/images/logo/logo.png" alt="DDProperty Logo" width="180" />
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
