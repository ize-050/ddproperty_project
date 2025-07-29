"use client";
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

const useSimpleTranslations = (section = 'aboutus') => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ui-strings/public?section=${section}`
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

        setTranslations(translationMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching translations:', err);
        setError(err.message);
        setTranslations({});
      } finally {
        setLoading(false);
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
