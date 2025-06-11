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
  const targetTypes = ['CONDO', 'HOUSE', 'VILLA', 'APARTMENT', 'TOWNHOUSE', 'LAND', 'HOME OFFICE'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const typesResponse = await propertyTypeService.getPropertyTypes();

        const randomResponse = await propertyTypeService.getRandomPropertiesByType();
        // Group random properties by type
        const propertiesByType = {};
        randomResponse.data.forEach(property => {
          if (!propertiesByType[property.propertyType]) {
            propertiesByType[property.propertyType] = property;
          }
        });

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
                <h2 className="title">{t('title')}</h2>
                <p className="paragraph">
                  {t('subtitle')}
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
                                 <Image
                                   width={279}
                                   height={332}
                                   className="w-100 h-100 cover"
                                   src={getPropertyImage(propertyType)}
                                   alt="homes"
                                 />
                               </div>
                               <div className="apartment-content">
                                 <h6 className="title mb-0">{getLocalizedName(propertyType)}</h6>
                                 <p className="text mb-0">{propertyType.count}</p>
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


