"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";

const PartnerDark = () => {
  const partnerImages = [
    {
    id: 1,
    name: "Riviera Wongamat",
    image: "/images/icon/home/develop-02-riviera-wongamat.png",
    width: 100,
    height: 35, 
    },
    {
    id: 2,
    name: "Riviera Monaco",
    image: "/images/icon/home/develop-03-riviera-monaco.png", 
    width: 100,
    height: 35, 
    },
    {
    id: 3,
    name: "Andromeda Monaco",
    image: "/images/icon/home/develop-05-andromeda.png", 
    width: 100,
    height: 35, 
    },
    {
    id: 4,
    name: "Copacabana",
    image: "/images/icon/home/develop-06-copacabana.png", 
    width: 100,
    height: 35, 
    },
    {
    id: 5,
    name: "Elysium",
    image: "/images/icon/home/develop-10-elysium.png", 
    width: 100,
    height: 35, 
    },
    {
    id: 6,
    name: "Grand florida",
    image: "/images/icon/home/develop-09-grand-florida.png", 
    width: 100,
    height: 35, 
    },
];

  return (
    <Swiper
      spaceBetween={5}
      slidesPerView={6} 
      breakpoints={{
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 6,
        },
      }}
      loop
      autoplay={{
        delay: 3000, 
        disableOnInteraction: true,
      }}
      className="swiper-container"
    >
      {partnerImages.map((imageName, index) => (
        <SwiperSlide key={index}>
          <div className="item">
            <div className="partner_item">
              <Image
                width={imageName.width}
                height={imageName.height}
                style={{ 
                  objectFit: "contain", 
                  margin: "0 auto",  
                  padding: "0 5px"   
                }}
                className="wa "
                src={imageName.image}
                alt={imageName.name}
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PartnerDark;
