'use client'

import React, { useState } from 'react'

export default function PropertyFiltering({ property }) {
  // ตรวจสอบว่ามี property ที่ส่งมาหรือไม่
  if (!property) {
    return <div className="alert alert-warning">No property data available</div>;
  }
  
  // สร้าง state สำหรับเก็บ index ของรูปภาพปัจจุบัน
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // สมมติว่ามีรูปภาพหลายรูป (ในกรณีจริงควรใช้ property.images)
  const images = [
    property.images?.[0]?.url || '/images/property/fp1.jpg',
    '/images/property/fp2.jpg',
    '/images/property/fp3.jpg',
  ];
  
  // ฟังก์ชันสำหรับเลื่อนไปรูปถัดไป
  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  // ฟังก์ชันสำหรับเลื่อนไปรูปก่อนหน้า
  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // สุ่มว่าเป็น Hot Offer หรือ New Listing
  const isHotOffer = property.id % 2 === 0;
  const isNewListing = property.id % 3 === 0;

  return (
    <div className="property-card">
      <div className="property-image">
        {/* Image slider */}
        <div className="image-slider">
          <img
            src={images[currentImageIndex]}
            alt={property.projectName || 'Property'}
          />
          
          {/* Navigation arrows */}
          <button className="slider-nav prev" onClick={prevImage}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="slider-nav next" onClick={nextImage}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        {/* Special tags - Hot Offer or New Listing */}
        <div className="special-tags">
          {isHotOffer && (
            <div className="tag hot-offer">HOT OFFER</div>
          )}
          {isNewListing && (
            <div className="tag new-listing">NEW LISTING</div>
          )}
        </div>
        
        {/* Property type tag */}
        <div className="property-type">
          {property.listings && property.listings[0]?.listingType === 'RENT' ? (
            <div className="for-rent">For Rent</div>
          ) : (
            <div className="for-sale">For Sale</div>
          )}
        </div>
      </div>

      <div className="property-content">
        <h3 className="property-title">
          {property.projectName || 'Unnamed Property'}
        </h3>

        <div className="property-location">
          {property.zone?.name || 'Jomtien'}
        </div>

        <div className="property-features">
          <div className="feature">
            <i className="fas fa-bed"></i> {property.bedrooms || 1} bed
          </div>
          <div className="feature">
            <i className="fas fa-bath"></i> {property.bathrooms || 1} bath
          </div>
          <div className="feature">
            <i className="fas fa-vector-square"></i> {property.area || 32} sq.m.
          </div>
        </div>

        <div className="property-divider"></div>

        <div className="property-price">
          ฿{property.listings && property.listings[0]?.price ? new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 }).format(property.listings[0].price) : '15,000'}
          {property.listings && property.listings[0]?.listingType === 'RENT' ? ' / mo' : ''}
          <a href={`tel:+66123456789`} className="call-button">
            <i className="fas fa-phone"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
