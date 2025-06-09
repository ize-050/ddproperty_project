import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import propertyTypeService from '@/services/propertyTypeService';
import styles from './PropertyTypes.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PropertyTypes = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [randomProperties, setRandomProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const t = useTranslations('home.propertyTypes');
  const commonT = useTranslations('common');
  const locale = useLocale();
  
  // We want to show only these property types in this order
  const targetTypes = ['CONDO', 'HOUSE', 'VILLA', 'APARTMENT','TOWNHOUSE','LAND','HOME OFFICE'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const typesResponse = await propertyTypeService.getPropertyTypes();
        console.log("All property types with counts:", typesResponse.data);

        const randomResponse = await propertyTypeService.getRandomPropertiesByType();
        console.log("Random properties:", randomResponse.data);
        console.log("randomResponse", randomResponse);
        // Group random properties by type
        const propertiesByType = {};
        randomResponse.data.forEach(property => {
          if (!propertiesByType[property.propertyType]) {
            propertiesByType[property.propertyType] = property;
          }
        });
        console.log("propertiesByType", propertiesByType);
        
        // Filter and sort to show only the target types and in the specified order
        const filteredTypes = [];
        targetTypes.forEach(targetType => {
          const foundType = typesResponse.data.find(type => type.name === targetType);
          if (foundType && foundType.count > 0) {
            filteredTypes.push(foundType);
          }
        });

        setPropertyTypes(filteredTypes);
        setRandomProperties(propertiesByType);
        setError(null);
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError('Error loading property types');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize pagination after the component renders
  useEffect(() => {
    if (swiperInstance) {
      // Force update pagination after component mounts
      swiperInstance.pagination.render();
      swiperInstance.pagination.update();
    }
  }, [swiperInstance]);

  // Get the localized name based on current locale
  const getLocalizedName = (propertyType) => {
    return locale === 'th' ? propertyType.nameTh : propertyType.name;
  };

  // Get a property image for a specific type
  const getPropertyImage = (propertyType) => {
   if (randomProperties[propertyType.name]) {
      return randomProperties[propertyType.name].images[0].url;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-3">
        {error}
      </div>
    );
  }

  if (!propertyTypes.length) {
    return (
      <div className="alert alert-info my-3">
        {t('noPropertyTypesFound')}
      </div>
    );
  }

  return (
    <div className="position-relative property-types-wrapper">
      {/* ส่วนสำหรับ desktop */}
      <div className="property-types-header desktop-header">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="property-types-title">
            <h2 className="title">{t('title')}</h2>
            <p>{t('subtitle')}</p>
          </div>
          <div className="d-flex align-items-center navigation-wrapper">
            <button className="property-types-prev simple-arrow">
              <i className="far fa-arrow-left-long"></i>
            </button>
            <div className="property-types-pagination"></div>
            <button className="property-types-next simple-arrow">
              <i className="far fa-arrow-right-long"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* ส่วนสำหรับ mobile */}
      <div className="property-types-header mobile-header">
        <div className="property-types-title">
          <h2 className="title">{t('title')}</h2>
          <p>{t('subtitle')}</p>
        </div>
        <div className="d-flex align-items-center navigation-wrapper">
          <button className="property-types-prev-mobile simple-arrow">
            <i className="far fa-arrow-left-long"></i>
          </button>
          <div className="property-types-pagination-mobile"></div>
          <button className="property-types-next-mobile simple-arrow">
            <i className="far fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        navigation={{
          prevEl: '.property-types-prev',
          nextEl: '.property-types-next',
        }}
        pagination={{ 
          el: '.property-types-pagination',
          clickable: true,
        }}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
          // Set up mobile navigation
          const mobilePrev = document.querySelector('.property-types-prev-mobile');
          const mobileNext = document.querySelector('.property-types-next-mobile');
          const mobilePagination = document.querySelector('.property-types-pagination-mobile');
          
          if (mobilePrev && mobileNext) {
            mobilePrev.addEventListener('click', () => swiper.slidePrev());
            mobileNext.addEventListener('click', () => swiper.slideNext());
          }
          
          // Clone bullets from main pagination to mobile pagination
          if (mobilePagination) {
            swiper.on('paginationRender', function() {
              const bullets = document.querySelector('.property-types-pagination')?.innerHTML;
              if (bullets && mobilePagination) {
                mobilePagination.innerHTML = bullets;
              }
            });
          }
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          576: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 4,
            spaceBetween: 20,
          }
        }}
        className="property-types-slider"
      >
        {propertyTypes.map((propertyType) => (
          <SwiperSlide key={propertyType.id}>
            <Link href={`/properties/list?propertyType=${propertyType.name}`} style={{ textDecoration: 'none' }}>
              <div className={styles.cardImage}>
                {getPropertyImage(propertyType) ? (
                  <Image
                    src={getPropertyImage(propertyType)}
                    width={270}
                    height={270}
                    alt={getLocalizedName(propertyType)}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <div className={styles.noImage}>
                    <span>{getLocalizedName(propertyType)}</span>
                  </div>
                )}
                <div className={styles.cardOverlay}>
                  <h4 className={styles.overlayTitle}>{getLocalizedName(propertyType)}</h4>
                  <p className={styles.overlayCount}>{propertyType.count} {commonT('property_other', { count: propertyType.count })}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .property-types-wrapper {
          position: relative;
          margin-bottom: 30px;
          padding: 0 5px;
        }
        
        .property-types-header {
          margin-bottom: 20px;
        }
        
        .desktop-header {
          display: flex;
          align-items: center;
        }
        
        .mobile-header {
          display: none;
        }
        
        .property-types-title h2 {
          margin-bottom: 5px;
          font-weight: 600;
        }
        
        .property-types-title p {
          margin-bottom: 0;
          color: #6B7280;
          font-size: 14px;
        }
        
        .navigation-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        /* Pagination styling */
        .property-types-pagination, .property-types-pagination-mobile {
          display: flex !important;
          justify-content: center;
          align-items: center;
          position: relative;
          width: auto !important;
          height: auto !important;
          margin: 0 !important;
          z-index: 1;
        }
        
        .property-types-pagination .swiper-pagination-bullet,
        .property-types-pagination-mobile .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #ddd;
          opacity: 1;
          margin: 0 4px;
          display: inline-block;
          border-radius: 50%;
          
        }

        .swiper-pagination-fraction, .swiper-pagination-custom, .swiper-horizontal > .swiper-pagination-bullets, .swiper-pagination-bullets.swiper-pagination-horizontal {

          bottom: 0 ;
        }
        
        .property-types-pagination .swiper-pagination-bullet-active,
        .property-types-pagination-mobile .swiper-pagination-bullet-active {
          background-color: #3270FC;
        }
        
        /* Simple Arrow navigation styling */
        .simple-arrow {
          background: none;
          border: none;
          font-size: 20px;
          color: #333;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 2;
        }
        
        .simple-arrow:hover {
          color: #3270FC;
        }
        
        @media (max-width: 767px) {
          .property-types-slider {
            padding: 0 5px;
          }
          
          .desktop-header {
            display: none;
          }
          
          .mobile-header {
            display: block;
          }
          
          .mobile-header .navigation-wrapper {
            justify-content: flex-start;
            margin-top: 10px;
          }
          
          .mobile-header .property-types-title {
            margin-bottom: 10px;
          }
          
          .property-types-title h2 {
            font-size: 24px;
          }
          
          .property-types-title p {
            font-size: 13px;
          }
          
          .simple-arrow {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyTypes;
