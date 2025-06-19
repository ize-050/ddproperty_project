'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import './PropertyFiltering.css'
import ContactModal from '../../../../common/ContactModal/ContactModal'
import { convertAndFormatPrice, convertAndFormatPriceSync } from '@/utils/currencyUtils'

// CSS สำหรับราคาโปรโมชัน
const promotionalPriceStyles = `
  .price-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .original-price {
    text-decoration: line-through;
    color: #e86e60; /* สีส้มอมแดง coral/salmon ตามภาพตัวอย่าง */
    font-size: 0.9em;
  }
  
  .promotional-price {
    color: #000; /* สีดำ */
    font-weight: 600;
  }
`;

export default function PropertyFiltering({ property }) {
  const locale = useLocale();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salePriceFormatted, setSalePriceFormatted] = useState('');
  const [rentPriceFormatted, setRentPriceFormatted] = useState('');


  useEffect(() => {

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

  const isHotOffer = property.labels.some(label => label.labelType === 'hot-offer');
  const isNewListing = property.labels.some(label => label.labelType === 'new-listing');
  const resale = property.labels.some(label => label.labelType === 'resale');
  const rented = property.labels.some(label => label.labelType === 'rented');
  const newDevelopment = property.labels.some(label => label.labelType === 'new-development');
  const reducePrice = property.labels.some(label => label.labelType === 'reduce-price');
  const sold = property.labels.some(label => label.labelType === 'sold');
  const underConstruction = property.labels.some(label => label.labelType === 'under-construction');



  const propertyDetailUrl = `/${locale !== 'th' ? locale + '/' : ''}property_detail/${property.id}`;

  return (
    <div>
      <Link href={propertyDetailUrl} className="property-card-link">
        <div className="property-card" style={{
          fontFamily: '__Poppins_c70c06'
        }}>
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

          
            <div className="special-tags">
             {isHotOffer && (
            <div className="tag hot-offer">HOT OFFER</div>  
            )}
            {isNewListing && (
            <div className="tag new-listing">NEW LISTING</div>
            )}
            {resale && (
            <div className="tag resale">RESALE</div>
            )}
            {rented && (
            <div className="tag rented">RENTED</div>
            )}
            {newDevelopment && (
            <div className="tag new-development">NEW DEVELOPMENT</div>
            )}
            {reducePrice && (
            <div className="tag reduce-price">REDUCE PRICE</div>
            )}
            {sold && (
            <div className="tag sold">SOLD</div>
            )}
            {underConstruction && (
            <div className="tag under-construction">UNDER CONSTRUCTION</div>
            )}
            </div>

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
              <h6 className="list-title">{property.projectName}</h6>

            </div>
            <div className="property-location">
              {property.zone[`name_${locale}`]}
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

            <hr />

            <div className="property-price">
              {property.listings && property.listings.length > 1 &&
                property.listings.some(listing => listing.listingType === 'SALE') &&
                property.listings.some(listing => listing.listingType === 'RENT') ? (
                <div className="price-container">
                  <div className="sale-price">
                    <span className="price-label"></span>
                    {property.listings.some(listing => listing.listingType === 'SALE' && listing.promotionalPrice) ? (
                      <div className="price-row">
                        <span className="price-value promotional-price">
                          { convertAndFormatPriceSync(property.listings.find(l => l.listingType === 'SALE')?.promotionalPrice || 0, locale) }
                        </span>
                        <span className="price-value original-price"> 
                          { salePriceFormatted || convertAndFormatPriceSync(
                            property.listings.find(l => l.listingType === 'SALE')?.price || 0, locale
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="price-value"> 
                        { salePriceFormatted || convertAndFormatPriceSync(
                          property.listings.find(l => l.listingType === 'SALE')?.price || 0, locale
                        )}
                      </span>
                    )}
                  </div>
                  <div className="rent-price">
                    <span className="price-label"></span>
                    {property.listings.some(listing => listing.listingType === 'RENT' && listing.promotionalPrice) ? (
                      <div className="price-row">
                        <span className="price-value promotional-price">
                          {convertAndFormatPriceSync(property.listings.find(l => l.listingType === 'RENT')?.promotionalPrice || 0, locale)}
                        </span>
                        <span className="price-value original-price"> 
                          {rentPriceFormatted || convertAndFormatPriceSync(
                            property.listings.find(l => l.listingType === 'RENT')?.price || 0, locale
                          )}
                        </span>
                        <span>/ mo</span>
                      </div>
                    ) : (
                      <span className="price-value"> 
                        {rentPriceFormatted || convertAndFormatPriceSync(
                          property.listings.find(l => l.listingType === 'RENT')?.price || 0, locale
                        )} / mo
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="price-container">
                  {property.listings.some(listing => listing.listingType === 'SALE') && (

                    <div className="sale-price">
                      <span className="price-label"></span>
                      {property.listings.some(listing => listing.listingType === 'SALE' && listing.promotionalPrice) ? (
                        <div className="price-row">
                          <span className="price-value promotional-price">
                            {convertAndFormatPriceSync(property.listings.find(l => l.listingType === 'SALE')?.promotionalPrice || 0, locale)}
                          </span>
                          <span className="price-value original-price"> 
                            {salePriceFormatted || convertAndFormatPriceSync(
                              property.listings.find(l => l.listingType === 'SALE')?.price || 0, locale
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="price-value"> 
                          {salePriceFormatted || convertAndFormatPriceSync(
                            property.listings.find(l => l.listingType === 'SALE')?.price || 0, locale
                          )}
                        </span>
                      )}
                    </div>
                  )}
                  {property.listings.some(listing => listing.listingType === 'RENT') && (
                    <div className="rent-price">
                      <span className="price-label"></span>
                      <span className="price-value"> {rentPriceFormatted || convertAndFormatPriceSync(
                        property.listings.find(l => l.listingType === 'RENT')?.price || 0, locale
                      )} / mo </span>
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


          </div>
        </div>
      </Link>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={property}
      />
      <style jsx>{promotionalPriceStyles}</style>
    </div>
  )
}
