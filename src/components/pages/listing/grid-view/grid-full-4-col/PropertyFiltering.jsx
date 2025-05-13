'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function PropertyFiltering({ property }) {
  const locale = useLocale();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!property) {
    return <div className="alert alert-warning">No property data available</div>;
  }

  // Debug: log property.images
  console.log('Property images:', property.images);

  // Robust fallback: if images is array and has at least 1 item with url, use them, otherwise use placeholder
  let images = [];
  if (Array.isArray(property.images) && property.images.length > 0 && property.images[0].url) {
    images = property.images.map(img => img.url);
  }
  if (images.length === 0) {
    images = [
      '/images/property/fp1.jpg',
      '/images/property/fp2.jpg',
      '/images/property/fp3.jpg',
    ];
  }


  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };


  const isHotOffer = property.id % 2 === 0;
  const isNewListing = property.id % 3 === 0;


  const propertyDetailUrl = `/${locale !== 'th' ? locale + '/' : ''}property_detail/${property.id}`;

  return (
    <Link href={propertyDetailUrl} className="property-card-link">
      <div className="property-card">
        <div className="property-image">
          {/* Image slider */}
          <div className="image-slider">
            <img
              src={images[currentImageIndex]}
              alt={property.projectName || 'Property'}
            />

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
            {property.zone?.name || property.district || 'Jomtien'}
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
            <a
              href={`tel:+66123456789`}
              className="call-button"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fas fa-phone"></i>
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
}
