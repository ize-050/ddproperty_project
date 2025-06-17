import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useTranslationStore from '@/store/useTranslationStore';


export default function useTranslation(section = 'home') {
  const params = useParams();
  let locale = params?.locale || 'th';
  
  // Get state from the store
  const { translations, setLocale } = useTranslationStore();
  
  // Update locale in the store when it changes
  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);
  
  /**
   * Get a translation string by key with fallback
   * @param {string} key - The translation key
   * @param {string} defaultValue - Default value if translation is not found
   * @returns {string} - The translated string
   */
  const getString = (key, defaultValue = '') => {
    console.log("translations",translations)
    const string = translations[key] || {};
    if (!string) return defaultValue;
    if(locale=="zh"){
      locale ="zhCN"
    }
    return string[locale] || string.th || defaultValue;
  };
  
  return {
    getString,
    locale
  };
}
