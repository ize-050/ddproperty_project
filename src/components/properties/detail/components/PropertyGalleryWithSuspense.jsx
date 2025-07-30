'use client'

import React, { Suspense, useState, useEffect } from 'react';
import PropertyGallery from './PropertyGallery';
import LoadingAnimation from '@/components/common/LoadingAnimation';

// Gallery-specific loading component
const GalleryLoadingPlaceholder = () => (
  <section className="property-gallery-section">
    <div className="container">
      {/* Gallery skeleton with animated shimmer */}
      <div className="row">
        <div className="col-md-6">
          <div className="sp-img-content mb15-md">
            <div className="preview-img-1 sp-img">
              <div 
                className="skeleton-shimmer"
                style={{
                  width: '100%',
                  height: '400px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div 
                  className="shimmer-wave"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="thumbs-grid w-100 h-100 d-grid grid-template-columns-repeat-2 gap-2">
            {[1, 2, 3, 4].map((idx) => (
              <div 
                key={idx}
                className="thumb-cell aspect-ratio-3-2 skeleton-shimmer"
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  minHeight: '150px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div 
                  className="shimmer-wave"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    animation: `shimmer 1.5s infinite ${idx * 0.2}s`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Overview skeleton with shimmer */}
      <div className="row mt-5">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="col-sm-6 col-md-4 col-xl-2">
            <div className="overview-element dark-version mb25 d-flex align-items-center">
              <div 
                className="skeleton-shimmer"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '50%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div 
                  className="shimmer-wave"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  }}
                />
              </div>
              <div className="ml15">
                <div 
                  className="skeleton-shimmer"
                  style={{
                    width: '80px',
                    height: '16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    className="shimmer-wave"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      animation: 'shimmer 1.5s infinite'
                    }}
                  />
                </div>
                <div 
                  className="skeleton-shimmer"
                  style={{
                    width: '60px',
                    height: '14px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    className="shimmer-wave"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                      animation: 'shimmer 1.5s infinite'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  </section>
);

// Component ที่จัดการ image preloading
const PropertyGalleryPreloader = ({ images, property }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) {
      setImagesLoaded(true);
      return;
    }

    // Preload รูปภาพหลัก (5 รูปแรก)
    const imagesToPreload = images.slice(0, 5);
    let loadedImages = 0;

    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedImages++;
          setLoadedCount(loadedImages);
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    // Preload รูปภาพทั้งหมด
    Promise.all(imagesToPreload.map(preloadImage))
      .then(() => {
        setImagesLoaded(true);
      })
      .catch((error) => {
        console.warn('Some images failed to load:', error);
        // แม้รูปบางรูปโหลดไม่ได้ ก็ให้แสดงผลได้
        setImagesLoaded(true);
      });
  }, [images]);

  // แสดง loading ถ้ารูปยังโหลดไม่เสร็จ
  if (!imagesLoaded) {
    return <GalleryLoadingPlaceholder />;
  }

  // แสดง PropertyGallery เมื่อรูปโหลดเสร็จแล้ว
  return <PropertyGallery images={images} property={property} />;
};

// Main component ที่ใช้ Suspense
const PropertyGalleryWithSuspense = ({ images, property }) => {
  return (
    <Suspense fallback={<GalleryLoadingPlaceholder />}>
      <PropertyGalleryPreloader images={images} property={property} />
    </Suspense>
  );
};

export default PropertyGalleryWithSuspense;
