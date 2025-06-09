"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslations, useLocale } from 'next-intl';
import { convertAndFormatPrice, convertAndFormatPriceSync, localeToCurrencySymbol } from '@/utils/currencyUtils';



const RandomProperties = ({ randomProperties }) => {
  const t = useTranslations('home');
  const locale = useLocale();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formattedPrices, setFormattedPrices] = useState({});
  
  // สัญลักษณ์สกุลเงินตามภาษา
  const currencySymbol = localeToCurrencySymbol(locale);

  // ฟังก์ชันสำหรับแปลงราคาเป็นรูปแบบที่อ่านง่าย
  const formatPrice = (price) => {
    return convertAndFormatPriceSync(price, locale, false);
  };
  
  // โหลดราคาที่แปลงแล้วสำหรับแต่ละทรัพย์สิน
  useEffect(() => {

    const loadFormattedPrices = async () => {
      if (properties.length > 0) {
        const pricesObj = {};
        
        for (const property of properties) {
          if (property.listings && property.listings.length > 0) {
            for (const listing of property.listings) {
              if (listing.price) {
                const key = `${property.id}-${listing.id}`;
                pricesObj[key] = await convertAndFormatPrice(listing.price, locale, false);
              }
            }
          }
        }
        
        setFormattedPrices(pricesObj);
      }
    };
    
    loadFormattedPrices();
  }, [properties, locale]);

  // ใช้ข้อมูลจาก props ที่ได้จาก SSR
  useEffect(() => {
    try {
      if (randomProperties && Array.isArray(randomProperties) && randomProperties.length > 0) {
        console.log('Random Properties:', randomProperties);
        setProperties(randomProperties);
      } else {
        console.log('No random properties data or invalid format:', randomProperties);
        setProperties([]);
      }
    } catch (err) {
      console.error('Error setting properties from props:', err);
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [randomProperties]);



  // แสดง loading state
  if (loading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-title text-center mb-5">
              <h2 className="title">{t('randomProperties.loading')}</h2>
              <div className="d-flex justify-content-center mt-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // แสดงข้อความ error
  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-title text-center mb-5">
              <h2 className="title">{t('randomProperties.error')}</h2>
              <p className="text-danger">{error}</p>
              <button 
                className="btn btn-primary mt-3" 
                onClick={fetchRandomProperties}
              >
                {t('randomProperties.retry')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {properties && properties.length > 0 && (
        <div className="position-relative featured-property-wrapper">
          {/* Navigation Buttons for both mobile and desktop */}
          <div className="featured-slider-navigation">
            <button className="featured-prev__active slider-arrow">
              <i className="far fa-arrow-left-long"></i>
            </button>
            <button className="featured-next__active slider-arrow">
              <i className="far fa-arrow-right-long"></i>
            </button>
          </div>
          
          <Swiper
            className="overflow-visible featured-property-slider"
            spaceBetween={30}
            modules={[Navigation]}
            navigation={{
              nextEl: ".featured-next__active",
              prevEl: ".featured-prev__active",
            }}
            slidesPerView={1}
            loop={false}
            breakpoints={{
              300: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id}>
               
                <div className="item">
                  <div className="listing-style9">
                    <div className="list-thumb">  
                      <img
                        className="cover"

                        src={property.images && property.images[0] && property.images[0].url ? 
                          (property.images[0].url.startsWith('http') ? 
                            property.images[0].url : property.images[0].url 
                          ) : 
                          "/images/listings/default-property.jpg"
                        }
                        alt={property.projectName}
                        style={{ objectFit: 'cover', height: '520px', width: '100%' }}
                      />
                      <div className="sale-sticker-wrap">
                        {/*<div className="list-tag rounded-0 fz12">*/}
                        {/*  <span className="flaticon-electricity" />*/}
                        {/*  FEATURED*/}
                        {/*</div>*/}
                        <div className="list-tag2 rounded-0 fz12">{property.listings?.map((listing) => listing.listingType).join(', ')}</div>
                      </div>

                      <div className="list-meta">
                        <Link href={`/property_detail/${property.id}`} className="list-meta-link">
                          <span className="flaticon-fullscreen" />
                        </Link>
                      </div>
                    </div>

                    <div className="list-content">
                      <div className="list-price">
                        {property.listings?.[0]?.price 
                          ? `${currencySymbol}${formattedPrices[`${property.id}-${property.listings[0].id}`] || formatPrice(property.listings[0].price)}` 
                          : 'Contact for price'}
                      </div>
                      <h6 className="list-title my-1">
                        <Link href={`/property_detail/${property.id}`}>{property.projectName}</Link>
                      </h6>
                      <p className="list-text"
                        style={{ fontSize: '14px', color: '#fff' }}
                      >{property.address || property.city}</p>
                      <div className="list-meta2 d-flex align-items-center">
                        <a className="mr10" href="#">
                          <span className="flaticon-bed" /> {property.bedrooms || 0} {t('randomProperties.bed')}
                        </a>
                        <a className="mr10" href="#">
                          <span className="flaticon-shower" /> {property.bathrooms || 0} {t('randomProperties.bath')}
                        </a>
                        <a href="#">
                          <span className="flaticon-expand" /> {property.area || 0} {t('randomProperties.sqm')}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      
      <style jsx global>{`
        .featured-property-wrapper {
          position: relative;
          margin-bottom: 30px;
        }
        
        /* Arrow navigation styling for both desktop and mobile */
        .featured-slider-navigation .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }
        
        .featured-slider-navigation .featured-prev__active {
          left: 15px;
        }
        
        .featured-slider-navigation .featured-next__active {
          right: 15px;
        }
        
        .featured-slider-navigation .slider-arrow i {
          font-size: 16px;
          color: #333;
        }
        
        .featured-slider-navigation .slider-arrow:hover {
          background-color: #fff;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        @media (max-width: 767px) {
          .featured-property-slider {
            padding: 0 10px;
          }
          
          .featured-slider-navigation .slider-arrow {
            width: 34px;
            height: 34px;
          }
          
          .featured-slider-navigation .featured-prev__active {
            left: 5px;
          }
          
          .featured-slider-navigation .featured-next__active {
            right: 5px;
          }
        }
      `}</style>
    </>
  );
};

export default RandomProperties;
