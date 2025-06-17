'use client';

import { useState, useEffect } from 'react';
import Hero from './hero';

const HeroWithTransition = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    // Show overlay first
    setOverlayVisible(true);
    
    // Then fade in the image
    const imageTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => {
      clearTimeout(imageTimer);
    };
  }, []);

  return (
    <div className="banner-image-container">
      <div className={`banner-overlay ${overlayVisible ? 'visible' : ''}`}></div>
      <div className={`banner-image ${isLoaded ? 'loaded' : ''}`}>
        <Hero />
      </div>
    </div>
  );
};

export default HeroWithTransition;
