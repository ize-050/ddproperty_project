'use client';

import React, { useState, useEffect } from 'react';
import usePropertyFormStore from '@/store/propertyFormStore';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';

const MoreRoomTypeSection = () => {
  const { formData, setPropertyLabel, initializePropertyLabels } = usePropertyFormStore();
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const { register, setValue, watch } = useFormContext();

  // Static room types (not from database)
  const roomTypes = [
    { key: 'duplex', name: 'Duplex' },
    { key: 'penthouse', name: 'Penthouse' },
    { key: '1-bed-plus', name: '1 Bed Plus' },
    { key: 'duplex-penthouse', name: 'Duplex Penthouse' }
  ];

  // Watch for property type changes
  const watchPropertyType = watch('propertyType');

  // Initialize room type data
  useEffect(() => {
    if (formData.propertyLabels) {
      // Find which room type is active
      const activeRoomType = roomTypes.find(roomType => 
        formData.propertyLabels[roomType.key]?.active
      );
      setSelectedRoomType(activeRoomType?.key || '');
    }
  }, [formData.propertyLabels]);

  // Handle room type selection (radio button behavior)
  const handleRoomTypeSelect = (roomTypeKey) => {
    // Clear all room types first
    roomTypes.forEach(roomType => {
      setPropertyLabel(roomType.key, false, null);
      setValue(`propertyLabels.${roomType.key}`, {
        active: false,
        iconId: null
      });
    });

    // Set the selected room type as active
    if (selectedRoomType !== roomTypeKey) {
      setPropertyLabel(roomTypeKey, true, null);
      setValue(`propertyLabels.${roomTypeKey}`, {
        active: true,
        iconId: null
      });
      setSelectedRoomType(roomTypeKey);
    } else {
      // If clicking the same room type, deselect it
      setSelectedRoomType('');
    }
  };

  // Don't show section if no property type is selected
  if (!watchPropertyType) {
    return null;
  }

  // CSS styles for active items (same as PropertyHighlights)
  const activeStyle = {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    color: '#000',
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <Image 
          src="/images/icons/iconproperty/property_type.svg" 
          alt="Room Type" 
          width={24} 
          height={24} 
          className="section-icon"
        />
        <h2 className="section-title">More Room Type</h2>
      </div>
      
      <div className="amenities-grid">
        {roomTypes.map((roomType) => {
          const isActive = selectedRoomType === roomType.key;
          const fieldName = `propertyLabels.${roomType.key}`;
          
          return (
            <div
              key={roomType.key}
              className="amenity-item"
              style={isActive ? activeStyle : {}}
              onClick={() => handleRoomTypeSelect(roomType.key)}
            >
              <input
                type="hidden"
                {...register(fieldName)}
                value={isActive.toString()}
              />
              <span className="amenity-label">{roomType.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MoreRoomTypeSection;