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
        'propertyId', 'ownershipQuota', 'land_size_rai', 'land_size_ngan', 'land_size_sq_wah',
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
            defaultValue="freehold"
            className={`form-control custom-select ${errors.ownershipQuota ? 'is-invalid' : ''}`}
            {...register('ownershipQuota', { required: 'Ownership quota is required' })}
          >
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
          </select>
          {errors.ownershipQuota && <p className="error-message">{errors.ownershipQuota.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="landSize">Land Size</label>
          <div className="land-size-grid">
            <div className="land-size-item">
              <input
                type="number"
                id="landSizeRai"
                className="form-control"
                placeholder="0"
                {...register('land_size_rai')}
              />
              <span className="unit-label">Rai</span>
            </div>
            <div className="land-size-item">
              <input
                type="number"
                id="landSizeNgan"
                className="form-control"
                placeholder="0"
                {...register('land_size_ngan')}
              />
              <span className="unit-label">Ngan</span>
            </div>
            <div className="land-size-item">
              <input
                type="number"
                id="landSizeSqWah"
                className="form-control"
                placeholder="0"
                {...register('land_size_sq_wah')}
              />
              <span className="unit-label">Sq.wah</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="usableArea">Usable Area*</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="usableArea"
              {...register('usableArea', { required: 'Usable area is required' })}
            />
            <span className="unit">Sq.m.</span>
          </div>
          {errors.usableArea && <p className="error-message">{errors.usableArea.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="floors">Floors*</label>
          <select
            id="floors"
            className={`form-control custom-select ${errors.floors ? 'is-invalid' : ''}`}
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
            defaultValue="FULLY_FURNISHED"
            className={`form-control custom-select ${errors.furnishing ? 'is-invalid' : ''}`}
            {...register('furnishing' , {required: 'Furnishing is required'})}
          >
            <option value="FULLY_FURNISHED">Fully Furnished</option>
            <option value="PARTIALLY_FURNISHED">Partially Furnished</option>
            <option value="UNFURNISHED">Unfurnished</option>
          </select>
          {errors.furnishing && <p className="error-message">{errors.furnishing.message}</p>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms*</label>
          <select
            id="bedrooms"
            defaultValue={1}
            className={`form-control custom-select ${errors.bedrooms ? 'is-invalid' : ''}`}
            {...register('bedrooms', { required: 'This field is required' })}
          >
            
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          {errors.bedrooms && <p className="error-message">{errors.bedrooms.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms*</label>
          <select
            id="bathrooms"
            defaultValue={1}
            className={`form-control custom-select ${errors.bathrooms ? 'is-invalid' : ''}`}
            {...register('bathrooms', { required: 'This field is required' })}
          >

            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          {errors.bathrooms && <p className="error-message">{errors.bathrooms.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="constructionYear">Construction Year</label>
          <select
            id="constructionYear"
            defaultValue={new Date().getFullYear()}
            className={`form-control custom-select ${errors.constructionYear ? 'is-invalid' : ''}`}
            {...register('constructionYear', { required: 'This field is required' })}
          >
            {[...Array(50)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
          {errors.constructionYear && <p className="error-message">{errors.constructionYear.message}</p>}
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
          {errors.communityFees && <p className="error-message">{errors.communityFees.message}</p>}
        </div>
        <div className="form-group"></div>
        <div className="form-group"></div>
      </div>
    </section>
  );
};

export default PropertyDetailSection;
