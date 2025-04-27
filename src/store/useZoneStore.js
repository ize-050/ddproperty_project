import { create } from 'zustand';

const useZoneStore = create((set) => ({
  // State
  zones: [],
  selectedZone: null,
  isLoading: false,
  error: null,
  
  // Actions
  setZones: (zones) => set({ zones }),
  
  selectZone: (zoneId) => set((state) => ({
    selectedZone: state.zones.find(zone => zone.id === zoneId) || null
  })),
  
  clearSelectedZone: () => set({ selectedZone: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  // Helper functions for filtering zones
  getZonesByCity: (city) => {
    const { zones } = useZoneStore.getState();
    return zones.filter(zone => zone.city === city);
  },
  
  getZoneById: (id) => {
    const { zones } = useZoneStore.getState();
    return zones.find(zone => zone.id === id) || null;
  },
  
  getCities: () => {
    const { zones } = useZoneStore.getState();
    // Get unique cities from zones
    const cities = [...new Set(zones.map(zone => zone.city))];
    return cities;
  },
  
  // Group zones by city
  getZonesByGroupedCity: () => {
    const { zones } = useZoneStore.getState();
    
    // Group zones by city
    const groupedZones = zones.reduce((acc, zone) => {
      if (!acc[zone.city]) {
        acc[zone.city] = {
          city: zone.city,
          province: zone.province,
          zones: []
        };
      }
      
      acc[zone.city].zones.push(zone);
      return acc;
    }, {});
    
    return Object.values(groupedZones);
  }
}));

export default useZoneStore;
