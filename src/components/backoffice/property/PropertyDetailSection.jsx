'use client';

import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const PropertyDetailSection = () => {
  const { formData, setFormData } = usePropertyFormStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

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
            name="propertyId"
            value={formData.propertyId || 'DP000022'}
            onChange={handleInputChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownershipQuota">Ownership Quota*</label>
          <select
            id="ownershipQuota"
            name="ownershipQuota"
            value={formData.ownershipQuota || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">-</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="landSize">Land Size*</label>
          <div className="input-with-unit">
            <input
              type="text"
              id="landSize"
              name="landSize"
              value={formData.landSize || ''}
              onChange={handleInputChange}
              required
            />
            <div className="unit-options">
              <span className={formData.landSizeUnit === 'rai' ? 'active' : ''} onClick={() => setFormData({ landSizeUnit: 'rai' })}>Rai</span>
              <span className={formData.landSizeUnit === 'ngan' ? 'active' : ''} onClick={() => setFormData({ landSizeUnit: 'ngan' })}>Ngan</span>
              <span className={formData.landSizeUnit === 'sqwah' ? 'active' : ''} onClick={() => setFormData({ landSizeUnit: 'sqwah' })}>Sq.wah</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="usableArea">Usable Area*</label>
          <div className="input-with-unit">
            <input
              type="text"
              id="usableArea"
              name="usableArea"
              value={formData.usableArea || ''}
              onChange={handleInputChange}
              required
            />
            <span className="unit">Sq.m.</span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="floors">Floors*</label>
          <select
            id="floors"
            name="floors"
            value={formData.floors || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">-</option>
            {[...Array(50)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="furnishing">Furnishing</label>
          <select
            id="furnishing"
            name="furnishing"
            value={formData.furnishing || ''}
            onChange={handleInputChange}
          >
            <option value="">-</option>
            <option value="fully_furnished">Fully Furnished</option>
            <option value="partially_furnished">Partially Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms*</label>
          <select
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">-</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
            <option value="10+">10+</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms*</label>
          <select
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">-</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
            <option value="10+">10+</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="constructionYear">Construction Year</label>
          <select
            id="constructionYear"
            name="constructionYear"
            value={formData.constructionYear || ''}
            onChange={handleInputChange}
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
              name="communityFees"
              value={formData.communityFees || ''}
              onChange={handleInputChange}
            />
            <span className="unit">/ Year</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyDetailSection;
