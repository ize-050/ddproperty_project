import { create } from 'zustand';

const propertyTypes = [
  'CONDO', 'HOUSE', 'TOWNHOUSE', 'VILLA', 'LAND', 'APARTMENT',
  'COMMERCIAL', 'OFFICE', 'RETAIL', 'WAREHOUSE', 'FACTORY', 'HOTEL', 'RESORT'
];

const usePropertyFilterStore = create((set) => ({
  propertyType: '',
  minPrice: 0,
  maxPrice: 15000000,
  zoneId: '',
  bedrooms: '',
  bathrooms: '',
  setPropertyType: (propertyType) => set({ propertyType }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setZoneId: (zoneId) => set({ zoneId }),
  setBedrooms: (bedrooms) => set({ bedrooms }),
  setBathrooms: (bathrooms) => set({ bathrooms }),
  resetFilters: () => set({
    propertyType: '',
    minPrice: 0,
    maxPrice: 15000000,
    zoneId: '',
    bedrooms: '',
    bathrooms: ''
  }),
  propertyItems: [],
  setPropertyItems: (propertyItems) => set({ propertyItems }),
  paginationItems: {},
  setPaginationItems: (paginationItems) => set({ paginationItems }),
}));

export default usePropertyFilterStore;
