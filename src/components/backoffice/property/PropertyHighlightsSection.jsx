'use client';

import React, { useState, useEffect } from 'react';
import { getIconsByPrefix } from '@/services/iconService';
import usePropertyFormStore from '@/store/propertyFormStore';
import { useFormContext } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

const PropertyHighlightsSection = () => {
  const { formData, setHighlight, initializeHighlights, setPropertyLabel, initializePropertyLabels } = usePropertyFormStore();
  const [highlightIcons, setHighlightIcons] = useState({});
  const [labelIcons, setLabelIcons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register, setValue } = useFormContext();

  console.log('PropertyHighlightsSection rendered, formData:', formData);

  useEffect(() => {
    console.log('PropertyHighlightsSection rendered with formData:', formData);
  }, [formData]);

  // Fetch highlight icons from API
  useEffect(() => {
    const fetchHighlightIcons = async () => {
      try {
        setLoading(true);
        console.log('Fetching highlight icons...');
        
        // ดึงข้อมูล highlights 
        const highlightResponse = await getIconsByPrefix('highlight');
        
        // ดึงข้อมูล property-label
        const labelResponse = await getIconsByPrefix('property-label');
        
        if (highlightResponse && labelResponse) {
          setHighlightIcons(highlightResponse.data || {});
          setLabelIcons(labelResponse.data || {});


          initializeHighlights(highlightResponse.data || {});
          initializePropertyLabels(labelResponse.data || {});
        } else {
          throw new Error('Failed to fetch property highlights or labels');
        }
      } catch (err) {
        console.error('Error fetching property highlights:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightIcons();
  }, [initializeHighlights, initializePropertyLabels]);

  // Handle selection
  const handleClick = (type, key, active) => {
    console.log(`Toggle ${type} icon: ${key} from ${active} to ${!active}`);

    // Convert to boolean for consistent handling
    const newValue = !active;
    
    if (type === 'highlight') {
      // Update Zustand store with boolean
      setHighlight(key, newValue);
    }
    if (type === 'label') {
      // Update property labels in the store
      setPropertyLabel(key, newValue);
    }
  };

  if (loading) {
    return (
      <section className="form-section">
        <h2>Property Highlights</h2>
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" /> Loading property highlights...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="form-section">
        <h2>Property Highlights</h2>
        <div className="error-message">
          Error loading property highlights: {error}
        </div>
      </section>
    );
  }

  console.log('Rendering highlights section with data:', {
    highlightIcons,
    labelIcons,
    formDataHighlights: formData.highlights,
    formDataLabels: formData.propertyLabels
  });

  // แสดงไอคอน Highlights
  const renderHighlightIcons = () => {
    if (!highlightIcons || !highlightIcons.highlight) {
      return <p>No highlight icons available</p>;
    }

    // CSS styles for active items
    const activeStyle = {
      backgroundColor: '#e3f2fd',
      borderColor: '#2196f3',
      color: '#000',
    };

    return (
      <div className="amenities-grid">
        {highlightIcons.highlight.map((icon) => {
          // สร้าง field name สำหรับ React Hook Form
          const fieldName = `highlights.${icon.key}`;
          // ใช้ Boolean เพื่อให้แน่ใจว่าเป็นค่า boolean และป้องกัน error
          const isActive = Boolean(formData.highlights?.[icon.key]?.active);

          return (
            <div
              key={icon.id}
              className="amenity-item"
              style={isActive ? activeStyle : {}}
              onClick={() => handleClick('highlight', icon.key, isActive)}
            >
              <input
                type="hidden"
                {...register(fieldName)}
                value={isActive.toString()}
              />
              <span className="amenity-label">{icon.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // แสดงไอคอน Label
  const renderLabelIcons = () => {
    if (!labelIcons || !labelIcons.label) {
      return <p>No label icons available</p>;
    }

    // CSS styles for active items
    const activeStyle = {
      backgroundColor: '#e3f2fd',
      borderColor: '#2196f3',
      color: '#000',
    };

    return (
      <div className="amenities-grid">
        {labelIcons.label.map((icon) => {
          // สร้าง field name สำหรับ React Hook Form
          const fieldName = `propertyLabels.${icon.key}`;
          // ใช้ Boolean เพื่อให้แน่ใจว่าเป็นค่า boolean และป้องกัน error
          const isActive = Boolean(formData.propertyLabels?.[icon.key]?.active);

          return (
            <div
              key={icon.id}
              className="amenity-item"
              style={isActive ? activeStyle : {}}
              onClick={() => handleClick('label', icon.key, isActive)}
            >
              <input
                type="hidden"
                {...register(fieldName)}
                value={isActive.toString()}
              />
              <span className="amenity-label">{icon.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <section className="form-section">
        <h2>Property Highlights</h2>
        {renderHighlightIcons()}
      </section>

      <section className="form-section">
        <h2>Property Label</h2>
        {renderLabelIcons()}
      </section>
    </>
  );
};

export default PropertyHighlightsSection;
