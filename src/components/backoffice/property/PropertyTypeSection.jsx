'use client';

import React from 'react';
import usePropertyFormStore from '@/store/propertyFormStore';

const PropertyTypeSection = () => {
  const { formData, setPropertyType } = usePropertyFormStore();

  return (
    <section className="form-section">
      <h2>Property Type*</h2>
      <div className="property-type-grid">
        <div
          className={`property-type-option ${formData.propertyTypes.includes('CONDO') ? 'active' : ''}`}
          onClick={() => setPropertyType('CONDO')}
        >
          Condominium
        </div>
        <div
          className={`property-type-option ${formData.propertyTypes.includes('APARTMENT') ? 'active' : ''}`}
          onClick={() => setPropertyType('APARTMENT')}
        >
          Apartment
        </div>
        <div
          className={`property-type-option ${formData.propertyTypes.includes('HOUSE') ? 'active' : ''}`}
          onClick={() => setPropertyType('HOUSE')}
        >
          House / Single House
        </div>
        <div
          className={`property-type-option ${formData.propertyTypes.includes('TWIN_HOUSE') ? 'active' : ''}`}
          onClick={() => setPropertyType('TWIN_HOUSE')}
        >
          Twin House
        </div>
        <div
          className={`property-type-option ${formData.propertyTypes.includes('TOWNHOUSE') ? 'active' : ''}`}
          onClick={() => setPropertyType('TOWNHOUSE')}
        >
          Townhome/Townhouse
        </div>
        <div
          className={`property-type-option ${formData.propertyTypes.includes('POOL_VILLA') ? 'active' : ''}`}
          onClick={() => setPropertyType('POOL_VILLA')}
        >
          Pool Villa
        </div>
        <div
          className={`property-type-option ${formData.propertyTypes.includes('HOME_OFFICE') ? 'active' : ''}`}
          onClick={() => setPropertyType('HOME_OFFICE')}
        >
          Home Office
        </div>
        <div
          className={`property-type-option ${formData.propertyTypes.includes('COMMERCIAL') ? 'active' : ''}`}
          onClick={() => setPropertyType('COMMERCIAL')}
        >
          Commercial Building
        </div>
        <div
          className={`property-type-option ${formData.propertyTypes.includes('LAND') ? 'active' : ''}`}
          onClick={() => setPropertyType('LAND')}
        >
          Land
        </div>
      </div>
    </section>
  );
};

export default PropertyTypeSection;
