// src/components/common/DynamicPropertyTypes.jsx
'use client'

import React from 'react';
import { usePropertyTypeUtils } from '@/utils/propertyTypeUtils';

// Import static data
import apartmentType from '@/data/apartmentType';
import apartmentTypes2 from '@/data/apartmentTypes2';

/**
 * Component demonstrating dynamic property type translations
 * This replaces hardcoded static translations with database-driven dynamic translations
 */
const DynamicPropertyTypes = ({ variant = 'default' }) => {
  const { 
    transformApartmentTypes, 
    getPropertyTypeText, 
    getListingTypeText,
    loading 
  } = usePropertyTypeUtils();

  // Show loading state while translations are being fetched
  if (loading) {
    return (
      <div className="dynamic-property-types loading">
        <div className="loading-spinner">Loading translations...</div>
      </div>
    );
  }

  // Transform static data with dynamic translations
  const dynamicApartmentTypes = transformApartmentTypes(apartmentType);
  const dynamicApartmentTypes2 = transformApartmentTypes(apartmentTypes2);

  // Example usage for different variants
  const renderPropertyTypeGrid = (data, title) => (
    <div className="property-type-section">
      <h3>{title}</h3>
      <div className="property-type-grid">
        {data.map((item, index) => (
          <div key={item.id || index} className="property-type-card">
            <div className="property-icon">
              <i className={item.icon || 'flaticon-home'}></i>
            </div>
            <div className="property-info">
              <h4>{item.title}</h4>
              <span className="property-count">
                {item.count || item.properties || 0} properties
              </span>
              {/* Show original title for debugging */}
              <small className="original-title">
                Original: {item.originalTitle}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Example of individual property type translations
  const renderIndividualTranslations = () => (
    <div className="individual-translations">
      <h3>Individual Property Type Translations</h3>
      <div className="translation-examples">
        {['CONDO', 'HOUSE', 'TOWNHOUSE', 'LAND', 'APARTMENT', 'COMMERCIAL'].map(type => (
          <div key={type} className="translation-item">
            <strong>{type}:</strong> {getPropertyTypeText(type)}
          </div>
        ))}
      </div>
      
      <h3>Listing Type Translations</h3>
      <div className="translation-examples">
        {['SALE', 'RENT'].map(type => (
          <div key={type} className="translation-item">
            <strong>{type}:</strong> {getListingTypeText(type)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dynamic-property-types">
      {variant === 'grid1' && renderPropertyTypeGrid(dynamicApartmentTypes, 'Property Types (Grid 1)')}
      {variant === 'grid2' && renderPropertyTypeGrid(dynamicApartmentTypes2, 'Property Types (Grid 2)')}
      {variant === 'examples' && renderIndividualTranslations()}
      {variant === 'default' && (
        <>
          {renderPropertyTypeGrid(dynamicApartmentTypes, 'Property Types (Grid 1)')}
          {renderPropertyTypeGrid(dynamicApartmentTypes2, 'Property Types (Grid 2)')}
          {renderIndividualTranslations()}
        </>
      )}
    </div>
  );
};

export default DynamicPropertyTypes;
