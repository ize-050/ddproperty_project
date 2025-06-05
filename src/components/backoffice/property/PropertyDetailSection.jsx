'use client';

import React, { useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';

const PropertyDetailSection = () => {
  const { formData, setFormData } = usePropertyFormStore();
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  
  // ติดตามการเปลี่ยนแปลงค่าใน form และอัพเดท store
  const watchedFields = watch();
  
  useEffect(() => {
    // อัพเดท store เมื่อมีการเปลี่ยนแปลงค่าใน form
    const updateStore = () => {
      const fieldsToUpdate = [
        'propertyId', 'ownershipQuota', 'landSize', 'landSizeUnit',
        'usableArea', 'floors', 'furnishing', 'bedrooms', 'bathrooms',
        'constructionYear', 'communityFees'
      ];
      
      const updates = {};
      fieldsToUpdate.forEach(field => {
        if (watchedFields[field] !== undefined && watchedFields[field] !== formData[field]) {
          updates[field] = watchedFields[field];
        }
      });
      
      if (Object.keys(updates).length > 0) {
        setFormData(updates);
      }
    };
    
    updateStore();
  }, [watchedFields, setFormData, formData]);
  
  // ตั้งค่าเริ่มต้นจาก store ไปยัง form
  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key, value);
      }
    });
  }, []);

  return (
    <section className="form-section">
      <div className="section-header">
        <FaInfoCircle className="section-icon" />
        <h2>Project Detail</h2>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="propertyId">Property ID (Auto Generate)</label>
          <input
            type="text"
            id="propertyId"

            disabled
            {...register('propertyId')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownershipQuota">Ownership Quota*</label>
          <select
            id="ownershipQuota"
            {...register('ownershipQuota', { required: 'This field is required' })}
          >
            <option value="">-</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
          </select>
          {errors.ownershipQuota && <p className="error-message">{errors.ownershipQuota.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="landSize">Land Size*</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="landSize"
              {...register('landSize', { required: 'This field is required' })}
            />
            <div className="unit-options">
              <span 
                className={watch('landSizeUnit') === 'rai' ? 'active' : ''} 
                onClick={() => setValue('landSizeUnit', 'rai', { shouldDirty: true })}>
                Rai
              </span>
              <span 
                className={watch('landSizeUnit') === 'ngan' ? 'active' : ''} 
                onClick={() => setValue('landSizeUnit', 'ngan', { shouldDirty: true })}>
                Ngan
              </span>
              <span 
                className={watch('landSizeUnit') === 'sqwah' ? 'active' : ''} 
                onClick={() => setValue('landSizeUnit', 'sqwah', { shouldDirty: true })}>
                Sq.wah
              </span>
            </div>
          </div>
          {errors.landSize && <p className="error-message">{errors.landSize.message}</p>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="usableArea">Usable Area*</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="usableArea"
              {...register('usableArea', { required: 'This field is required' })}
            />
            <span className="unit">Sq.m.</span>
          </div>
          {errors.usableArea && <p className="error-message">{errors.usableArea.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="floors">Floors*</label>
          <select
            id="floors"
            {...register('floors', { required: 'This field is required' })}
          >
            <option value="">-</option>
            {[...Array(50)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
          {errors.floors && <p className="error-message">{errors.floors.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="furnishing">Furnishing</label>
          <select
            id="furnishing"
            {...register('furnishing')}
          >
            <option value="">-</option>
            <option value="FULLY_FURNISHED">Fully Furnished</option>
            <option value="PARTIALLY_FURNISHED">Partially Furnished</option>
            <option value="UNFURNISHED">Unfurnished</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms*</label>
          <select
            id="bedrooms"
            {...register('bedrooms', { required: 'This field is required' })}
          >
            <option value="">-</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
            <option value="10+">10+</option>
          </select>
          {errors.bedrooms && <p className="error-message">{errors.bedrooms.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms*</label>
          <select
            id="bathrooms"
            {...register('bathrooms', { required: 'This field is required' })}
          >
            <option value="">-</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
            <option value="10+">10+</option>
          </select>
          {errors.bathrooms && <p className="error-message">{errors.bathrooms.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="constructionYear">Construction Year</label>
          <select
            id="constructionYear"
            {...register('constructionYear')}
          >
            <option value="">-</option>
            {[...Array(50)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="communityFees">Community Fees</label>
          <div className="input-with-unit">
            <input
              type="text"
              id="communityFees"
              {...register('communityFees')}
            />
            <span className="unit">/ Year</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyDetailSection;
