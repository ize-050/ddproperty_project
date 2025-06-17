'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { convertAndFormatPriceSync } from '@/utils/currencyUtils';
import ContactModal from '@/components/common/ContactModal/ContactModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RelatedListings = ({ property }) => {
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    const fetchRelatedProperties = async () => {
      if (!property?.zoneId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zones/${property.zoneId}/properties?limit=6`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch related properties');
        }

        const data = await response.json();
        // Filter out the current property
        const filteredProperties = data.properties.filter(prop => prop.id !== property.id);
        setRelatedProperties(filteredProperties);
      } catch (error) {
        console.error('Error fetching related properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProperties();
  }, [property]);

  if (loading) {
    return (
      <div className="related-listings-section">
        <h4 className="mb-4">Related Properties</h4>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!relatedProperties.length) {
    return null;
  }

  const handleContactClick = (e, prop) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProperty(prop);
    setIsModalOpen(true);
  };

  return (
    <div className="related-listings-section">
      <h4 className="mb-4">Related Properties</h4>
      <div className="related-listings-slider">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.related-next',
            prevEl: '.related-prev',
          }}
          pagination={{
            el: '.related-pagination',
            clickable: true,
          }}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 1,
            },
          }}
        >
          {relatedProperties.map((prop) => {
            const salePrice = prop.listings?.find(l => l.listingType === 'SALE')?.price || 0;
            const rentPrice = prop.listings?.find(l => l.listingType === 'RENT')?.price || 0;
            const propertyDetailUrl = `/${locale !== 'th' ? locale + '/' : ''}property_detail/${prop.id}`;
            
            return (
              <SwiperSlide key={prop.id}>
                <Link href={propertyDetailUrl} className="property-card-link">
                  <div className="property-card">
                    <div className="property-image">
                      <div className="image-slider">
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${prop.imageUrls?.[0] || '/images/placeholder.jpg'}`} 
                          alt={prop.title || `Property ${prop.id}`}
                          className="w-100"
                        />
                      </div>
                      
                      <div className="property-type">
                        {prop.listings && prop.listings.length > 0 && (
                          <>
                            {prop.listings.some(listing => listing.listingType === 'SALE') &&
                              prop.listings.some(listing => listing.listingType === 'RENT') && (
                                <div className="for-rent">For Sale/Rent</div>
                              )}
                            {prop.listings.every(listing => listing.listingType === 'SALE') && (
                              <div className="for-sale">For Sale</div>
                            )}
                            {prop.listings.every(listing => listing.listingType === 'RENT') && (
                              <div className="for-rent">For Rent</div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="property-content">
                      <div className="property-name">
                        <h6 className="list-title">{prop.title || prop.projectName}</h6>
                      </div>
                      <div className="property-location">
                        {prop.zone?.[`name_${locale}`] || prop.zone?.name}
                      </div>

                      <div className="property-features">
                        <div className="feature">
                          <i className="flaticon-bed"></i> {prop.bedrooms || 0} bed
                        </div>
                        <div className="feature">
                          <i className="flaticon-shower"></i> {prop.bathrooms || 0} bath
                        </div>
                        <div className="feature">
                          <i className="flaticon-expand"></i> {prop.size || 0} sqm
                        </div>
                      </div>

                      <hr />

                      <div className="property-price">
                        {salePrice > 0 && (
                          <div className="sale-price">
                            <span className="price-value">฿{convertAndFormatPriceSync(salePrice, 'THB', locale)}</span>
                          </div>
                        )}
                        {rentPrice > 0 && (
                          <div className="rent-price">
                            <span className="price-value">฿{convertAndFormatPriceSync(rentPrice, 'THB', locale)}/mo</span>
                          </div>
                        )}
                        <a
                          href="#"
                          className="call-button"
                          onClick={(e) => handleContactClick(e, prop)}
                        >
                          <i className="fas fa-phone"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        
        <div className="swiper-controls d-flex align-items-center justify-content-center mt-4">
          <button className="related-prev swiper-button me-3">
            <i className="far fa-arrow-left-long"></i>
          </button>
          <div className="swiper-pagination related-pagination"></div>
          <button className="related-next swiper-button ms-3">
            <i className="far fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
      
      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default RelatedListings;
