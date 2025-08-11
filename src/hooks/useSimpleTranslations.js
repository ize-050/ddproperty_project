"use client";
import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

// Shared cache with useDynamicTranslations
const simpleTranslationCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useSimpleTranslations = (section = 'aboutus') => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const locale = useLocale();
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchTranslations = async () => {
      const cacheKey = `simple-translations-${section}`;
      const now = Date.now();
      
      // Check cache first
      const cached = simpleTranslationCache.get(cacheKey);
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
        simpleTranslationCache.set(cacheKey, {
          data: translationMap,
          timestamp: now
        });

        setTranslations(translationMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching translations:', err);
        setError(err.message);
        setTranslations({});
      } finally {
        setLoading(false);
        fetchedRef.current = false;
      }
    };

    fetchTranslations();
  }, [section]);

  const t = (key, fallback = key) => {
    if (!translations[key]) {
      return fallback;
    }

    const translation = translations[key];
    const localeMap = {
      'en': 'en',
      'th': 'th', 
      'zh': 'zhCN',
      'ru': 'ru'
    };

    const dbLocale = localeMap[locale] || 'en';
    return translation[dbLocale] || translation.en || fallback;
  };

  return { translations, loading, error, t };
};

export default useSimpleTranslations;
