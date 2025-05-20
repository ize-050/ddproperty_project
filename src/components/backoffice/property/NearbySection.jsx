'use client';

import React from 'react';
import { 
  FaTree, 
  FaShoppingCart, 
  FaTrain, 
  FaBus, 
  FaHospital, 
  FaPlane, 
  FaUmbrellaBeach, 
  FaSchool 
} from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const NearbySection = () => {
  const { formData, setNearby } = usePropertyFormStore();

  const handleNearbyClick = (nearby) => {
    setNearby(nearby, !formData.nearby[nearby]);
  };

  const nearbyOptions = [
    { id: 'nearPark', label: 'Near Park', icon: <FaTree /> },
    { id: 'nearMall', label: 'Near Mall', icon: <FaShoppingCart /> },
    { id: 'nearTrainStation', label: 'Near Train Station', icon: <FaTrain /> },
    { id: 'nearTransportation', label: 'Near Transportation', icon: <FaBus /> },
    { id: 'nearHospital', label: 'Near Hospital', icon: <FaHospital /> },
    { id: 'nearAirport', label: 'Near Airport', icon: <FaPlane /> },
    { id: 'nearBeach', label: 'Near Beach', icon: <FaUmbrellaBeach /> },
    { id: 'nearMarket', label: 'Near Market', icon: <FaShoppingCart /> },
    { id: 'nearSchool', label: 'Near School', icon: <FaSchool /> },
  ];

  return (
    <section className="form-section">
      <h2>Near by</h2>
      <div className="selection-grid">
        {nearbyOptions.map((item) => (
          <div 
            key={item.id}
            className={`selection-item with-icon ${formData.nearby && formData.nearby[item.id] ? 'active' : ''}`}
            onClick={() => handleNearbyClick(item.id)}
          >
            <span className="selection-icon">{item.icon}</span>
            <span className="selection-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NearbySection;
