'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';
import { useLocale } from 'next-intl';
import { toast } from 'react-hot-toast';

const PropertyTypeSection = () => {
  const { formData, setPropertyType } = usePropertyFormStore();
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const locale = useLocale();
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ติดตามการเปลี่ยนแปลงของ propertyType ใน form
  const propertyType = watch('propertyType') || '';
  
  // ดึงข้อมูลประเภทอสังหาริมทรัพย์จาก API
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('token');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property-types`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch property types');
        }
        
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setPropertyTypes(data.data);
        }
      } catch (error) {
        console.error('Error fetching property types:', error);
        toast.error('Failed to load property types');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyTypes();
  }, []);
  
  // ซิงค์ข้อมูลจาก form ไปยัง store
  useEffect(() => {
    if (propertyType && propertyType !== formData.propertyType) {
      // อัพเดท store เมื่อค่าใน form เปลี่ยนแปลง
      setPropertyType(propertyType);
    }
  }, [propertyType, formData.propertyType, setPropertyType]);
  
  // ซิงค์ข้อมูลจาก store ไปยัง form เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    if (formData.propertyType) {
      setValue('propertyType', formData.propertyType);
    }
  }, []);
  
  // ฟังก์ชันสำหรับการเลือกประเภทอสังหาริมทรัพย์
  const selectPropertyType = (typeId) => {
    // เลือกประเภทอสังหาริมทรัพย์เพียงอย่างเดียว
    setValue('propertyType', typeId, { shouldValidate: true, shouldDirty: true });
  };
  
  // ฟังก์ชันสำหรับแสดงชื่อประเภทอสังหาริมทรัพย์ตามภาษาที่เลือก
  const getLocalizedName = (propertyType) => {
    if (!propertyType) return '';
    
    switch (locale) {
      case 'th':
        return propertyType.nameTh || propertyType.nameEn || propertyType.name;
      case 'zh':
        return propertyType.nameCh || propertyType.nameEn || propertyType.name;
      case 'ru':
        return propertyType.nameRu || propertyType.nameEn || propertyType.name;
      default:
        return propertyType.nameEn || propertyType.name;
    }
  };

  return (
    <section className="form-section">
      <h2>Property Type*</h2>
      
      {/* Hidden input for react-hook-form to track the selected property type */}
      <input
        type="hidden"
        {...register('propertyType', { 
          required: 'Please select a property type'
        })}
        defaultValue={formData.propertyType}
      />
      
      <div className="property-type-grid">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading property types...</p>
          </div>
        ) : propertyTypes.length > 0 ? (
          propertyTypes.map((type) => (
            <div
              key={type.id}
              className={`property-type-option ${String(propertyType) === String(type.id) ? 'active' : ''}`}
              onClick={() => selectPropertyType(String(type.id))}
            >
              {getLocalizedName(type)}
            </div>
          ))
        ) : (
          <div className="no-data-message">
            <p>No property types available</p>
          </div>
        )}
      </div>
      
      {errors.propertyType && (
        <p className="error-message">{errors.propertyType.message}</p>
      )}
    </section>
  );
};

export default PropertyTypeSection;
