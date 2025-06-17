import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PropertyFloorPlan = ({ property }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!property?.floorPlans || property.floorPlans.length === 0) {
    return null;
  }

  return (
    <div className="property-section floor-plan-section mb-5">
      <h3 className="section-title mb-3">Floor Plans</h3>
      <div className="floor-plan-container">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.floorplan-next',
            prevEl: '.floorplan-prev',
          }}
          pagination={{ 
            clickable: true,
            el: '.floorplan-pagination'
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="floor-plan-slider"
        >
          {property.floorPlans.map((plan, index) => (
            <SwiperSlide key={`floor-plan-${index}`}>
              <div className="floor-plan-slide-container">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${plan.url}`}
                  alt={plan.title || `Floor Plan ${index + 1}`}
                  className="floor-plan-image"
                />
              </div>
            </SwiperSlide>
          ))}
          <div className="floorplan-next swiper-button-next"></div>
          <div className="floorplan-prev swiper-button-prev"></div>
          <div className="floorplan-pagination" style={{ textAlign: 'center', width: '100%', marginTop: '20px' }}></div>
        </Swiper>
      </div>

      <style jsx global>{`
        .floor-plan-container {
          position: relative;
          width: 100%;
          overflow: visible;
          margin-bottom: 40px;
        }
        
        .floor-plan-slider {
          width: 100%;
          position: relative;
          padding: 0 0 40px;
        }
        
        .floor-plan-slider .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          height: auto;
          overflow: hidden;
        }
        
        .floor-plan-slide-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .floor-plan-image {
          max-width: 100%;
          max-height: 500px;
          object-fit: contain;
        }
        
        .swiper-button-next,
        .swiper-button-prev {
          color: #4a90e2;
        }
        
        .swiper-pagination {
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100%;
        }
        
        .swiper-pagination-bullet-active {
          background: #4a90e2;
        }
        
        .floor-plan-image {
          width: 100%;
          object-fit: cover;
        }
        
        /* Custom navigation styles */
        .floor-plan-container .swiper-button-next,
        .floor-plan-container .swiper-button-prev {
          color: rgba(0, 0, 0, 0.5);
          background: rgba(255, 255, 255, 0.7);
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        
        .floor-plan-container .swiper-button-next:after,
        .floor-plan-container .swiper-button-prev:after {
          font-size: 16px;
        }
        
        .floor-plan-container .swiper-pagination-bullet-active {
          background: #0073e1;
        }
      `}</style>
    </div>
  );
};

export default PropertyFloorPlan;