'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { localeToCurrencySymbol } from '@/utils/currencyUtils';

const PropertyHeader = ({ property, primaryListing, getListingTypeText, getPropertyTypeText, formatPrice }) => {
  const t = useTranslations('PropertyDetail');
  const locale = useLocale();

  // สัญลักษณ์สกุลเงินตามภาษา
  const currencySymbols = {
    'th': '฿',
    'en': '$',
    'zh': '¥',
    'ru': '₽'
  };

  useEffect(() => {
    console.log("propertyHeader", property);
  }, [property]);
  
  const currencySymbol = localeToCurrencySymbol(locale) || currencySymbols[locale] || '฿';

  return (
    <section className="property-header-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="single-property-content mb30-md">
              <h2 className="sp-lg-title text-white">{property.displayTitle || property.title}</h2>
              <div className="pd-meta mb15 d-md-flex align-items-center">
                <p className="text text-white fz15 mb-0 pr10 bdrrn-sm">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {property.zone?.name || property.district || 'Jomtien'}, {property.city || 'Pattaya'}
                </p>
              </div>
              <div className="property-meta d-flex align-items-center">
                {primaryListing && (
                  <a className="ff-heading text-thm fz15 bdrr1 pr10 bdrrn-sm" href="#">
                    <i className="fas fa-circle fz10 pe-2"></i>
                    {getListingTypeText(primaryListing.listingType)}
                  </a>
                )}
                <a className="ff-heading text-white bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm" href="#">
                  <i className="fas fa-building pe-2"></i>
                  {getPropertyTypeText(property.propertyType?.nameEn)}
                </a>
                <a className="ff-heading text-white ml10 ml0-sm fz15" href="#">
                  <i className="fas fa-vector-square pe-2 align-text-top"></i>
                  {property.area || 0} {t('sqm')}
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="single-property-content">
              <div className="property-action dark-version text-lg-end">
                {primaryListing && primaryListing.map((listing) => {
                  const hasDiscount = listing.promotionalPrice && parseFloat(listing.promotionalPrice) < parseFloat(listing.price);
                  const displayPrice = hasDiscount ? listing.promotionalPrice : listing.price;

                  return (
                    <React.Fragment key={listing.id}>
                      {hasDiscount && (
                        <h4 className="original-price text-white mb-0" style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '0.7em', lineHeight: '1' }}>
                          {currencySymbol}{formatPrice(listing.price)}
                        </h4>
                      )}
                      <h3 className="price mb-0"
                        style={{
                          color: listing.listingType === 'RENT' ? 'orange' : '#fff',
                          lineHeight: '1.2'
                        }}
                      >
                        {currencySymbol}{formatPrice(displayPrice)}
                      </h3>
                      {listing.listingType === 'RENT' && (
                        <p className="text space fz15 text-white">{t('perMonth')}</p>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyHeader;
