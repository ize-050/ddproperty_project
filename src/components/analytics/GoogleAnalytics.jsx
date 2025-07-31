'use client'

import { useEffect } from 'react';
import Script from 'next/script';

const GoogleAnalytics = ({ GA_MEASUREMENT_ID = 'G-4WRWC06HG5' }) => {
  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    function gtag() {
      window.dataLayer.push(arguments);
    }
    
    // Make gtag available globally
    window.gtag = gtag;
    
    // Initialize with current date
    gtag('js', new Date());
    
    // Configure with measurement ID
    gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [GA_MEASUREMENT_ID]);

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
