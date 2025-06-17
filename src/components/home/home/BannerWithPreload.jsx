'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Hero from './hero';

// Import our custom translation hook
import useTranslation from '@/hooks/useTranslation';

const BannerWithPreload = ({propertyTypes}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`home-banner-style8 ${isLoaded ? 'loaded' : ''} p0`}>
      <div className="home-style8">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <Hero  propertyTypes={propertyTypes}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerWithPreload;
