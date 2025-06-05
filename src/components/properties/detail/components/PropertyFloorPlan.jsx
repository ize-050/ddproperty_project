import React, { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

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
          spaceBetween={0}
          slidesPerView={1}
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="floor-plan-slider"
        >
          {property.floorPlans.map((plan, index) => (
            <SwiperSlide key={`floor-plan-${index}`}>
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${plan.url}`}
                alt={plan.title || `Floor Plan ${index + 1}`}
                className="floor-plan-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .floor-plan-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-bottom: 20px;
        }
        
        .floor-plan-slider {
          width: 100%;
        }
        
        .floor-plan-slider .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
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