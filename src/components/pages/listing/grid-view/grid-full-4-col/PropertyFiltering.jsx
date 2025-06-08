'use client'

import React, { useState , useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import './PropertyFiltering.css'
import ContactModal from '../../../../common/ContactModal/ContactModal'
import { convertAndFormatPrice, convertAndFormatPriceSync } from '@/utils/currencyUtils'

export default function PropertyFiltering({ property }) {
  const locale = useLocale();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salePriceFormatted, setSalePriceFormatted] = useState('');
  const [rentPriceFormatted, setRentPriceFormatted] = useState('');

  useEffect(() => {
    // Load and format prices according to selected locale
    const loadPrices = async () => {
      if (property?.listings) {
        const salePrice = property.listings.find(l => l.listingType === 'SALE')?.price || 0;
        const rentPrice = property.listings.find(l => l.listingType === 'RENT')?.price || 0;
        
        if (salePrice) {
          const formattedSalePrice = await convertAndFormatPrice(salePrice, locale);
          setSalePriceFormatted(formattedSalePrice);
        }
        
        if (rentPrice) {
          const formattedRentPrice = await convertAndFormatPrice(rentPrice, locale);
          setRentPriceFormatted(formattedRentPrice);
        }
      }
    };
    
    loadPrices();
  }, [property, locale]);

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
    <div>
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
            {/*<div className="special-tags">*/}
            {/*  {isHotOffer && (*/}
            {/*    <div className="tag hot-offer">HOT OFFER</div>*/}
            {/*  )}*/}
            {/*  {isNewListing && (*/}
            {/*    <div className="tag new-listing">NEW LISTING</div>*/}
            {/*  )}*/}
            {/*</div>*/}

            <div className="property-type">
              {property.listings && property.listings.length > 1 ? (
                <>
                  {property.listings.some(listing => listing.listingType === 'SALE') && 
                   property.listings.some(listing => listing.listingType === 'RENT') && (
                    <div className="for-rent">For Sale/Rent</div>
                  )}
                  {property.listings.every(listing => listing.listingType === 'SALE') && (
                    <div className="for-sale">For Sale</div>
                  )}
                  {property.listings.every(listing => listing.listingType === 'RENT') && (
                    <div className="for-rent">For Rent</div>
                  )}
                </>
              ) : property.listings && property.listings[0]?.listingType && (
               <>
                 <div className={property.listings[0].listingType === 'SALE' ? "for-sale" : "for-rent"}>
                   {property.listings[0].listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                 </div>
               </>
              )}
            </div>

          </div>

          <div className="property-content">
            <h5 className="property-title">
              <Link href={propertyDetailUrl}></Link>
            </h5>
            <div className="property-name">
              <p>{property.projectName}</p>

            </div>
            <div className="property-location">
              <i className="fas fa-map-marker-alt"></i> {property.zone[`name_${locale}`]}
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

            <div className="property-price">
              {property.listings && property.listings.length > 1 && 
               property.listings.some(listing => listing.listingType === 'SALE') && 
               property.listings.some(listing => listing.listingType === 'RENT') ? (
                <div className="price-container">
                  <div className="sale-price">
                    <span className="price-label"><i className="fas fa-tag"></i> Sale:</span> 
                    <span className="price-value">{salePriceFormatted || convertAndFormatPriceSync(
                      property.listings.find(l => l.listingType === 'SALE')?.price || 0, locale
                    )}</span>
                  </div>
                  <div className="rent-price">
                    <span className="price-label"><i className="fas fa-sync-alt"></i> Rent:</span> 
                    <span className="price-value">{rentPriceFormatted || convertAndFormatPriceSync(
                      property.listings.find(l => l.listingType === 'RENT')?.price || 0, locale
                    )} / mo</span>
                  </div>
                </div>
              ) : (
                  <div className="price-container">
                    {property.listings.some(listing => listing.listingType === 'SALE') && (

                    <div className="sale-price">
                      <span className="price-label"><i className="fas fa-tag"></i> Sale:</span>
                      <span className="price-value">{salePriceFormatted || convertAndFormatPriceSync(
                          property.listings.find(l => l.listingType === 'SALE')?.price || 0, locale
                      )}</span>
                    </div>
                    )}
                    {property.listings.some(listing => listing.listingType === 'RENT') && (
                    <div className="rent-price">
                      <span className="price-label"><i className="fas fa-sync-alt"></i> Rent:</span>
                      <span className="price-value">{rentPriceFormatted || convertAndFormatPriceSync(
                          property.listings.find(l => l.listingType === 'RENT')?.price || 0, locale
                      )} / mo</span>
                    </div>
                    )}
                  </div>
              )}
              <a
                href={`tel:+66123456789`}
                className="call-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <i className="fas fa-phone"></i>
              </a>
            </div>


            <div className="property-divider"></div>

          </div>
        </div>
      </Link>
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={property}
      />
    </div>
  );
}
