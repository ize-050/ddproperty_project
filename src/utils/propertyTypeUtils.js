// src/utils/propertyTypeUtils.js
import useDynamicTranslations from '@/hooks/useDynamicTranslations';

/**
 * Transform static property type data to use dynamic translations
 * @param {Array} staticData - Array of static property type objects
 * @param {Function} getPropertyTypeText - Dynamic translation function
 * @returns {Array} - Transformed data with dynamic translations
 */
export const transformPropertyTypesWithDynamicTranslations = (staticData, getPropertyTypeText) => {
  if (!Array.isArray(staticData)) return [];

  return staticData.map(item => ({
    ...item,
    title: getPropertyTypeText(item.title?.toUpperCase()) || item.title,
    // Keep original title as fallback
    originalTitle: item.title
  }));
};

/**
 * Get property type translation mapping for dropdowns
 * @param {Function} getPropertyTypeText - Dynamic translation function
 * @returns {Object} - Property type translation mapping
 */
export const getPropertyTypeMapping = (getPropertyTypeText) => {
  const propertyTypes = [
    'CONDO',
    'HOUSE', 
    'TOWNHOUSE',
    'LAND',
    'APARTMENT',
    'COMMERCIAL',
    'VILLA',
    'OFFICE',
    'BUNGALOW',
    'LOFT'
  ];

  const mapping = {};
  propertyTypes.forEach(type => {
    mapping[type] = getPropertyTypeText(type);
  });

  return mapping;
};

/**
 * Transform apartment type data for display
 * @param {Array} apartmentTypes - Static apartment type data
 * @param {Function} getPropertyTypeText - Dynamic translation function
 * @returns {Array} - Transformed apartment types with translations
 */
export const transformApartmentTypes = (apartmentTypes, getPropertyTypeText) => {
  const typeMapping = {
    'Houses': 'HOUSE',
    'Apartments': 'APARTMENT', 
    'Office': 'COMMERCIAL',
    'Villa': 'VILLA',
    'Townhome': 'TOWNHOUSE',
    'Bungalow': 'BUNGALOW',
    'Loft': 'LOFT'
  };

  return apartmentTypes.map(item => ({
    ...item,
    title: getPropertyTypeText(typeMapping[item.title] || item.title.toUpperCase()) || item.title,
    originalTitle: item.title
  }));
};

/**
 * Hook wrapper for property type utilities
 * @returns {Object} - Utility functions with dynamic translations
 */
export const usePropertyTypeUtils = () => {
  const { getPropertyTypeText, getListingTypeText, loading } = useDynamicTranslations('listing');

  return {
    getPropertyTypeText,
    getListingTypeText,
    loading,
    transformPropertyTypesWithDynamicTranslations: (data) => 
      transformPropertyTypesWithDynamicTranslations(data, getPropertyTypeText),
    getPropertyTypeMapping: () => getPropertyTypeMapping(getPropertyTypeText),
    transformApartmentTypes: (data) => transformApartmentTypes(data, getPropertyTypeText)
  };
};
