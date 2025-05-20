'use client';

import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const PropertyInfoSection = () => {
  const { formData, setFormData } = usePropertyFormStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <FaMapMarkerAlt className="section-icon" />
        <h2>Property Information*</h2>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            placeholder="e.g. Chonburi"
          />
        </div>
        <div className="form-group">
          <label htmlFor="area">Area</label>
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            placeholder=""
          />
        </div>
      </div>


    </section>
  );
};

export default PropertyInfoSection;
