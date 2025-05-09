import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';


const PropertyCardsSkeleton = ({ count = 8 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div className="col-sm-6 col-md-4 col-lg-4 mb-4" key={index}>
          <div className="property-card-skeleton">
            <div className="image-skeleton"></div>
            <div className="content-skeleton">
              <div className="title-skeleton"></div>
              <div className="address-skeleton"></div>
              <div className="features-skeleton">
                <div className="feature-item-skeleton"></div>
                <div className="feature-item-skeleton"></div>
                <div className="feature-item-skeleton"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const PropertyFiltering = dynamic(() => import('@/components/pages/listing/grid-view/grid-full-4-col/PropertyFiltering'), {
  // loading: () => <LoadingAnimation />, // สามารถใช้ได้ถ้าต้องการ fallback เฉพาะ dynamic import
  ssr: false
});

export default function PropertyFilteringSuspense({ property }) {
  return (
    <Suspense fallback={<div style={{ minHeight: 320 }}><PropertyCardsSkeleton /></div>}>
      <PropertyFiltering property={property} />
    </Suspense>
  );
}
