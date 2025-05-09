'use client'

import React from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import '@/styles/property-detail-gallery.scss';


const PropertyGallery = ({ images, property }) => {
  const galleryImages = images && images.length > 0 ? images : ['/images/property/fp1.jpg'];

  return (
    <section className="property-gallery-section">
      <div className="container">
        <Gallery>
          <div className="row">
            {galleryImages.length > 0 && (
              <>
                <div className="col-md-8">
                  <div className="sp-img-content mb15-md">
                    <div className="preview-img-1 sp-img">
                      <Item
                        original={galleryImages[0]}
                        thumbnail={galleryImages}
                        width={1200}
                        height={800}
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
                <div className="col-md-4 d-flex align-items-stretch">
                {galleryImages.length > 1 && (
                  <div className="thumbs-grid w-100 h-100 d-grid grid-template-columns-repeat-2 gap-2">
                    {galleryImages.slice(1, 5).map((image, idx) => (
                      <div className="thumb-cell aspect-ratio-3-2" key={idx} style={{ position: 'relative' }}>
                        <Item
                          key={`hidden-item-${idx + 1}`}
                          original={image}
                          thumbnail={image[idx+1]}
                          width={1200}
                          height={800}

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
                    key={`hidden-item-${idx+5}`}
                    original={image}
                    thumbnail={image}
                    width={1200}
                    height={800}
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
        <div className="row mt-3">
          <div className="col-12">
            <div className="property-actions d-flex justify-content-between">
              <div className="property-stats d-flex align-items-center gap-4" style={{ gap: '32px' }}>
                <div className="stat-item d-flex align-items-center bg-dark rounded-3 p-3" style={{ minWidth: 160 }}>
                  <i className="fas fa-home fa-lg text-white me-3"></i>
                  <div>
                    <div className="fw-bold text-white" style={{ fontSize: '1.1rem' }}>Property Type</div>
                    <div className="text-white-50">{property.property_type || '-'}</div>
                  </div>
                </div>
                <div className="stat-item d-flex align-items-center bg-dark rounded-3 p-3" style={{ minWidth: 120 }}>
                  <i className="fas fa-bed fa-lg text-white me-3"></i>
                  <div>
                    <div className="fw-bold text-white" style={{ fontSize: '1.1rem' }}>Bedroom</div>
                    <div className="text-white-50">{property.bedrooms ?? '-'}</div>
                  </div>
                </div>
                <div className="stat-item d-flex align-items-center bg-dark rounded-3 p-3" style={{ minWidth: 120 }}>
                  <i className="fas fa-shower fa-lg text-white me-3"></i>
                  <div>
                    <div className="fw-bold text-white" style={{ fontSize: '1.1rem' }}>Bathroom</div>
                    <div className="text-white-50">{property.bathrooms ?? '-'}</div>
                  </div>
                </div>
                <div className="stat-item d-flex align-items-center bg-dark rounded-3 p-3" style={{ minWidth: 160 }}>
                  <i className="fas fa-expand-arrows-alt fa-lg text-white me-3"></i>
                  <div>
                    <div className="fw-bold text-white" style={{ fontSize: '1.1rem' }}>Useable Area</div>
                    <div className="text-white-50">{property.usable_area || property.area ? `${property.usable_area || property.area} sq.m` : '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PropertyGallery;
