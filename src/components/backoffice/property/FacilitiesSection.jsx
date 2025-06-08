'use client';

import React, { useState, useEffect } from 'react';
import { getIconsByPrefix } from '@/services/iconService';
import usePropertyFormStore from '@/store/propertyFormStore';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';

const FacilitiesSection = () => {
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
          throw new Error('Failed to fetch facility icons');
        }
      } catch (err) {
        console.error('Error fetching facility icons:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityIcons();
  }, [initializeFacilities]);

  // Handle facility selection
  const handleFacilityClick = (category, key, active) => {
    console.log(`Toggle ${category} icon: ${key} from ${active} to ${!active}`);
    // Convert to boolean for consistent handling
    const newValue = !active;
    
    // Update Zustand store with boolean
    setFacility(category, key, newValue);

  };

  const categoryOrder = ['common-area', 'dining', 'fitness', 'pool', 'other'];
  const categoryDisplayNames = {
    'common-area': 'Common Areas',
    'dining': 'Dining, Entertainment & Leisure',
    'fitness': 'Fitness & Sports',
    'pool': 'Pools, Spa & Relaxation',
    'other': 'Other',
  };

  // CSS styles for active items
  const activeStyle = {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    color: '#000',
  };

  // Render facilities for a specific category
  const renderFacilitiesByCategory = (category) => {
    if (!facilityIcons || !facilityIcons[category]) {
      return <p>No facilities available for {categoryDisplayNames[category]}</p>;
    }

    return (
      <div className="amenities-grid">
        {facilityIcons[category].map((icon) => {
          // สร้าง field name สำหรับ React Hook Form - ใช้รูปแบบ facilities.category.key
          const fieldName = `facilities.${category}.${icon.key}`;


          
          // ใช้ Boolean เพื่อแน่ใจว่าเป็นค่า boolean จาก nested structure
          const isActive = Boolean(formData.facilities?.[category]?.[icon.key]?.active);

          return (
            <div
              key={icon.key}
              className={`amenity-item ${isActive ? 'active' : ''}`}
              onClick={() => handleFacilityClick(category, icon.key, isActive)}
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
                    alt={icon.name}
                    width={24}
                    height={24}
                  />
                )}
              </span>
              <span className="amenity-label">{icon.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="form-section">
        <h2>Facilities</h2>
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" /> Loading facilities...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="form-section">
        <h2>Facilities</h2>
        <div className="error-message">
          Error loading facilities: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="form-section">
      <h2>Facilities</h2>

      {categoryOrder.map(category => {
        // Skip if this category doesn't have any facilities
        if (!facilityIcons[category] || facilityIcons[category].length === 0) {
          return null;
        }

        return (
          <div className="facility-category" key={category}>
            <h3>{categoryDisplayNames[category]}</h3>
            {renderFacilitiesByCategory(category)}
          </div>
        );
      })}
    </section>
  );
};

export default FacilitiesSection;
