import { create } from 'zustand';

const propertyTypes = [
  'CONDO', 'HOUSE', 'TOWNHOUSE', 'VILLA', 'LAND', 'APARTMENT',
  'COMMERCIAL', 'OFFICE', 'RETAIL', 'WAREHOUSE', 'FACTORY', 'HOTEL', 'RESORT'
];

// กำหนดช่วงราคาตาม listingType
const getPriceRangeByType = (type) => {
  if (type === 'rent' || type === 'RENT') {
    return {
      min: 5000,
      max: 100000,
      default: [10000, 30000]
    };
  } else {
    // sale หรือ default
    return {
      min: 500000,
      max: 20000000,
      default: [1000000, 5000000]
    };
  }
};

const usePropertyFilterStore = create((set, get) => ({
  propertyType: '',
  minPrice: 1000000,
  maxPrice: 5000000,
  zoneId: '',
  bedrooms: '',
  bathrooms: '',
  listingType: 'sale', // เพิ่ม listingType ใน store
  advancedSearchVisible: false,
  setPropertyType: (propertyType) => set({ propertyType }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setZoneId: (zoneId) => set({ zoneId }),
  setBedrooms: (bedrooms) => set({ bedrooms }),
  setBathrooms: (bathrooms) => set({ bathrooms }),
  setListingType: (listingType) => {
    const priceRange = getPriceRangeByType(listingType);
    set({ 
      listingType,
      minPrice: priceRange.default[0],
      maxPrice: priceRange.default[1]
    });
  },
  resetFilters: (listingType = 'sale') => {
    const priceRange = getPriceRangeByType(listingType);
    set({
      propertyType: '',
      minPrice: priceRange.default[0],
      maxPrice: priceRange.default[1],
      zoneId: '',
      bedrooms: '',
      bathrooms: '',
      listingType
    });
  },
  resetPriceByType: (listingType) => {
    const priceRange = getPriceRangeByType(listingType);
    set({
      minPrice: priceRange.default[0],
      maxPrice: priceRange.default[1]
    });
  },
  setAdvancedSearchVisible: (advancedSearchVisible) => set({ advancedSearchVisible }),
  propertyItems: [],
  setPropertyItems: (propertyItems) => set({ propertyItems }),
  paginationItems: {},
  setPaginationItems: (paginationItems) => set({ paginationItems }),
}));

export default usePropertyFilterStore;
