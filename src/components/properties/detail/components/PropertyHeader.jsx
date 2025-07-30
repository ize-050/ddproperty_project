'use client'

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import useSimpleTranslations from '@/hooks/useSimpleTranslations';
import { getCookie } from 'cookies-next';
import { convertAndFormatPriceSync } from '@/utils/currencyUtils';

const PropertyHeader = ({ property, primaryListing, getListingTypeText, getPropertyTypeText, formatPrice }) => {
  const t = useTranslations('PropertyDetail');
  const { t: dynamicT } = useSimpleTranslations('listing');
  const locale = useLocale();

  // Memoize expensive calculations to prevent re-renders
  const labelFlags = useMemo(() => {
    if (!property?.labels) return {};

    return {
      isHotOffer: property.labels.some(label => label.labelType === 'hot-offer'),
      isNewListing: property.labels.some(label => label.labelType === 'new-listing'),
      resale: property.labels.some(label => label.labelType === 'resale'),
      rented: property.labels.some(label => label.labelType === 'rented'),
      newDevelopment: property.labels.some(label => label.labelType === 'new-development'),
      reducePrice: property.labels.some(label => label.labelType === 'reduce-price'),
      sold: property.labels.some(label => label.labelType === 'sold'),
      underConstruction: property.labels.some(label => label.labelType === 'under-construction')
    };
  }, [property?.labels]);

  // Helper function to format price with proper currency
  const formatPriceWithCurrency = useMemo(() => {
    return (price) => {
      if (!price || isNaN(price)) return '-';
      return convertAndFormatPriceSync(price, locale, true);
    };
  }, [locale]);

  // Helper function to get zone name by locale
  const getZoneName = (zone) => {
    if (!zone) return '';

    switch (locale) {
      case 'th':
        return zone.nameTh || zone.nameEn || zone.name || '';
      case 'zh':
        return zone.nameCh || zone.nameEn || zone.name || '';
      case 'ru':
        return zone.nameRu || zone.nameEn || zone.name || '';
      default:
        return zone.nameEn || zone.name || '';
    }
  };



  return (
    <section className="property-header-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="single-property-content mb30-md">
              <h2 className="sp-lg-title text-white">{property.displayTitle || property.title}</h2>
              <div className="pd-meta mb15 d-md-flex align-items-center">
                <p className="text text-white fz15 mb-0 pr10 bdrrn-sm">
                  <i className="fas fa-map-marker-alt me-2" style={{ color: '#e74c3c', fontSize: '18px' }}></i>
                  {getZoneName(property?.zone)}
                </p>
              </div>
              <div className="property-meta d-flex align-items-center">

                <a className="ff-heading text-white bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm" href="#">
                  {dynamicT('for', 'FOR')} {property.listings.map((listing) => listing.listingType).join(', ') ?? '-'}
                </a>

                <a className="ff-heading text-white  fz15 pr10 ml10 ml0-sm " href="#">
                  <i className="fas fa-building pe-2"></i>
                  {property.propertyType?.nameEn}
                </a>

              </div>
            </div>

            <div className="special-tags mt-2">
              {labelFlags.isHotOffer && (
                <div className="tag hot-offer">{dynamicT('hot-offer', 'HOT OFFER')}</div>
              )}
              {labelFlags.isNewListing && (
                <div className="tag new-listing">{dynamicT('new-listing', 'NEW LISTING')}</div>
              )}
              {labelFlags.resale && (
                <div className="tag resale">{dynamicT('resale', 'RESALE')}</div>
              )}
              {labelFlags.rented && (
                <div className="tag rented">{dynamicT('rented', 'RENTED')}</div>
              )}
              {labelFlags.newDevelopment && (
                <div className="tag new-development">{dynamicT('new-development', 'NEW DEVELOPMENT')}</div>
              )}
              {labelFlags.reducePrice && (
                <div className="tag reduce-price">{dynamicT('reduce-price', 'REDUCE PRICE')}</div>
              )}
              {labelFlags.sold && (
                <div className="tag sold">{dynamicT('sold', 'SOLD')}</div>
              )}
              {labelFlags.underConstruction && (
                <div className="tag under-construction">{dynamicT('under-construction', 'UNDER CONSTRUCTION')}</div>
              )}
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
                          {formatPriceWithCurrency(listing.price)}
                        </h4>
                      )}
                      <h3 className="price mb-0"
                        style={{
                          color: listing.listingType === 'RENT' ? 'orange' : '#fff',
                          lineHeight: '1.2'
                        }}
                      >
                        {formatPriceWithCurrency(displayPrice)}
                      </h3>
                      {listing.listingType === 'RENT' && (
                        <p className="text space fz15 text-white">{dynamicT('mo', '/mo')}</p>
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
