"use client";
import agents from "@/data/agents";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.min.css";

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
        spaceBetween={2}
        breakpoints={{
          300: {
            slidesPerView: 4,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
        autoplay={{
          delay: 3000, // Set the desired delay for autoplay
          disableOnInteraction: false, // Keep autoplaying even when user interacts with the swiper
        }}
      >
        {dataAgentMockup.map((agent, index) => (
          <SwiperSlide key={index}>
            <div className="item" key={index}>
              <Link  href={`#`}>
                <div className="rounded mb30">
                  <div className="team-img">
                    <Image
                      width={250}
                      height={250}
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
