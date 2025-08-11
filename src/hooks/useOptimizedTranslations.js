"use client";
import { useTranslationSection, useGlobalTranslations } from '@/contexts/TranslationContext';

/**
 * Optimized hook for dynamic translations using global context
 * This replaces useDynamicTranslations to prevent duplicate API calls
 * @param {string} section - Translation section (listing, home, footer, etc.)
 * @returns {Object} - Translation utilities
 */
const useOptimizedTranslations = (section = 'listing') => {
  const { getPropertyTypeText, getListingTypeText } = useGlobalTranslations();
  const { translations, loading, error, t } = useTranslationSection(section);

  return {
    translations,
    loading,
    error,
    t,
    getPropertyTypeText,
    getListingTypeText
  };
};

export default useOptimizedTranslations;
