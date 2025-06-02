'use client';

import React, { useEffect, useState } from 'react';
import { 
  FaSnowflake, 
  FaUtensils, 
  FaTshirt, 
  FaWind, 
  FaMusic, 
  FaBoxOpen, 
  FaBuilding, 
  FaTint, 
  FaWifi, 
  FaTv, 
  FaWarehouse,
  FaHome
} from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';
import { useFormContext } from 'react-hook-form';

const FeaturesSection = () => {
  const { formData, setFeature } = usePropertyFormStore();
  const { register, setValue } = useFormContext();
  const [amenityState, setAmenityState] = useState({});

  // Initialize amenities data in React Hook Form and local state
  useEffect(() => {
    // Register amenities field with React Hook Form
    register('amenities');
    
    // Initialize local state from Zustand store
    setAmenityState(formData.features || {});
    
    // Set initial value to the entire features object with true/false values
    setValue('amenities', formData.features || {});
  }, [register, setValue, formData.features]);

  const handleFeatureClick = (feature) => {
    // Toggle state
    const newValue = !(amenityState[feature] || false);
    
    // Update local state for immediate UI feedback
    setAmenityState(prev => ({
      ...prev,
      [feature]: newValue
    }));
    
    // Update Zustand store
    setFeature(feature, newValue);
    
    // Update React Hook Form with the complete features object
    const updatedFeatures = {
      ...formData.features,
      [feature]: newValue
    };
    
    // Set the entire features object to React Hook Form
    setValue('amenities', updatedFeatures);

    // Log for debugging
    console.log(`Clicked ${feature}. New value: ${newValue}`, updatedFeatures);
  };

  const amenities = [
    { id: 'airConditioner', label: 'Air-conditioner', icon: <FaSnowflake /> },
    { id: 'bbq', label: 'BBQ', icon: <FaUtensils /> },
    { id: 'dryerMachine', label: 'Dryer Machine', icon: <FaTshirt /> },
    { id: 'hairDryer', label: 'Hair Dryer', icon: <FaWind /> },
    { id: 'karaokeBox', label: 'Karaoke Box', icon: <FaMusic /> },
    { id: 'kitchenware', label: 'Kitchenware', icon: <FaBoxOpen /> },
    { id: 'microWave', label: 'Micro Wave', icon: <FaUtensils /> },
    { id: 'oven', label: 'Oven', icon: <FaUtensils /> },
    { id: 'privateLift', label: 'Private lift', icon: <FaHome /> },
    { id: 'refrigerator', label: 'Refrigerator', icon: <FaBoxOpen /> },
    { id: 'tv', label: 'TV', icon: <FaTv /> },
    { id: 'wardrobe', label: 'Wardrobe', icon: <FaWarehouse /> },
    { id: 'washingMachine', label: 'Washing Machine', icon: <FaTshirt /> },
    { id: 'waterHeater', label: 'Water Heater', icon: <FaTint /> },
    { id: 'wifi', label: 'Wi-Fi', icon: <FaWifi /> },
    { id: 'homeSecurity', label: 'Home Security', icon: <FaHome /> },
  ];

  return (
    <section className="form-section">
      <h2>Amenity</h2>
      <div className="amenities-grid">
        {amenities.map((amenity) => (
          <div 
            key={amenity.id}
            className={`amenity-item ${amenityState[amenity.id] ? 'active' : ''}`}
            onClick={() => handleFeatureClick(amenity.id)}
          >
            <span className="amenity-icon">{amenity.icon}</span>
            <span className="amenity-label">{amenity.label}</span>
          </div>
        ))}
      </div>
      {/* Hidden input to hold the amenities data for form submission */}
      <input type="hidden" {...register('amenities')} />
    </section>
  );
};

export default FeaturesSection;
