'use client';

import React, { useState, useEffect } from 'react';
import { getIconsByPrefix } from '@/services/iconService';
import usePropertyFormStore from '@/store/propertyFormStore';
import { useFormContext } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const NearbySection = () => {
  const t = useTranslations('backoffice');
  const { formData, setNearby, initializeNearby } = usePropertyFormStore();
  const [nearbyIcons, setNearbyIcons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register, setValue, watch } = useFormContext();
  
  // Watch nearby form field instead of using formData
  const watchedNearby = watch('nearby') || {};



  // Sync formData to React Hook Form when formData changes
  useEffect(() => {
    if (formData.nearby) {
      setValue('nearby', formData.nearby);
    }
  }, [formData.nearby, setValue]);

  // Fetch nearby icons from API
  useEffect(() => {
    const fetchNearbyIcons = async () => {
      try {
        setLoading(true);
        console.log('Fetching nearby icons...');
        
        const response = await getIconsByPrefix('nearby');
        console.log('Nearby API Response:', response);
        
        if (response) {
          setNearbyIcons(response.data || {});
          
          console.log('Setting nearby icons in state:', response.data || {});
          
          // Initialize all nearby icons in the store
          initializeNearby(response.data || {});
        } else {
          throw new Error('Failed to fetch nearby icons');
        }
      } catch (err) {
        console.error('Error fetching nearby icons:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyIcons();
  }, [initializeNearby]);

  // Handle nearby selection
  const handleNearbyClick = (type, key, active,id) => {
    console.log(`Toggle ${type} icon: ${key} from ${active} to ${!active}`);
    
    // Convert to boolean for consistent handling
    const newValue = !active;
    
    // Update Zustand store with boolean
    setNearby(key, newValue,id);
    
    // Update React Hook Form with the same boolean value

    

  };

  // CSS styles for active items
  const activeStyle = {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    color: '#000',
  };

    if (loading) {
    return (
      <section className="form-section">
        <div className="section-header">
          <Image 
            src="/images/icons/iconproperty/nearby.svg" 
            alt={t('nearby.alt')} 
            width={24} 
            height={24} 
            className="section-icon"
          />
          <h2 className="section-title">{t('nearby.title')}</h2>
        </div>
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" /> {t('nearby.loading')}
        </div>
      </section>
    );
  }

    if (error) {
    return (
      <section className="form-section">
        <div className="section-header">
          <Image 
            src="/images/icons/iconproperty/nearby.svg" 
            alt={t('nearby.alt')} 
            width={24} 
            height={24} 
            className="section-icon"
          />
          <h2 className="section-title">{t('nearby.title')}</h2>
        </div>
        <div className="error-message">
          {t('nearby.error', { error })}
        </div>
      </section>
    );
  }



  const nearbyArray = nearbyIcons?.nearby || [];

    return (
    <section className="form-section">
      <div className="section-header">
        <h2 className="section-title">{t('nearby.title')}</h2>
      </div>
      <div className="amenities-grid">
        {nearbyArray.length > 0 ? (
          nearbyArray.map((icon) => {
            // สร้าง field name สำหรับ React Hook Form
            const fieldName = `nearby.${icon.key}`;
            // ใช้ Boolean เพื่อให้แน่ใจว่าเป็นค่า boolean
            const isActive = Boolean(watchedNearby?.[icon.key]?.active);
            
            return (
              <div
                key={icon.id}
                className="amenity-item"
                style={isActive ? activeStyle : {}}
                onClick={() => handleNearbyClick('nearby', icon.key, isActive,icon.id)}
              >

                <span className="amenity-icon">
                  {icon.iconPath && (
                    <Image
                      src={icon.iconPath}
                      alt={t('nearby.iconAlt', { name: icon.name })}
                      width={24}
                      height={24}
                    />
                  )}
                </span>
                <span className="amenity-label">{icon.name}</span>
              </div>
            );
          })
        ) : (
          <div className="no-data">{t('nearby.noData')}</div>
        )}
      </div>
    </section>
  );
};

export default NearbySection;
