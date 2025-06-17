'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import zoneService from '@/services/zoneService';
import styles from './ExploreLocations.module.css';
import { useTranslations,useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

const ExploreLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useTranslations('home');
  const locale = useLocale();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await zoneService.getExploreLocations();
        setLocations(response.data || []);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError(t('errorFetching'));
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [t]);

  if (loading) {
    return (
      <section className={styles.container}>
        <h2 className={styles.title}>{t('title')}</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.loading}></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.container}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.error}>{error}</p>
      </section>
    );
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".cities_next__active",
          prevEl: ".cities_prev__active",
        }}
        pagination={{
          el: ".cities_pagination__active",
          clickable: true,
        }}
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
        autoplay={{
          delay: 3000, // Set the desired delay for autoplay
          disableOnInteraction: false, // Keep autoplaying even when user interacts with the swiper
        }}
      >
        {locations.map((location) => (
          <SwiperSlide key={location.id}>
            <div className="item">
              <Link href="/map-v4">
                <div className="feature-style2 mb30">
                  <div className="feature-img">
                    <Image
                      width={279}
                      height={279}
                      className="w-100 h-100 cover"
                      src={location.imagePath}
                      alt="city listings"
                    />
                  </div>
                  <div className="feature-content pt20">
                    <h6 className="title mb-1">{location[`name_${locale}`]}</h6>
                    <p className="text fz15">{location.propertyCount} Properties</p>
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

export default ExploreLocations;
