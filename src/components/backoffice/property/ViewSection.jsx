'use client';

import React, { useState, useEffect } from 'react';
import { getIconsByPrefix } from '@/services/iconService';
import usePropertyFormStore from '@/store/propertyFormStore';
import { useFormContext } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

const ViewSection = () => {
  const { formData, setView, initializeViews } = usePropertyFormStore();
  const [viewIcons, setViewIcons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register, setValue } = useFormContext();



  // Fetch view icons from API
  useEffect(() => {
    const fetchViewIcons = async () => {
      try {
        setLoading(true);
        console.log('Fetching view icons...');
        
        const response = await getIconsByPrefix('views');
        console.log('Views API Response:', response);
        
        if (response) {
          setViewIcons(response.data || {});
          
          console.log('Setting view icons in state:', response.data || {});
          
          // Initialize all view icons in the store
          initializeViews(response.data || {});
        } else {
          throw new Error('Failed to fetch view icons');
        }
      } catch (err) {
        console.error('Error fetching view icons:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchViewIcons();
  }, [initializeViews]);

  // Handle view selection
  const handleViewClick = (type, key, active) => {
    console.log(`Toggle ${type} icon: ${key} from ${active} to ${!active}`);
    
    // Convert to boolean for consistent handling
    const newValue = !active;
    
    // Update Zustand store with boolean (ไม่ส่ง type อีกต่อไป)
    setView(key, newValue);


  };

  if (loading) {
    return (
      <section className="form-section">
        <h2>View</h2>
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" /> Loading views...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="form-section">
        <h2>View</h2>
        <div className="error-message">
          Error loading views: {error}
        </div>
      </section>
    );
  }



  // CSS styles for active items
  const activeStyle = {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    color: '#000',
  };

  const viewsArray = viewIcons?.views || [];

  return (
    <section className="form-section">
      <h2>View</h2>
      <div className="amenities-grid">
        {viewsArray.length > 0 ? (
          viewsArray.map((icon) => {
            // สร้าง field name สำหรับ React Hook Form
            const fieldName = `views.${icon.key}`;
            // ใช้ Boolean เพื่อให้แน่ใจว่าเป็นค่า boolean
            const isActive = Boolean(formData.views?.[icon.key]?.active);
            
            return (
              <div
                key={icon.id}
                className="amenity-item"
                style={isActive ? activeStyle : {}}
                onClick={() => handleViewClick('views', icon.key, isActive)}
              >
                {/* Hidden input to ensure all views are submitted */}
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
          })
        ) : (
          <div className="no-data">ไม่พบข้อมูล Views</div>
        )}
      </div>
    </section>
  );
};

export default ViewSection;
