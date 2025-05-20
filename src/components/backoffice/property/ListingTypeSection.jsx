'use client';

import React from 'react';
import usePropertyFormStore from '@/store/propertyFormStore';

const ListingTypeSection = () => {
  const { formData, setStatus } = usePropertyFormStore();

  return (
    <section className="form-section">
      <h2>Listing Type*</h2>
      <div className="listing-type-options">
        <div
          className={`listing-option ${formData.status === 'SALE' ? 'active' : ''}`}
          onClick={() => setStatus('SALE')}
        >
          For Sale
        </div>
        <div
          className={`listing-option ${formData.status === 'RENT' ? 'active' : ''}`}
          onClick={() => setStatus('RENT')}
        >
          For Rent
        </div>
        <div
          className={`listing-option ${formData.status === 'SALE_RENT' ? 'active' : ''}`}
          onClick={() => setStatus('SALE_RENT')}
        >
          For Sale &amp; Rent
        </div>
      </div>
    </section>
  );
};

export default ListingTypeSection;
