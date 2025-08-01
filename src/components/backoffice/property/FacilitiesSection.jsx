'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getIconsByPrefix } from '@/services/iconService';
import usePropertyFormStore from '@/store/propertyFormStore';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';
import { getLocalizedIconName, getIconAltText } from '@/utils/iconUtils';

const FacilitiesSection = () => {
  const t = useTranslations('backoffice.facilities');
  const locale = useLocale();
  const { formData, setFacility, initializeFacilities } = usePropertyFormStore();
  const [facilityIcons, setFacilityIcons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register, setValue } = useFormContext();

  // Fetch facility icons from API
  useEffect(() => {
    const fetchFacilityIcons = async () => {
      try {
        setLoading(true);
        const response = await getIconsByPrefix('facility');
        if (response.success) {
          setFacilityIcons(response.data);
          
          // Initialize all facility icons in the store
           initializeFacilities(response.data);

        } else {
          throw new Error(t('fetchError'));
        }
      } catch (err) {
        console.error('Error fetching facility icons:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityIcons();
  }, [initializeFacilities, t]);

  // Handle facility selection
  const handleFacilityClick = (category, key, active, id) => {
    const newValue = !active;
    // Convert to boolean for consistent handling
    setFacility(category, key, newValue, id);
  };

  const categoryOrder = ['common-area', 'dining', 'fitness', 'pool', 'other'];
  const categoryDisplayNames = {
    'common-area': t('categoryCommon'),
    'dining': t('categoryDining'),
    'fitness': t('categoryFitness'),
    'pool': t('categoryPool'),
    'other': t('categoryOther'),
  };

  // CSS styles for active items
  const activeStyle = {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    color: '#000',
  };

  // Render facilities for a specific category
  const renderFacilitiesByCategory = (category) => {
    if (!facilityIcons || !facilityIcons[category]) {
      return <p>{t('noneAvailable', { category: categoryDisplayNames[category] })}</p>;
    }

    return (
      <div className="amenities-grid">
        {facilityIcons[category].map((icon) => {
          // สร้าง field name สำหรับ React Hook Form - ใช้รูปแบบ facilities.category.key
          const fieldName = `facilities.${category}.${icon.key}`;
          const isActive = Boolean(formData.facilities?.[category]?.[icon.key]?.active);

          return (
            <div
              key={icon.key}
              className={`amenity-item`}
              style={isActive ? activeStyle : {}}
              onClick={() => handleFacilityClick(category, icon.key, isActive, icon.id)}
            >
              {/* Hidden input to ensure all facilities are submitted */}
              <input
                type="hidden"
                {...register(fieldName)}
                value={isActive.toString()}
              />
              <span className="amenity-icon">
                {icon.iconPath && (
                  <Image
                    src={icon.iconPath}
                    alt={getIconAltText(icon, locale)}
                    width={24}
                    height={24}
                  />
                )}
              </span>
              <span className="amenity-label">{getLocalizedIconName(icon, locale)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="form-section">
        <h2>{t('title')}</h2>
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" /> {t('loading')}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="form-section">
        <h2>{t('title')}</h2>
        <div className="error-message">
          {t('error', { error })}
        </div>
      </section>
    );
  }

  return (
    <section className="form-section">
      <h2>{t('title')}</h2>

      {categoryOrder.map(category => {
        // Skip if this category doesn't have any facilities
        if (!facilityIcons[category] || facilityIcons[category].length === 0) {
          return null;
        }

        return (
          <div key={category} className="facility-category">
            <h3>{categoryDisplayNames[category]}</h3>
            {renderFacilitiesByCategory(category)}
          </div>
        );
      })}
    </section>
  );
};

export default FacilitiesSection;
