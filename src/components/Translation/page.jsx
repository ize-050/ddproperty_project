"use client"

import useTranslationStore from '@/store/useTranslationStore';
import { useEffect } from 'react';

/**
 * TranslationInitializer component that initializes translations in the store
 * Can handle both single section translations and multiple sections
 * @param {Object|Array} translations - Either an array of translations for a single section
 *                                     or an object with section names as keys and arrays of translations as values
 * @param {string} locale - Current locale (e.g., 'en', 'th', 'zhCN', 'ru')
 * @param {string} section - Optional section name if translations is an array for a single section
 * @param {React.ReactNode} children - Child components
 */
const TranslationInitializer = ({ translations, locale, section, children }) => {
  useEffect(() => {

    if (translations) {
      Object.entries(translations).forEach(([sectionName, sectionTranslations]) => {
        useTranslationStore.getState().setTranslations(sectionName, sectionTranslations);
      });
    }
    
    useTranslationStore.getState().setLocale(locale);

    return () => {
      // We don't reset here as other pages might need these translations
      // useTranslationStore.getState().reset();
    };
  }, [translations, locale, section]);

  return <>{children}</>;
};

export { TranslationInitializer };
export default TranslationInitializer;