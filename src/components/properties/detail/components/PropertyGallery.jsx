'use client'

import React from 'react';

const PropertyGallery = ({ images, property }) => {
  return (
    <section className="property-gallery-section">
      <div className="container">
        <div className="row">
          {images.length > 0 && (
            <>
              <div className="col-md-8">
                <div className="sp-img-content mb15-md">
                  <div className="popup-img preview-img-1 sp-img">
                    <img 
                      src={images[0]} 
                      alt={property.projectName || 'Property'} 
                      className="w-100 h-100 cover"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="row">
                  {images.slice(1, 5).map((image, index) => (
                    <div className="col-6 ps-sm-0" key={index}>
                      <div className="sp-img-content">
                        <div className={`popup-img preview-img-${index + 2} sp-img mb10`}>
                          <img 
                            src={image} 
                            alt={`Property image ${index + 2}`} 
                            className="w-100 h-100 cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* ถ้ามีรูปน้อยกว่า 5 รูป ให้เพิ่มรูปเปล่า */}
                  {Array.from({ length: Math.max(0, 5 - images.length) }).map((_, index) => (
                    <div className="col-6 ps-sm-0" key={`empty-${index}`}>
                      <div className="sp-img-content">
                        <div className={`popup-img preview-img-${images.length + index + 1} sp-img mb10`}>
                          <img 
                            src="/images/property/fp1.jpg" 
                            alt="Property placeholder" 
                            className="w-100 h-100 cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <div className="property-actions d-flex justify-content-between">
              <div className="property-stats d-flex">
                <div className="stat-item me-4">
                  <i className="fas fa-eye me-2"></i>
                  <span>1,234 views</span>
                </div>
                <div className="stat-item me-4">
                  <i className="far fa-calendar-alt me-2"></i>
                  <span>Posted 2 days ago</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-share-alt me-2"></i>
                  <span>Share</span>
                </div>
              </div>
              <div className="property-actions-right">
                <button className="btn btn-outline-secondary btn-sm me-2">
                  <i className="far fa-heart me-2"></i>
                  Save
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="fas fa-print me-2"></i>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyGallery;
