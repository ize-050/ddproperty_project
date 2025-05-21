'use client';

import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';

const PropertyInfoSection = () => {
  const { formData } = usePropertyFormStore();
  const { register, formState: { errors } } = useFormContext();
  
  // CSS class for error styling
  const getInputClassName = (fieldName) => {
    return errors[fieldName] ? 'is-invalid' : '';
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <FaMapMarkerAlt className="section-icon" />
        <h2>Property Information*</h2>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="projectName">Project Name*</label>
          <input
            type="text"
            id="projectName"
            className={`form-control ${errors.projectName ? 'is-invalid' : ''}`}
            defaultValue={formData.projectName}
            placeholder="e.g. Chonburi"
            {...register('projectName', { required: 'Project name is required' })}
          />
          {errors.projectName && (
            <div className="invalid-feedback">{errors.projectName.message}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="area">Area (sqm)*</label>
          <input
            type="text"
            id="area"
            className={`form-control ${errors.area ? 'is-invalid' : ''}`}
            defaultValue={formData.area}
            placeholder="e.g. 45"
            {...register('area', { required: 'Area is required' })}
          />
          {errors.area && (
            <div className="invalid-feedback">{errors.area.message}</div>
          )}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="propertyTitle">Property Title*</label>
          <input
            type="text"
            id="propertyTitle"
            className="form-control"
            style={errors.propertyTitle ? {border: '1px solid #dc3545', boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'} : {}}
            defaultValue={formData.propertyTitle}
            placeholder="e.g. Luxury Condo in City Center"
            {...register('propertyTitle', { required: 'Property title is required' })}
          />
          {errors.propertyTitle && (
            <div className="invalid-feedback">{errors.propertyTitle.message}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="referenceId">Reference ID</label>
          <input
            type="text"
            id="referenceId"
            className="form-control"
            defaultValue={formData.referenceId}
            placeholder="e.g. PROP123"
            {...register('referenceId')}
          />
        </div>
      </div>


    </section>
  );
};

export default PropertyInfoSection;
