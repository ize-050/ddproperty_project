import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import propertyTypeService from '@/services/propertyTypeService';
import styles from './PropertyTypes.module.css';

const PropertyTypes = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [randomProperties, setRandomProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useTranslations('home.propertyTypes');
  const commonT = useTranslations('common');
  const locale = useLocale();
  
  // We want to show only these 4 property types in this order
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
    <div className="row">
      {propertyTypes.map((propertyType) => (
        <div className={styles.propertyCard} key={propertyType.id}>
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
        </div>
      ))}
    </div>
  );
};

export default PropertyTypes;
