'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { convertAndFormatPriceSync } from '@/utils/currencyUtils';
import useSimpleTranslations from '@/hooks/useSimpleTranslations';
import ContactModal from '@/components/common/ContactModal/ContactModal';
import './RelatedListing.scss'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RelatedListings = ({ property }) => {
  const { t: dynamicT } = useSimpleTranslations('listing');
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
        ``
        if (!response.ok) {
          throw new Error('Failed to fetch related properties');
        }

        const data = await response.json();
        // Filter out the current property
        const filteredProperties = data.data.filter(r=>r.id!=property.id);
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
        <h4 className="mb-4">{dynamicT('discover-featured-listings', 'Discover Our Featured Listings')}</h4>
        <div className="loading-spinner">{dynamicT('loading', 'Loading...')}</div>
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">{dynamicT('discover-featured-listings', 'Discover Our Featured Listings')}</h4>
        <div className="col-auto mb30">
          <div className="row align-items-center justify-content-center">
            <div className="col-auto">
              <button className="properties_homes-prev__active swiper_button">
                <i className="far fa-arrow-left-long" />
              </button>
            </div>
            {/* End prev */}

            <div className="col-auto">
              <div className="pagination swiper--pagination properties_homes_pagination__active" />
            </div>
            {/* End pagination */}

            <div className="col-auto">
              <button className="properties_homes-next__active swiper_button">
                <i className="far fa-arrow-right-long" />
              </button>
            </div>
            {/* End Next */}
          </div>
        </div>
      </div>
      <div className="related-listings-slider">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.properties_homes-next__active',
            prevEl: '.properties_homes-prev__active',
          }}
          pagination={{
            el: '.properties_homes_pagination__active',
            clickable: true,
          }}
          slidesPerView={1}
          spaceBetween={30}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
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
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${prop.images[0].url || '/images/placeholder.jpg'}`}
                          alt={prop.title || `Property ${prop.id}`}
                          className="w-100"
                        />
                      </div>

                      <div className="property-type">
                        {prop.listings && prop.listings.length > 0 && (
                          <>
                            {prop.listings.some(listing => listing.listingType === 'SALE') &&
                              prop.listings.some(listing => listing.listingType === 'RENT') && (
                                <div className="for-rent">{dynamicT('for-sale-rent', 'For Sale/Rent')}</div>
                              )}
                            {prop.listings.every(listing => listing.listingType === 'SALE') && (
                              <div className="for-sale">{dynamicT('for-sale', 'For Sale')}</div>
                            )}
                            {prop.listings.every(listing => listing.listingType === 'RENT') && (
                              <div className="for-rent">{dynamicT('for-rent', 'For Rent')}</div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="property-content">
                      <div className="property-name">
                        <h6 className="list-title">{prop.projectName}</h6>
                      </div>
                      <div className="property-location">
                        {prop.zone?.[`name_${locale}`] || prop.zone?.name}
                      </div>

                      <div className="property-features">
                        <div className="feature">
                          <i className="flaticon-bed"></i> {prop.bedrooms || 0} {dynamicT('bed', 'bed')}
                        </div>
                        <div className="feature">
                          <i className="flaticon-shower"></i> {prop.bathrooms || 0} {dynamicT('bath', 'bath')}
                        </div>
                        <div className="feature">
                          <i className="flaticon-expand"></i> {prop.size || 0} {dynamicT('sqm', 'sqm')}
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
                            <span className="price-value">฿{convertAndFormatPriceSync(rentPrice, 'THB', locale)}{dynamicT('mo', '/mo')}</span>
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


      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />


    </div>
  );
};

export default RelatedListings;
