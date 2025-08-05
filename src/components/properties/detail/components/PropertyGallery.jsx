'use client'

import React from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import { useLocale } from 'next-intl';
import useSimpleTranslations from '@/hooks/useSimpleTranslations';
import 'photoswipe/dist/photoswipe.css';
import '@/styles/property-detail-gallery.scss';


const PropertyGallery = ({ images, property }) => {
  const { t: dynamicT } = useSimpleTranslations('listing');
  const locale = useLocale();
  const galleryImages = images && images.length > 0 ? images : ['/images/property/fp1.jpg'];
  const [imageDimensions, setImageDimensions] = React.useState({});

  // Function to get localized listing type
  const getLocalizedListingType = (listingTypes) => {
    if (!listingTypes || listingTypes.length === 0) return '-';
    
    return listingTypes.map(listingType => {
      const translations = {
        'SALE': {
          'en': 'For Sale',
          'th': 'ขาย',
          'zh': '出售',
          'ru': 'Продажа'
        },
        'RENT': {
          'en': 'For Rent',
          'th': 'เช่า',
          'zh': '租赁',
          'ru': 'Аренда'
        },
        'SALE_RENT': {
          'en': 'For Sale/Rent',
          'th': 'ขาย/เช่า',
          'zh': '出售/租赁',
          'ru': 'Продажа/Аренда'
        }
      };
      
      const typeTranslations = translations[listingType];
      return typeTranslations ? (typeTranslations[locale] || typeTranslations['en']) : listingType;
    }).join(', ');
  };


  const overviewData = [
    {
      icon: "flaticon-home-1",
      label: dynamicT('property-type', 'Property Type'),
      value: getLocalizedListingType(property.listings?.map(listing => listing.listingType)),
    },
    {
      icon: "flaticon-bed",
      label: dynamicT('bedroom', 'Bedroom'),
      value: property.bedrooms ?? '-',
    },
    {
      icon: "flaticon-shower",
      label: dynamicT('bath', 'Bath'),
      value: property.bathrooms ?? '-',
    },
    {
      icon: "flaticon-expand",
      label: dynamicT('useable-area', 'Useable Area'),
      value: property.usableArea + " " + dynamicT('sqm', 'sqm') ?? '-',
    },
  ];

  return (
    <section className="property-gallery-section">
      <div className="container">
        <Gallery options={{
          showHideAnimationType: 'zoom',
          bgOpacity: 0.9,
          spacing: 0.1,
          allowPanToNext: true,
          loop: true,
          zoom: true,
          close: true,
          counter: true,
          arrowKeys: true,
          escKey: true,
          clickToCloseNonZoomable: true,
          imageClickAction: 'zoom-or-close',
          tapAction: 'zoom-or-close'
        }}>
          <div className="row">
            {galleryImages.length > 0 && (
              <>
                <div className="col-md-6">
                  <div className="sp-img-content mb15-md">
                    <div className="preview-img-1 sp-img">
                      <Item
                        original={galleryImages[0]}
                        thumbnail={galleryImages[0]}
                        title={property.projectName || 'Property'}
                      > 
                        {({ ref, open }) => (
                          <img
                            ref={ref}
                            onClick={open}
                            src={galleryImages[0]}
                            alt={property.projectName || 'Property'}
                            className="thumb-img"
                            style={{ cursor: 'zoom-in' }}
                          />
                        )}
                      </Item>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-stretch">
                  {galleryImages.length > 1 && (
                    <div className="thumbs-grid w-100 h-100 d-grid grid-template-columns-repeat-2 gap-2">
                      {galleryImages.slice(1, 5).map((image, idx) => (
                        <div className="thumb-cell aspect-ratio-3-2" key={idx} style={{ position: 'relative' }}>
                          <Item
                            key={`hidden-item-${idx + 1}`}
                            original={image}
                            thumbnail={image}
                            title={`Property image ${idx + 2}`}
                          >
                            {({ ref, open }) => (
                              <>
                                <img
                                  ref={ref}
                                  onClick={open}
                                  src={image}
                                  className="thumb-img"
                                  alt={`Property image ${idx + 2}`}
                                  style={{ cursor: 'zoom-in' }}
                                />
                                {idx === 3 && galleryImages.length > 5 && (
                                  <div
                                    onClick={open}
                                    className="thumb-more-overlay"
                                    style={{
                                      position: 'absolute',
                                      
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      background: 'rgba(30,30,40,0.65)',
                                      color: '#fff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: 48,
                                      fontWeight: 700,
                                      letterSpacing: 2,
                                      cursor: 'pointer',
                                      borderRadius: 8,
                                      zIndex: 2,
                                    }}
                                  >
                                    {`+${galleryImages.length - 5}`}
                                  </div>
                                )}
                              </>
                            )}
                          </Item>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {galleryImages.slice(5).map((image, idx) => (
                  <Item
                    key={`hidden-item-${idx + 5}`}
                    original={image}
                    thumbnail={image}
                    title={`Property image ${idx + 6}`}
                  >
                    {({ ref }) => (
                      <span ref={ref} style={{ display: 'none' }} />
                    )}
                  </Item>
                ))}
              </>

            )}

          </div>

        </Gallery>
        <div className="row mt-5">
          {overviewData.map((item, index) => (
            <div key={index} className="col-sm-6 col-md-4 col-xl-2">
              <div className="overview-element dark-version mb25 d-flex align-items-center">
                <span className={`icon ${item.icon}`} />
                <div className="ml15">
                  <h6 className="mb-0 text-white">{item.label}</h6>
                  <p className="text mb-0 fz15 text-white">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PropertyGallery;


