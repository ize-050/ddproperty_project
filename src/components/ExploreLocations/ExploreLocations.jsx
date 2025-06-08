'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import zoneService from '@/services/zoneService';
import styles from './ExploreLocations.module.css';
import { useTranslations,useLocale } from 'next-intl';

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
        const response = await zoneService.getExploreLocations(3);
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
    <section className={styles.container}>
      <div className={styles.locationsGrid}>
        {locations.map((location) => (
          <Link 
            href={`/properties/list?zoneId=${location.id}`} 
            key={location.id} 
            className={styles.locationCard}
          >
            <div className={styles.imageContainer}>
              {location.imagePath ? (

                <Image
                  src={location.imagePath}
                  alt={location.name_th}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.image}
                  priority
                />
              ) : (
                <div className={styles.noImage}></div>
              )}
            </div>
            <div className={styles.locationInfo}>
              <h3 className={styles.locationName}>{location[`name_${locale}`]}</h3>
              <p className={styles.propertyCount}>
                {location.propertyCount}  {t('ExploreLocations.properties')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ExploreLocations;
