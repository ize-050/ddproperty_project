"use client";
import agents from "@/data/agents";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

const Agents = () => {

  const  dataAgentMockup = [
    {
    id: 1,
    name: "Oat - Supakorn",
    position : "CEO",
    image: "/images/agent/staff-01.png",
    },
    {
    id: 2,
    name: "Amy - Thannaree",
    position : "Sale Director",
    image: "/images/agent/staff-02.png",
    },
    {
    id: 3,
    name: "ize - Chanyapak",
    position : "Sale Manager",
    image: "/images/agent/staff-03.png",
    },
    {
      id: 4,
      name: "Min - Wanvisa",
      position : "Rental Management",
      image: "/images/agent/staff-04.png",
      },
]

  return (
    <>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          300: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          576: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="agents-swiper"
      >
        {dataAgentMockup.map((agent, index) => (
          <SwiperSlide key={index}>
            <div className="item" key={index}>
              <Link  href={`#`}>
                <div className="rounded mb30">
                  <div className="team-img">
                    <Image
                      width={200}
                      height={200}
                      className="rounded-3"
                      src={agent.image}
                      alt="agent team"
                    />
                  </div>
                  <div className="team-content pt20">
                    <h6 className="name mb-1">{agent.name}</h6>
                    <p className="text fz15 mb-0">{agent.position}</p>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Agents;
