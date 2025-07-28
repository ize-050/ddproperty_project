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
  const isHotOffer = property.labels.some(label => label.labelType === 'hot-offer');
  const isNewListing = property.labels.some(label => label.labelType === 'new-listing');
  const resale = property.labels.some(label => label.labelType === 'resale');
  const rented = property.labels.some(label => label.labelType === 'rented');
  const newDevelopment = property.labels.some(label => label.labelType === 'new-development');
  const reducePrice = property.labels.some(label => label.labelType === 'reduce-price');
  const sold = property.labels.some(label => label.labelType === 'sold');
  const underConstruction = property.labels.some(label => label.labelType === 'under-construction');

  const currencySymbol = localeToCurrencySymbol(locale) || currencySymbols[locale] || '฿';

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
                  {getZoneName(property.zone)}
                </p>
              </div>
              <div className="property-meta d-flex align-items-center">

                <a className="ff-heading text-white bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm" href="#">
                  FOR {property.listings.map((listing) => listing.listingType).join(', ') ?? '-'}
                </a>

                <a className="ff-heading text-white  fz15 pr10 ml10 ml0-sm " href="#">
                  <i className="fas fa-building pe-2"></i>
                  {property.propertyType?.nameEn}
                </a>

              </div>
            </div>

            <div className="special-tags mt-2">
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
