'use client';

import React, { useState, useEffect } from 'react';
import { getIconsByPrefix } from '@/services/iconService';
import usePropertyFormStore from '@/store/propertyFormStore';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';

const FeaturesSection = () => {
  const { formData, setFeature, initializeAmenities } = usePropertyFormStore();
  const [amenityIcons, setAmenityIcons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register, setValue } = useFormContext();


  // Fetch amenity icons from API
  useEffect(() => {
    const fetchAmenityIcons = async () => {
      try {
        setLoading(true);

        const response = await getIconsByPrefix('amenity');

        if (response && response.success) {
          setAmenityIcons(response.data || {});


          // Initialize all amenity icons in the store
          initializeAmenities(response.data || {});

        } else {
          throw new Error('Failed to fetch amenity icons');
        }
      } catch (err) {
        console.error('Error fetching amenity icons:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenityIcons();
  }, [initializeAmenities]);



  // Handle amenity selection
  const handleFeatureClick = (type, key, active) => {
    console.log(`Toggle ${type} icon: ${key} from ${active} to ${!active}`);

    // Convert to boolean for consistent handling
    const newValue = !active;

    // Update Zustand store with boolean
    setFeature(type, key, newValue);


  };

  // CSS styles for active items
  const activeStyle = {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    color: '#000',
  };

  if (loading) {
    return (
      <section className="form-section">
        <h2>Amenity</h2>
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" /> Loading amenities...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="form-section">
        <h2>Amenity</h2>
        <div className="error-message">
          Error loading amenities: {error}
        </div>
      </section>
    );
  }



  // เช็คว่า amenityIcons มีข้อมูลหรือไม่
  const amenityArray = amenityIcons?.amenity || [];


  // Debug: เพิ่มการแสดงข้อมูล state ทั้งหมดเมื่อ render


  return (
    <section className="form-section">
      <h2>Amenity</h2>
      <div className="amenities-grid">
        {amenityArray.length > 0 ? (
          amenityArray.map((icon) => {
            // สร้าง field name สำหรับ React Hook Form
            const fieldName = `amenities.${icon.key}`;

            // ดึงค่าจาก formData โดยตรง ตรวจสอบให้เป็น boolean
            const amenityValue = formData.amenities?.[icon.key];
            const isActive = Boolean(amenityValue?.active);


            return (
              <div
                key={icon.id}
                className={`amenity-item`}
                style={isActive ? activeStyle : {}}
                onClick={() => handleFeatureClick('amenity', icon.key, isActive)}
              >
                {/* เพิ่ม hidden input เพื่อเก็บ iconId */}
                <input
                  type="hidden"
                  {...register(`amenities.${icon.key}.iconId`)}
                  value={icon.id}
                />
                {/* Hidden input to ensure all amenities are submitted */}
                <input
                  type="hidden"
                  {...register(`amenities.${icon.key}.active`)}
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
          <div className="no-data">ไม่พบข้อมูล Amenities</div>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;
