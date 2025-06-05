"use client";

import { useState, useEffect } from 'react';
import useZoneStore from '@/store/useZoneStore';
import dynamic from 'next/dynamic';
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';


// ใช้ dynamic import เพื่อแก้ไขปัญหา hydration error
const SidebarStickyBar = dynamic(() => import("@/components/home/home/SidebarStickyBar"), { ssr: false });
const Hero = dynamic(() => import("@/components/home/home/hero"), { ssr: false });
const Blog = dynamic(() => import("@/components/common/Blog"), { ssr: false });
const Contact = dynamic(() => import("@/components/home/home/Contact"), { ssr: false });
const Agents = dynamic(() => import("@/components/home/home/Agents"), { ssr: false });
const FeatureProperties = dynamic(() => import("@/components/home/home/FeatureProperties"), { ssr: false });
const Explore = dynamic(() => import("@/components/common/Explore"), { ssr: false });
const ExploreCities = dynamic(() => import("@/components/home/home/ExploreCities"), { ssr: false });
const Service = dynamic(() => import("@/components/home/home/Service"), { ssr: false });
const FeaturedHomes = dynamic(() => import("@/components/home/home/FeaturedHomes"), { ssr: false });
const PartnerDark = dynamic(() => import("@/components/common/PartnerDark"), { ssr: false });
const RandomProperties = dynamic(() => import("@/components/home/home/RandomProperties"), { ssr: false });
const ExploreLocations = dynamic(() => import("@/components/ExploreLocations/ExploreLocations"), { ssr: false });
const LatestBlogs = dynamic(() => import("@/components/LatestBlogs/LatestBlogs"), { ssr: false });
const PropertyTypes = dynamic(() => import("@/components/PropertyTypes/PropertyTypes"), { ssr: false });

const Page = ({ randomProperties, zones }) => {
  // ใช้ useState และ useEffect เพื่อแก้ไขปัญหา hydration error
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('home');
  
  // นำข้อมูล zones ไปเก็บใน Zustand store
  const setZones = useZoneStore(state => state.setZones);
  
  useEffect(() => {
    setIsClient(true);
    
    console.log("zoneszones",zones)
    if (zones && zones.length > 0) {
      setZones(zones);
      console.log('Zones data stored in Zustand store:', zones);
    }
  }, [zones, setZones]);
  
  // ถ้ายังไม่อยู่ใน client side ให้แสดง loading หรือ skeleton
//   if (!isClient) {
//     return <div className="loading-container"><div className="loading-spinner"></div></div>;
//   }
  
  return (
    <>
      {/* Sidebar Sticky Bar */}
      <SidebarStickyBar />

      {/* Home Banner Style V1 */}
      <section className="home-banner-style8 p0">
        <div className="home-style8">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <Hero />
            </div>
          </div>
          {/* End .container */}
        </div>
      </section>
      {/* End Home Banner Style V4 */}

      {/* Our Partners */}
      <section className="our-partners bgc-dark pt60 pb60">
        <div className="container">
          <div className="row">
            <div className="col-lg-12" data-aos="fade-up">
              <div className="main-title text-center">
                <h6 className="text-white">Developer</h6>
              </div>
            </div>
            <div className="col-lg-12 text-center">
              <div
                className="dots_none nav_none "
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <PartnerDark />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Our Partners */}

      {/* Featured Listings */}
      <section id="explore-property" className="pb40-md pb90">
        <div className="container">
          <div className="row align-items-center" data-aos="fade-up">
            <div className="col-lg-9">
              <div className="main-title2">
                <h2 className="title">{t('featured.title')}</h2>
                <p className="paragraph">
                  {t('featured.subtitle')}
                </p>
              </div>
            </div>
          </div>
          {/* End header */}

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-listing-slider">
                <RandomProperties randomProperties={randomProperties} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Featured Listings */}

      {/* Random Properties */}
     
      {/* End Random Properties */}

      {/* Property Types */}
      <section className="pt-0 pb90 pb30-md">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-auto">
              <div
                className="main-title"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h2 className="title">{t('propertyTypes.title')}</h2>
                <p className="paragraph">
                  {t('propertyTypes.subtitle')}
                </p>
              </div>
            </div>
            {/* End header */}

            <div className="col-auto mb30">
              <div className="row align-items-center justify-content-center">
                <div className="col-auto">
                  <button className="properties_homes-prev__active swiper_button">
                    <i className="far fa-arrow-left-long" />
                  </button>
                </div>
                {/* End prev */}

                <div className="col-auto">
                  <div className="pagination swiper--pagination properties_homes_pagination__active" />
                </div>
                {/* End pagination */}

                <div className="col-auto">
                  <button className="properties_homes-next__active swiper_button">
                    <i className="far fa-arrow-right-long" />
                  </button>
                </div>
                {/* End Next */}
              </div>
            </div>
            {/* End .col for navigation and pagination */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
              <div className="explore-apartment-5col-slider">
                <PropertyTypes />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* End Property Types */}

      {/* CTA Banner */}
      <section className="pt30 pb-0">
        <div className="cta-banner5 bgc-f7 ms-auto maxw1850 pt100 pt60-lg pb90 pb30-lg position-relative overflow-hidden mx20-lg">
          <div className="container">
            <div className="row">
              <div className="col-md-11 wow fadeInUp" data-aos-delay="100">
                <div className="main-title">
                  <h2 className="title text-capitalize">
                    Let’s find the right selling{" "}
                    <br className="d-none d-md-block" /> option for you
                  </h2>
                  <p className="text">
                    Aliquam lacinia diam quis lacus euismod
                  </p>
                </div>
              </div>
            </div>
            {/* End .row */}

            <div className="row" data-aos="fade-up" data-aos-delay="200">
              <Service />
            </div>
          </div>
        </div>
      </section>

      <section className="pb80 pb30-md">
        <div className="container">
          <div className="row">
            <div
              className="col-md-9 col-lg-5 col-xl-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="main-title mb30">
                <h2 className="title mb20">Explore Locations</h2>
                <p className="text">
                  Pattaya&apos;s divese landscape extends beyong its
                  beaches and nightlife, offering a variety of locations {" "}
                  with unique characteristics that cater to different { " "} real
                  estate needs and investment strategies.
                  <br className="d-none d-lg-block" />
                  tristique.
                </p>
              </div>
              <p href="/agency" className="ud-btn btn-transparent mb30-md">
                More
                <i className="fal fa-arrow-right-long" />
              </p>
            </div>
            {/* End .col */}

            <div
              className="col-lg-7 col-xl-7 offset-xl-1"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <ExploreLocations />
            </div>
          </div>
          {/* End row */}
        </div>
      </section>




      {/* Explore Apartment */}
      <section className="pt0 pb60 pb10-md">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 m-auto wow fadeInUp"
              data-wow-delay="300ms"
            >
              <div className="main-title text-center">
                <h2 className="title">See How Realton Can Help</h2>
                <p className="paragraph">
                  Aliquam lacinia diam quis lacus euismod
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <Explore />
          </div>
        </div>
      </section>
      {/* End Explore Apartment */}

      {/* Blog Section */}


      {/* Our Exclusive Agetns */}
      <section className="pb80 pb30-md">
        <div className="container">
          <div className="row">
            <div
              className="col-md-9 col-lg-5 col-xl-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="main-title mb30">
                <h2 className="title mb20">Meet Our Team</h2>
                <p className="text">
                  Our Professional Consulttancies ready to help you to 
                  <br className="d-none d-lg-block" />
                  get your dream property.
                </p>
              </div>
            </div>
            {/* End .col */}

            <div className="col-lg-7 col-xl-7 offset-xl-1">
              <Agents />
            </div>
            {/* End .col */}
          </div>
          {/* End row */}
        </div>
      </section>
      {/* End  Our Exclusive Agetns */}


      <section className="pb90 pb30-md bgc-f7">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12 text-center">
              <div className="main-title2">
                <h2 className="title">{t('blogs.section.title')}</h2>
                <p className="paragraph">
                  {t('blogs.section.subtitle')}
                </p>
              </div>
            </div>
          </div>
          {/* End header */}

          <div className="row" data-aos="fade-up" data-aos-delay="200">
            <div className="col-lg-12">
              <LatestBlogs />
            </div>
          </div>
        </div>
      </section>
      {/* End Blog Section */}

      {/* Our Contact With Map */}
      <section className="pt70 pb25">
        <iframe
          className="home8-map"
          loading="lazy"
          width={1920}
          height={900}
          src="/images/home/bg-photo-home-01.png"
          title="London Eye, London, United Kingdom"
          aria-label="London Eye, London, United Kingdom"
        />
        {/* End map */}

        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-6 position-relative">
              <div className="home8-contact-form bdrs12 p40 p30-md bgc-white">
                <h2 className="form-title">Get In Touch</h2>
                <p className="text ">
                  Aliquam lacinia diam quis lacus euismod
                </p>
                <Contact />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Our Contact With Map */}
    </>
  );
};

export default Page;