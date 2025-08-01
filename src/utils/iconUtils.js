/**
 * Utility functions for handling icon names in multiple languages
 */

/**
 * Get localized icon name based on current locale
 * @param {Object} icon - Icon object with name, name_th, name_ch, name_ru fields
 * @param {string} locale - Current locale (en, th, zh, ru)
 * @returns {string} Localized icon name
 */
export const getLocalizedIconName = (icon, locale) => {
  if (!icon) return '';
  
  // Map locale to corresponding field name
  const localeFieldMap = {
    'en': 'name',
    'th': 'name_th',
    'zh': 'name_ch',
    'ru': 'name_ru'
  };
  
  const fieldName = localeFieldMap[locale] || 'name';
  
  // Return localized name if available, fallback to English name
  return icon[fieldName] || icon.name || '';
};

/**
 * Get icon alt text for accessibility
 * @param {Object} icon - Icon object
 * @param {string} locale - Current locale
 * @returns {string} Alt text for icon
 */
export const getIconAltText = (icon, locale) => {
  const localizedName = getLocalizedIconName(icon, locale);
  return `${localizedName} icon`;
};
