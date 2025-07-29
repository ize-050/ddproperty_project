import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import useDynamicTranslations from '@/hooks/useDynamicTranslations';
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
  const { t: dynamicT } = useDynamicTranslations('listing');



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const typesResponse = await propertyTypeService.getPropertyTypes();

        setPropertyTypes(typesResponse.data);
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
    // Map locale to correct field name for property types
    let fieldName = 'name'; // default fallback (English)
    switch (locale) {
      case 'th':
        fieldName = 'nameTh';
        break;
      case 'zh':
        fieldName = 'nameCh'; // จีนใช้ nameCh ไม่ใช่ nameZh
        break;
      case 'ru':
        fieldName = 'nameRu';
        break;
      default:
        fieldName = 'name';
    }
    return propertyType[fieldName] || propertyType.name || propertyType.nameTh;
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
    <>
      <section className="pt-0 pb90 pb30-md">
        <div className="container">
          <div className="row  justify-content-between align-items-center">
            <div className="col-auto">
              <div
                className="main-title"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h2 className="title">{dynamicT('property-types-title', 'Property Types')}</h2>
                <p className="paragraph">
                  {dynamicT('property-types-subtitle', 'Discover various types of properties available')}
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
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={2}
                  navigation={{
                    nextEl: ".properties_homes-next__active",
                    prevEl: ".properties_homes-prev__active",
                  }}
                  pagination={{
                    el: ".properties_homes_pagination__active",
                    clickable: true,
                  }}
                  breakpoints={{
                    300: {
                      slidesPerView: 2,
                      spaceBetween: 15,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                    1200: {
                      slidesPerView: 4,
                    },
                  }}
                  loop={true}
                >
                  {propertyTypes.map((propertyType) => (
                    <SwiperSlide key={propertyType.id}>
                      <div className="item">
                        <Link href={`/properties/list?propertyType=${propertyType.name}`} style={{ textDecoration: 'none' }}>
                          <div className="apartment-style2 text-center mb30">
                            <div className="apartment-img">
                              <img
                                width={279}
                                height={200}
                                className="w-100 h-100 cover"
                                src={propertyType.image}
                                alt="homes"
                              />
                            </div>
                            <div className="apartment-content">
                              <h6 className="title mb-0" style={{ fontSize: '16px' ,color:"#fff" }}>{getLocalizedName(propertyType)}</h6>
                              <p className="text mb-0" style={{ fontSize: '14px' ,color:"#fff" }}>{propertyType.count} {propertyType.count === 1 ? dynamicT('property', 'Property') : dynamicT('properties', 'Properties')}</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
      </section>
    </>
  );
};

export default PropertyTypes;


