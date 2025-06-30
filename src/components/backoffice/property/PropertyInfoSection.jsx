'use client';

import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';
import Image from 'next/image';

const PropertyInfoSection = () => {
  const { formData } = usePropertyFormStore();
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // CSS class for error styling
  const getInputClassName = (fieldName) => {
    return errors[fieldName] ? 'is-invalid' : '';
  };

  // Fetch zones from API
  useEffect(() => {
    const fetchZones = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/zones`;
        const response = await fetch(apiUrl, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch zones');
        }
        
        const data = await response.json();
        setZones(data.data || []);
        
        // If formData has zone_id, set the zone_id value in the form
        if (formData.zone_id) {
          setValue('zone_id', formData.zone_id);
        }
      } catch (err) {
        console.error('Error fetching zones:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchZones();
  }, [formData.zone_id, setValue]);

  // Handle zone selection change to update both visible area name and hidden zone_id
  const handleZoneChange = (e) => {
    const zoneId = e.target.value;
    const selectedZone = zones.find(zone => zone.id === parseInt(zoneId));
    
    if (selectedZone) {
      setValue('area', selectedZone.name);
      setValue('zone_id', selectedZone.id);
    }
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <Image
          src="/images/icons/iconproperty/property_information.svg"
          alt="Property Information"
          width={24}
          height={24}
          className="section-icon"
        />
        <h2 className="section-title">Property Information*</h2>
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
          <label htmlFor="zone_id">Area*</label>
          {isLoading ? (
            <div className="loading-spinner">Loading zones...</div>
          ) : error ? (
            <div className="error-message">Error loading zones: {error}</div>
          ) : (
            <>
              <select
                id="zone_id"
                className={`form-control custom-select ${errors.zone_id ? 'is-invalid' : ''}`}
                defaultValue={formData.zone_id || ''}
                {...register('zone_id', { required: 'Area is required' })}
                onChange={handleZoneChange}
              >
                <option value="" disabled>Select area</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
              {/* Hidden field to store area name for backward compatibility */}
              <input type="hidden" {...register('area')} />
            </>
          )}
          {errors.zone_id && (
            <div className="invalid-feedback">{errors.zone_id.message}</div>
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

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Property Display</label>
          <div className="radio-group">
            <div className="form-check">
              <input
                type="radio"
                id="featured-no"
                className="form-check-input"
                value="false"
                checked={watch('isFeatured') === false || watch('isFeatured') === 'false' || watch('isFeatured') === undefined || watch('isFeatured') === null}
                {...register('isFeatured')}
              />
              <label htmlFor="featured-no" className="form-check-label">
                Normal Property
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="featured-yes"
                className="form-check-input"
                value="true"
                checked={watch('isFeatured') === true || watch('isFeatured') === 'true'}
                {...register('isFeatured')}
              />
              <label htmlFor="featured-yes" className="form-check-label">
                Featured Property (Show on Homepage)
              </label>
            </div>
          </div>
          <small className="form-text text-muted">
            Featured properties will appear in the random/popular section on the homepage
          </small>
        </div>
      </div>
    </section>
  );
};

export default PropertyInfoSection;
