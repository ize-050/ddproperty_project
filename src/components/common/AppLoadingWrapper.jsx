"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const LoadingScreen = () => (
  <div className="loading-screen" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    flexDirection: 'column'
  }}>
    <div className="logo-container mb-3" style={{ marginBottom: '30px' }}>
      <Image 
        src="/images/logo/logo.png"
        alt="DD Property Logo"
        width={120}
        height={40}
        priority
      />
    </div>
    
    <div className="loading-animation" style={{ position: 'relative', width: '80px', height: '80px' }}>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '50%',
        borderTopColor: '#34609D',
        animation: 'spin 1s ease-in-out infinite',
      }}></div>
    </div>
    
    <h4 style={{ 
      marginTop: '25px', 
      fontWeight: '600', 
      color: '#34609D', 
      fontFamily: 'var(--title-font-family, "IBM Plex Sans", sans-serif)',
      fontSize: '18px',
      letterSpacing: '0.5px'
    }}>
    </h4>
    
    <p style={{ 
      marginTop: '10px', 
      color: '#777', 
      fontSize: '14px',
      textAlign: 'center',
      maxWidth: '300px',
      lineHeight: '1.4'
    }}>
    </p>
    
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .loading-animation::before {
        content: '';
        display: block;
        position: absolute;
        left: -20px;
        top: -20px;
        right: -20px;
        bottom: -20px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: rgba(52, 96, 157, 0.3);
        animation: spin 1.5s linear infinite reverse;
        z-index: -1;
      }
    `}</style>
  </div>
);

const AppLoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if the document is ready
    if (document.readyState === 'complete') {
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    } else {
      const handleLoad = () => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
      };
      window.addEventListener('load', handleLoad);
      
      // ตรวจสอบสถานะโหลดหลังจากเวลาสูงสุด
      const maxLoadingTimeout = setTimeout(() => setIsLoading(false), 5000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(maxLoadingTimeout);
      };
    }
  }, []);
  
  return isLoading ? <LoadingScreen /> : children;
};

export default AppLoadingWrapper;
