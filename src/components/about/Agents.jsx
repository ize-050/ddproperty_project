"use client";
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
    position : "CEO & Founder",
    image: "/images/staff/oat.jpg",
    },
    {
    id: 2,
    name: "Amy - Thannaree",
    position : "Sale Director",
    image: "/images/staff/amy.jpg",
    },
    {
    id: 3,
    name: "ize - Chanyapak",
    position : "Sale Manager",
    image: "/images/staff/ize.jpg",
    },
    {
    id: 4,
    name: "Bam - Bamrung",
    position : "Graphic Designer",
    image: "/images/staff/bam.jpg",
    },
    {
    id: 5,
    name: "Min - Wanvisa",
    position : "Rental Management",
    image: "/images/staff/min.jpg",
    },
    {
    id: 6,
    name: "Tine - Jintana",
    position : "Rental Management",
    image: "/images/staff/tine.jpg",
    },
]

  // แบ่งข้อมูลสำหรับ desktop และ mobile
  const firstRow = dataAgentMockup.slice(0, 3);
  const secondRow = dataAgentMockup.slice(3, 6);

  // สำหรับ desktop: แสดงทั้ง 6 คนใน 1 slide (2 แถว)
  const renderDesktopSlide = () => (
    <div className="d-none d-md-block">
      <div className="container">
        <div className="row justify-content-center mb-4">
          {firstRow.map((agent) => (
            <div className="col-lg-4 col-md-4" key={agent.id}>
              <div className="item team-member-item text-center">
                <Link href={`#`}>
                  <div className="rounded mb30">
                    <div className="team-img d-flex justify-content-center">
                      <Image
                        width={200}
                        height={200}
                        className="rounded-3"
                        src={agent.image}
                        alt="agent team"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="team-content pt20">
                      <h6 className="name mb-1">{agent.name}</h6>
                      <p className="text fz15 mb-0">{agent.position}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="row justify-content-center">
          {secondRow.map((agent) => (
            <div className="col-lg-4 col-md-4" key={agent.id}>
              <div className="item team-member-item text-center">
                <Link href={`#`}>
                  <div className="rounded mb30">
                    <div className="team-img d-flex justify-content-center">
                      <Image
                        width={200}
                        height={200}
                        className="rounded-3"
                        src={agent.image}
                        alt="agent team"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="team-content pt20">
                      <h6 className="name mb-1">{agent.name}</h6>
                      <p className="text fz15 mb-0">{agent.position}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // สำหรับ mobile: แสดง 2 คนต่อ slide (2 แถว 1 คนต่อแถว)
  const renderMobileSlide = (agents) => (
    <div className="d-md-none">
      {agents.map((agent) => (
        <div className="row justify-content-center mb-3" key={agent.id}>
          <div className="col-8">
            <div className="item team-member-item">
              <Link href={`#`}>
                <div className="rounded mb30">
                  <div className="team-img">
                    <Image
                      width={200}
                      height={200}
                      className="rounded-3"
                      src={agent.image}
                      alt="agent team"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="team-content pt20">
                    <h6 className="name mb-1">{agent.name}</h6>
                    <p className="text fz15 mb-0">{agent.position}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Version - 1 slide with all 6 agents */}
      <div className="d-none d-md-block">
        {renderDesktopSlide()}
      </div>

      {/* Mobile Version - Swiper with 2 agents per slide */}
      <div className="d-md-none">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="agents-swiper"
        >
          <SwiperSlide>
            {renderMobileSlide([dataAgentMockup[0], dataAgentMockup[1]])}
          </SwiperSlide>
          <SwiperSlide>
            {renderMobileSlide([dataAgentMockup[2], dataAgentMockup[3]])}
          </SwiperSlide>
          <SwiperSlide>
            {renderMobileSlide([dataAgentMockup[4], dataAgentMockup[5]])}
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default Agents;
