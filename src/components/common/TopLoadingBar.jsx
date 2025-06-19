'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const TopLoadingBar = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    console.log('TopLoadingBar mounted, pathname:', pathname);
    
    let progressTimer;
    let finishTimer;

    const startLoading = () => {
      console.log('🔄 Starting loading bar for path:', pathname);
      setLoading(true);
      setProgress(0);
      
      // Animate progress
      progressTimer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 25;
          if (newProgress >= 90) {
            clearInterval(progressTimer);
            return 90;
          }
          return newProgress;
        });
      }, 100);
    };

    const finishLoading = () => {
      console.log('✅ Finishing loading bar');
      clearInterval(progressTimer);
      setProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        console.log('🚫 Loading bar hidden');
      }, 200);
    };

    // Start loading immediately
    startLoading();
    
    // Finish after 1 second
    finishTimer = setTimeout(finishLoading, 1000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(finishTimer);
    };
  }, [pathname]);

  console.log('TopLoadingBar render - loading:', loading, 'progress:', progress);

  return (
    <>
      <div 
        className="top-loading-bar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '4px',
          zIndex: 99999,
          background: 'rgba(0,0,0,0.1)',
          display: loading ? 'block' : 'none'
        }}
      >
        <div 
          className="loading-progress"
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #d22630 0%, #ff4757 50%, #d22630 100%)',
            width: `${progress}%`,
            transition: 'width 0.3s ease',
            boxShadow: '0 0 8px rgba(210, 38, 48, 0.6)'
          }}
        />
      </div>
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'black',
          color: 'white',
          padding: '5px',
          fontSize: '12px',
          zIndex: 100000
        }}>
          Loading: {loading ? 'YES' : 'NO'} | Progress: {Math.round(progress)}%
        </div>
      )}
    </>
  );
};

export default TopLoadingBar;
