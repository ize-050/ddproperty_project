"use client";
import agents from "@/data/agents";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import useTranslation from "@/hooks/useTranslation";


const Agents = () => {

  const { getString } = useTranslation('home');

  const  dataAgentMockup = [
    {
    id: 1,
    name: getString('agents.name'),
    position : getString('agents.position'),
    image: "/images/agent/staff-01.png",
    },
    {
    id: 2,
    name: getString('agents.name2'),
    position : getString('agents.position2'),
    image: "/images/agent/staff-02.png",
    },
    {
    id: 3,
    name: getString('agents.name3'),
    position : getString('agents.position3'),
    image: "/images/agent/staff-03.png",
    },
]

  return (
    <>
      <Swiper
        spaceBetween={30}
        breakpoints={{
          300: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 3,
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
                <div className="team-style1 mb30">
                  <div className="team-img">
                    <Image
                      width={217}
                      height={248}
                      className="w-100 h-100 cover"
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
