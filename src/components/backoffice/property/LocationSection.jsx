'use client';

import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const LocationSection = () => {
  const { formData, setFormData, showMap, toggleMap } = usePropertyFormStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  return (
    <section className="form-section">
      <h2>Property Location*</h2>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter property address"
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City/Province</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="e.g. Bangkok"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="district">District</label>
          <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            placeholder="e.g. Watthana"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="subdistrict">Subdistrict</label>
          <input
            type="text"
            id="subdistrict"
            name="subdistrict"
            value={formData.subdistrict}
            onChange={handleInputChange}
            placeholder="e.g. Khlong Toei Nuea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder="e.g. 10110"
          />
        </div>
      </div>



      <div className="form-group map-toggle">
        <label>Display on map (for better visibility)</label>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="mapToggle"
            checked={showMap}
            onChange={toggleMap}
          />
          <label htmlFor="mapToggle"></label>
        </div>
      </div>


      <div className="form-group">
        <label htmlFor="address">Search Address*</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter address"
          required
        />
      </div>

      {showMap && (
        <div className="map-container">
          <div className="map-placeholder">
            <Image
              src="/images/map-placeholder.jpg"
              alt="Map"
              width={800}
              height={300}
              className="map-image"
            />
            <div className="map-marker">
              <FaMapMarkerAlt size={24} color="#e4002b" />
            </div>
          </div>
          <div className="map-coordinates">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="0.000001"
              />
            </div>
            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="0.000001"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LocationSection;
