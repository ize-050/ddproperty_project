'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import PropertyMap from './PropertyMap';

const PropertyContent = ({ property, description, getPropertyTypeText, getFurnishingText }) => {
  const t = useTranslations('PropertyDetail');
  
  return (
    <div className="property-content">
      {/* Highlights Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-3">Highlights</h3>
        <div className="property-highlights">
          <ul className="row g-3">
            {property?.highlights?.map((item, index) => (
                <div className="col-6 col-md-4" key={`nearby-${index}`}>
                  <div className="nearby-item">
                    <i className={`fas fa-${item.path || 'map-marker-alt'} me-2`}></i>
                    <span>{item.highlightType}</span>
                  </div>
                </div>
            ))}
          </ul>
        </div>
      </div>

      {/* Description Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-3">Description</h3>
        <div className="property-description">
          <p>{description || 'No description available for this property.'}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-3">Details</h3>
        <div className="property-details-table">
          <table className="table">
            <tbody>
              <tr>
                <th>Property ID</th>
                <td>{property.id || 'DP000010'}</td>
                <th>Ownership Quota</th>
                <td>{property.ownershipQuota || 'Thai'}</td>
              </tr>
              <tr>
                <th>Land Size</th>
                <td>{property.landSize || '117.8 sq.wah'}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>Useable Area</th>
                <td>{property.area || '400'} sq.m.</td>
                <th>Floor</th>
                <td>{property.floors || '2'} Floors</td>
              </tr>
              <tr>
                <th>Furnishing</th>
                <td>{getFurnishingText(property.furnishing) || 'Fully Fitted'}</td>
                <th>Bedrooms</th>
                <td>{property.bedrooms || '4'}</td>
              </tr>
              <tr>
                <th>Bathrooms</th>
                <td>{property.bathrooms || '4'}</td>
                <th>Construction Year</th>
                <td>{property.yearBuilt || '2024'}</td>
              </tr>
              <tr>
                <th>Community Fees</th>
                <td>{property.communityFee || '50'}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>Area</th>
                <td>{property.district || 'Banglamung'}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>Address</th>
                <td colSpan="3">{property.address || 'Sukhumvit rd. Banglamung, Thailand'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Location Map */}
      <div className="property-section mb-5">
        <div className="property-map">
            <PropertyMap property={property} />
        </div>
      </div>
      
      <div className="property-section mb-5">
        <h3 className="section-title mb-4">Near By</h3>
        <div className="nearby-items">
          <div className="row g-3">

            { property.nearbyPlaces.map((item, index) => (
                <div className="col-6 col-md-4" key={`nearby-${index}`}>
                  <div className="nearby-item">
                    <i className={`fas fa-${item.icon || 'map-marker-alt'} me-2`}></i>
                    <span>{item.name}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* View Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-4">View</h3>
        <div className="view-items">
          <div className="row g-3">
            {property.views ? (
              // ถ้ามีข้อมูล views จาก API
              property.views.map((item, index) => (
                <div className="col-6 col-md-4" key={`view-${index}`}>
                  <div className="view-item">
                    <i className={`fas fa-${item.icon || 'eye'} me-2`}></i>
                    <span>{item.viewType}</span>
                  </div>
                </div>
              ))
            ) : (
              // ถ้าไม่มีข้อมูลจาก API ให้แสดงข้อมูลจำลอง
              <div className="col-6 col-md-4">
                <div className="view-item">
                  <i className="fas fa-tree me-2"></i>
                  <span>Garden View</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-4">Facilities</h3>
        <div className="facility-items">
          <div className="row g-3">
            {
              property.facilities.map((item, index) => (
                <div className="col-6 col-md-4" key={`facility-${index}`}>
                  <div className="facility-item">
                    <i className={`fas fa-${item.icon || 'building'} me-2`}></i>
                    <span>{item.facilityType}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Amenity Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-4">Amenity</h3>
        <div className="amenity-items">
          <div className="row g-3">
            {
              property.amenities.map((item, index) => (
                <div className="col-6 col-md-4" key={`amenity-${index}`}>
                  <div className="amenity-item">
                    <i className={`fas fa-${item.icon || 'check-circle'} me-2`}></i>
                    <span>{item.amenityType}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="property-section mb-5">
        <h3 className="section-title mb-3">Features</h3>
        <div className="property-features">
          <div className="row">
            <div className="col-md-4 col-6 mb-3">
              <div className="feature-item">
                <i className="fas fa-check-circle text-success me-2"></i>
                <span>Swimming Pool</span>
              </div>
            </div>
            <div className="col-md-4 col-6 mb-3">
              <div className="feature-item">
                <i className="fas fa-check-circle text-success me-2"></i>
                <span>Garden</span>
              </div>
            </div>
            <div className="col-md-4 col-6 mb-3">
              <div className="feature-item">
                <i className="fas fa-check-circle text-success me-2"></i>
                <span>Air Conditioning</span>
              </div>
            </div>
            <div className="col-md-4 col-6 mb-3">
              <div className="feature-item">
                <i className="fas fa-check-circle text-success me-2"></i>
                <span>Parking</span>
              </div>
            </div>
            <div className="col-md-4 col-6 mb-3">
              <div className="feature-item">
                <i className="fas fa-check-circle text-success me-2"></i>
                <span>Security System</span>
              </div>
            </div>
            <div className="col-md-4 col-6 mb-3">
              <div className="feature-item">
                <i className="fas fa-check-circle text-success me-2"></i>
                <span>Fitness Center</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
    
    </div>
  );
};

export default PropertyContent;
