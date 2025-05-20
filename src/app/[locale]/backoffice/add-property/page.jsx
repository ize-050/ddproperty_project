'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import ListingTypeSection from '@/components/backoffice/property/ListingTypeSection';
import PropertyInfoSection from '@/components/backoffice/property/PropertyInfoSection';
import LocationSection from '@/components/backoffice/property/LocationSection';
import PropertyTypeSection from '@/components/backoffice/property/PropertyTypeSection';
import PricingSection from '@/components/backoffice/property/PricingSection';
import PropertyDetailSection from '@/components/backoffice/property/PropertyDetailSection';
import FeaturesSection from '@/components/backoffice/property/FeaturesSection';
import PropertyHighlightsSection from '@/components/backoffice/property/PropertyHighlightsSection';
import NearbySection from '@/components/backoffice/property/NearbySection';
import ViewSection from '@/components/backoffice/property/ViewSection';
import FacilitiesSection from '@/components/backoffice/property/FacilitiesSection';
import PhotosSection from '@/components/backoffice/property/PhotosSection';
import usePropertyFormStore from '@/store/propertyFormStore';
import '@/styles/backoffice/add-property.scss';

const AddNewProperty = () => {
  const router = useRouter();
  const { formData, propertyImages, resetForm } = usePropertyFormStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData);
    console.log('Images:', propertyImages);
    
    // Redirect to my properties page after submission
    // router.push('/backoffice/my-properties');
  };

  const handlePropertyTypeClick = (type) => {
    const currentTypes = [...formData.propertyTypes];

    if (currentTypes.includes(type)) {
      // ลบประเภทออกถ้าเลือกอยู่แล้ว
      const updatedTypes = currentTypes.filter(t => t !== type);
      setFormData({ ...formData, propertyTypes: updatedTypes });
    } else {
      // เพิ่มประเภทถ้ายังไม่ได้เลือก
      setFormData({ ...formData, propertyTypes: [...currentTypes, type] });
    }
  };

  return (
    <BackofficeLayout>
      <div className="add-property-container">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1>Add/New Property</h1>
              <p>create property details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <ListingTypeSection />
          <PropertyTypeSection />
          <PropertyInfoSection />
          <PropertyDetailSection />
          <LocationSection />
          <PricingSection />
          <PropertyHighlightsSection />
          <NearbySection />
          <ViewSection />
          <FacilitiesSection />
          <FeaturesSection />

          <PhotosSection />

          {/* Terms & Conditions */}
          <section className="form-section">
            <div className="terms-container">
              <input type="checkbox" id="termsAgree" required />
              <label htmlFor="termsAgree">I confirm that all information provided is accurate and I have rights to list this property</label>
            </div>
          </section>

          {/* Form Buttons */}
          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </BackofficeLayout>
  );
};

export default AddNewProperty;
