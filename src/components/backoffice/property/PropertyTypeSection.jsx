'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';

const PropertyTypeSection = () => {
  const { formData, setPropertyType } = usePropertyFormStore();
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  // ติดตามการเปลี่ยนแปลงของ propertyType ใน form
  const propertyType = watch('propertyType') || '';
  
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
  const selectPropertyType = (type) => {
    // เลือกประเภทอสังหาริมทรัพย์เพียงอย่างเดียว
    setValue('propertyType', type, { shouldValidate: true, shouldDirty: true });
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
      />
      
      <div className="property-type-grid">
        <div
          className={`property-type-option ${propertyType === 'CONDO' ? 'active' : ''}`}
          onClick={() => selectPropertyType('CONDO')}
        >
          Condominium
        </div>
        <div
          className={`property-type-option ${propertyType === 'APARTMENT' ? 'active' : ''}`}
          onClick={() => selectPropertyType('APARTMENT')}
        >
          Apartment
        </div>
        <div
          className={`property-type-option ${propertyType === 'HOUSE' ? 'active' : ''}`}
          onClick={() => selectPropertyType('HOUSE')}
        >
          House / Single House
        </div>
        <div
          className={`property-type-option ${propertyType === 'TWIN_HOUSE' ? 'active' : ''}`}
          onClick={() => selectPropertyType('TWIN_HOUSE')}
        >
          Twin House
        </div>
        <div
          className={`property-type-option ${propertyType === 'TOWNHOUSE' ? 'active' : ''}`}
          onClick={() => selectPropertyType('TOWNHOUSE')}
        >
          Townhome/Townhouse
        </div>
        <div
          className={`property-type-option ${propertyType === 'POOL_VILLA' ? 'active' : ''}`}
          onClick={() => selectPropertyType('POOL_VILLA')}
        >
          Pool Villa
        </div>
        <div
          className={`property-type-option ${propertyType === 'HOME_OFFICE' ? 'active' : ''}`}
          onClick={() => selectPropertyType('HOME_OFFICE')}
        >
          Home Office
        </div>
        <div
          className={`property-type-option ${propertyType === 'COMMERCIAL' ? 'active' : ''}`}
          onClick={() => selectPropertyType('COMMERCIAL')}
        >
          Commercial Building
        </div>
        <div
          className={`property-type-option ${propertyType === 'LAND' ? 'active' : ''}`}
          onClick={() => selectPropertyType('LAND')}
        >
          Land
        </div>
      </div>
      
      {errors.propertyType && (
        <p className="error-message">{errors.propertyType.message}</p>
      )}
    </section>
  );
};

export default PropertyTypeSection;
