'use client';

import React, { useEffect } from 'react';
import { useTranslationStore } from '@/store/useTranslationStore';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Component that initializes translations for multiple sections (home and contact)
 * This component should be used in pages that need both home and contact translations
 */
const MultiSectionTranslations = ({ translations, locale }) => {
  const { setTranslations, setLocale } = useTranslationStore();
  
  // Initialize translations in the store
  useEffect(() => {
    if (translations && locale) {
      // Set all translations at once
      setTranslations(translations);
      setLocale(locale);
      
      console.log('Initialized translations for multiple sections:', Object.keys(translations));
    }
    
    // Cleanup on unmount
    return () => {
      // No need to reset here as other pages might need these translations
    };
  }, [translations, locale, setTranslations, setLocale]);
  
  // This is a utility component that doesn't render anything visible
  return null;
};

export default MultiSectionTranslations;
