'use client';

import React from 'react';
import { FaHome, FaPaw, FaBuilding, FaMoneyBillWave, FaHandshake } from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const PropertyHighlightsSection = () => {
  const { formData, setHighlight } = usePropertyFormStore();

  const handleHighlightClick = (highlight) => {
    setHighlight(highlight, !formData.highlights[highlight]);
  };

  const roomTypes = [
    { id: 'duplex', label: 'Duplex' },
    { id: 'penthouse', label: 'Penthouse' },
    { id: 'oneBedPlus', label: '1 Bed Plus' },
    { id: 'duplexPenthouse', label: 'Duplex Penthouse' },
  ];

  const highlights = [
    { id: 'brandNew', label: 'Brand-New Property' },
    { id: 'petsAllowed', label: 'Pets Allowed' },
    { id: 'companyRegistration', label: 'Company Registration' },
    { id: 'rentToOwn', label: 'Rent to own' },
    { id: 'npaAssets', label: 'NPA Assets' },
    { id: 'foreignerQuota', label: 'Foreigner Quota' },
    { id: 'saleDown', label: 'Sale Down' },
  ];

  const propertyLabels = [
    { id: 'newDevelopment', label: 'New Development' },
    { id: 'newListing', label: 'New Listing' },
    { id: 'reducePrice', label: 'Reduce Price' },
    { id: 'resale', label: 'Resale' },
    { id: 'underConstruction', label: 'Under Construction' },
    { id: 'hotOffer', label: 'Hot Offer' },
    { id: 'rented', label: 'Rented' },
    { id: 'sold', label: 'Sold' },
  ];

  return (
    <>
      <section className="form-section">
        <h2>More Room Type</h2>
        <div className="selection-grid">
          {roomTypes.map((item) => (
            <div 
              key={item.id}
              className={`selection-item ${formData.highlights && formData.highlights[item.id] ? 'active' : ''}`}
              onClick={() => handleHighlightClick(item.id)}
            >
              <span className="selection-label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h2>Property Highlights</h2>
        <div className="selection-grid">
          {highlights.map((item) => (
            <div 
              key={item.id}
              className={`selection-item ${formData.highlights && formData.highlights[item.id] ? 'active' : ''}`}
              onClick={() => handleHighlightClick(item.id)}
            >
              <span className="selection-label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h2>Property Label</h2>
        <div className="selection-grid">
          {propertyLabels.map((item) => (
            <div 
              key={item.id}
              className={`selection-item ${formData.highlights && formData.highlights[item.id] ? 'active' : ''}`}
              onClick={() => handleHighlightClick(item.id)}
            >
              <span className="selection-label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PropertyHighlightsSection;
