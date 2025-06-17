import { create } from 'zustand';

/**
 * Zustand store for managing translations across the application
 * Provides access to translations in any component without prop drilling
 */
const useTranslationStore = create((set) => ({
  // Store translations by section
  translations: {
    home: {},
    header: {},
    footer: {},
    listing: {},
    contact: {},
  },
  
  // Current locale
  locale: 'en',
  
  // Set translations for a specific section
  setTranslations: (section, data) => 
    set((state) => ({
      translations: {
        ...state.translations,
        [section]: data || {},
      },
    })),
    
  // Set current locale
  setLocale: (locale) => set({ locale }),
  
  // Get a translation string by key with fallback
  getString: (section, key, defaultValue = '') => {
    const state = useTranslationStore.getState();
    const sectionData = state.translations[section] || {};
    const string = sectionData[key];
    
    if (!string) return defaultValue;
    
    return string[state.locale] || string.en || defaultValue;
  },
  
  // Get a translation from API response format by slug
  getTranslation: (section, slug, defaultValue = '') => {
    const state = useTranslationStore.getState();
    const sectionData = state.translations[section] || [];
    
    // API response format is an array of objects with slug and locale fields
    const translationObj = Array.isArray(sectionData) 
      ? sectionData.find(item => item.slug === slug)
      : null;
    
    if (!translationObj) return defaultValue;
    
    // Return the translation for the current locale or fallback to English
    return translationObj[state.locale] || translationObj.en || defaultValue;
  },
  
  // Reset the store
  reset: () => set({ 
    translations: {
      home: {},
      header: {},
      footer: {},
      listing: {},
      contact: {},
    },
    locale: 'en'
  }),
}));

export default useTranslationStore;
