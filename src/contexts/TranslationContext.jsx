"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

// Global cache for all translation sections
const globalTranslationCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create Translation Context
const TranslationContext = createContext({});

// Translation Provider Component
export const TranslationProvider = ({ children }) => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const locale = useLocale();

  // Fetch translations for a specific section
  const fetchSection = async (section) => {
    const cacheKey = `global-translations-${section}`;
    const now = Date.now();
    
    // Check cache first
    const cached = globalTranslationCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      setTranslations(prev => ({
        ...prev,
        [section]: cached.data
      }));
      setLoading(prev => ({ ...prev, [section]: false }));
      return cached.data;
    }

    // Set loading state
    setLoading(prev => ({ ...prev, [section]: true }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ui-strings/public?section=${section}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'force-cache',
          next: { revalidate: 300 } // 5 minutes
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API response to key-value pairs
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
      globalTranslationCache.set(cacheKey, {
        data: translationMap,
        timestamp: now
      });

      // Update state
      setTranslations(prev => ({
        ...prev,
        [section]: translationMap
      }));
      setErrors(prev => ({ ...prev, [section]: null }));
      
      return translationMap;
    } catch (err) {
      console.error(`Error fetching translations for section ${section}:`, err);
      setErrors(prev => ({ ...prev, [section]: err.message }));
      setTranslations(prev => ({
        ...prev,
        [section]: {}
      }));
      return {};
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  // Translation function
  const t = (section, key, fallback = key) => {
    const sectionTranslations = translations[section];
    if (!sectionTranslations || !sectionTranslations[key]) {
      return fallback;
    }

    const translation = sectionTranslations[key];
    
    // Map locale to database column names
    const localeMap = {
      'en': 'en',
      'th': 'th', 
      'zh': 'zhCN',
      'ru': 'ru'
    };

    const dbLocale = localeMap[locale] || 'en';
    
    // Return translation with fallback chain
    return translation[dbLocale] || translation.en || fallback;
  };

  // Property type translation
  const getPropertyTypeText = (propertyType) => {
    if (!propertyType) return '';

    // Try to get from dynamic translations first
    const dynamicTranslation = t('listing', `property-type-${propertyType.toLowerCase()}`);
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

  // Listing type translation
  const getListingTypeText = (listingType) => {
    if (!listingType) return '';

    // Try to get from dynamic translations first
    const dynamicTranslation = t('listing', `listing-type-${listingType.toLowerCase()}`);
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

  const value = {
    translations,
    loading,
    errors,
    fetchSection,
    t,
    getPropertyTypeText,
    getListingTypeText
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use translation context
export const useGlobalTranslations = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useGlobalTranslations must be used within a TranslationProvider');
  }
  return context;
};

// Hook for specific section (backward compatibility)
export const useTranslationSection = (section) => {
  const { translations, loading, errors, fetchSection, t } = useGlobalTranslations();
  
  useEffect(() => {
    if (!translations[section] && !loading[section]) {
      fetchSection(section);
    }
  }, [section, translations, loading, fetchSection]);

  return {
    translations: translations[section] || {},
    loading: loading[section] || false,
    error: errors[section] || null,
    t: (key, fallback) => t(section, key, fallback)
  };
};

export default TranslationContext;
