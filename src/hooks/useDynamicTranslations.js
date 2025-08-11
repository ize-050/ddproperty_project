// src/hooks/useDynamicTranslations.js
"use client";
import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

// In-memory cache to prevent duplicate API calls
const translationCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook for dynamic translations from database
 * Fetches translation data from backend API and provides fallback mechanism
 */
const useDynamicTranslations = (section = 'listing') => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const locale = useLocale();
  const fetchedRef = useRef(false);

  // Fetch translations from backend API with caching
  useEffect(() => {
    const fetchTranslations = async () => {
      const cacheKey = `translations-${section}`;
      const now = Date.now();
      
      // Check cache first
      const cached = translationCache.get(cacheKey);
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        setTranslations(cached.data);
        setLoading(false);
        setError(null);
        return;
      }

      // Prevent duplicate API calls
      if (fetchedRef.current) {
        return;
      }
      fetchedRef.current = true;

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ui-strings/public?section=${section}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            // Add cache headers
            cache: 'force-cache',
            next: { revalidate: 300 } // 5 minutes
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform API response to key-value pairs for easy lookup
        const translationMap = {};
        if (data.data && Array.isArray(data.data)) {
          data.data.forEach(item => {
            translationMap[item.slug] = {
              en: item.en,
              th: item.th,
              zhCN: item.zhCN,
              ru: item.ru
            };
          });
        }

        // Cache the result
        translationCache.set(cacheKey, {
          data: translationMap,
          timestamp: now
        });

        setTranslations(translationMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching dynamic translations:', err);
        setError(err.message);
        // Keep empty translations object for fallback
        setTranslations({});
      } finally {
        setLoading(false);
        fetchedRef.current = false;
      }
    };

    fetchTranslations();
  }, [section]); // Remove locale from dependencies as it doesn't affect API call

  /**
   * Get translated text for a given key with fallback mechanism
   * @param {string} key - Translation key (slug)
   * @param {string} fallback - Fallback text if translation not found
   * @returns {string} - Translated text
   */
  const t = (key, fallback = key) => {
    if (!translations[key]) {
      return fallback;
    }

    const translation = translations[key];
    
    // Map locale to database column names
    const localeMap = {
      'en': 'en',
      'th': 'th', 
      'zh': 'zhCN',
      'ru': 'ru'
    };

    const dbLocale = localeMap[locale] || 'en';
    
    // Return translation with fallback chain: current locale → English → fallback
    return translation[dbLocale] || translation.en || fallback;
  };

  /**
   * Get property type translation with fallback to hardcoded values
   * @param {string} propertyType - Property type enum (CONDO, HOUSE, etc.)
   * @returns {string} - Translated property type
   */
  const getPropertyTypeText = (propertyType) => {
    if (!propertyType) return '';

    // Try to get from dynamic translations first
    const dynamicTranslation = t(`property-type-${propertyType.toLowerCase()}`);
    if (dynamicTranslation !== `property-type-${propertyType.toLowerCase()}`) {
      return dynamicTranslation;
    }

    // Fallback to hardcoded translations
    const hardcodedTypes = {
      CONDO: {
        th: 'คอนโดมิเนียม',
        en: 'Condominium',
        zh: '公寓',
        ru: 'Кондоминиум'
      },
      HOUSE: {
        th: 'บ้านเดี่ยว',
        en: 'House',
        zh: '独立屋',
        ru: 'Дом'
      },
      TOWNHOUSE: {
        th: 'ทาวน์เฮาส์',
        en: 'Townhouse',
        zh: '联排别墅',
        ru: 'Таунхаус'
      },
      LAND: {
        th: 'ที่ดิน',
        en: 'Land',
        zh: '土地',
        ru: 'Земля'
      },
      APARTMENT: {
        th: 'อพาร์ทเมนท์',
        en: 'Apartment',
        zh: '公寓',
        ru: 'Апартаменты'
      },
      COMMERCIAL: {
        th: 'อาคารพาณิชย์',
        en: 'Commercial Building',
        zh: '商业建筑',
        ru: 'Коммерческое здание'
      }
    };

    const localeMap = {
      'zh': 'zh'
    };
    const mappedLocale = localeMap[locale] || locale;

    return hardcodedTypes[propertyType]?.[mappedLocale] || 
           hardcodedTypes[propertyType]?.en || 
           propertyType;
  };

  /**
   * Get listing type translation with fallback to hardcoded values
   * @param {string} listingType - Listing type enum (SALE, RENT)
   * @returns {string} - Translated listing type
   */
  const getListingTypeText = (listingType) => {
    if (!listingType) return '';

    // Try to get from dynamic translations first
    const dynamicTranslation = t(`listing-type-${listingType.toLowerCase()}`);
    if (dynamicTranslation !== `listing-type-${listingType.toLowerCase()}`) {
      return dynamicTranslation;
    }

    // Fallback to hardcoded translations
    const hardcodedTypes = {
      SALE: {
        th: 'ขาย',
        en: 'For Sale',
        zh: '出售',
        ru: 'Продажа'
      },
      RENT: {
        th: 'เช่า',
        en: 'For Rent',
        zh: '出租',
        ru: 'Аренда'
      }
    };

    const localeMap = {
      'zh': 'zh'
    };
    const mappedLocale = localeMap[locale] || locale;

    return hardcodedTypes[listingType]?.[mappedLocale] || 
           hardcodedTypes[listingType]?.en || 
           listingType;
  };

  return {
    translations,
    loading,
    error,
    t,
    getPropertyTypeText,
    getListingTypeText
  };
};

export default useDynamicTranslations;
