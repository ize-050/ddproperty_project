'use client';

import React from 'react';
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

const FeaturesSection = () => {
  const { formData, setFeature } = usePropertyFormStore();

  const handleFeatureClick = (feature) => {
    setFeature(feature, !formData.features[feature]);
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
            className={`amenity-item ${formData.features[amenity.id] ? 'active' : ''}`}
            onClick={() => handleFeatureClick(amenity.id)}
          >
            <span className="amenity-icon">{amenity.icon}</span>
            <span className="amenity-label">{amenity.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
