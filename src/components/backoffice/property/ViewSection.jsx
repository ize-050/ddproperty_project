'use client';

import React from 'react';
import { 
  FaWater, 
  FaCity, 
  FaTree, 
  FaMountain, 
  FaSwimmingPool 
} from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const ViewSection = () => {
  const { formData, setView } = usePropertyFormStore();

  const handleViewClick = (view) => {
    setView(view, !formData.views[view]);
  };

  const viewOptions = [
    { id: 'seaView', label: 'Sea View', icon: <FaWater /> },
    { id: 'cityView', label: 'City View', icon: <FaCity /> },
    { id: 'gardenView', label: 'Garden View', icon: <FaTree /> },
    { id: 'lakeView', label: 'Lake View', icon: <FaWater /> },
    { id: 'mountainView', label: 'Mountain View', icon: <FaMountain /> },
    { id: 'poolView', label: 'Pool View', icon: <FaSwimmingPool /> },
  ];

  return (
    <section className="form-section">
      <h2>View</h2>
      <div className="selection-grid">
        {viewOptions.map((item) => (
          <div 
            key={item.id}
            className={`selection-item with-icon ${formData.views && formData.views[item.id] ? 'active' : ''}`}
            onClick={() => handleViewClick(item.id)}
          >
            <span className="selection-icon">{item.icon}</span>
            <span className="selection-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ViewSection;
