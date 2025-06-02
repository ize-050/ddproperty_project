import { create } from 'zustand';

const usePropertyFormStore = create((set) => ({

  floorPlanImages: [],
  
  // Unit Plan Images
  unitPlanImages: [],
  formData: {
    propertyType: '',
    projectName: '',
    referenceId: '',
    propertyTitle: '',
    description: '',
    paymentPlan: '',
    // Translations
    translatedTitles: {
      th: '',
      zh: '',
      ru: ''
    },
    translatedDescriptions: {
      th: '',
      zh: '',
      ru: ''
    },
    translatedPaymentPlans: {
      th: '',
      zh: '',
      ru: ''
    },
    // Social Media URLs
    socialMedia: {
      youtubeUrl: '',
      tiktokUrl: ''
    },
    address: '',
    province: '',
    district: '',
    subdistrict: '',
    postalCode: '',
    latitude: 13.7563,
    longitude: 100.5018,
    bedrooms: '',
    bathrooms: '',
    area: '',
    price: '',
    priceUnit: 'THB',
    rentalPrice: '',
    shortTerm3Months: '',
    shortTerm6Months: '',
    shortTerm1Year: '',
    status: '', // SALE, RENT, SALE_RENT
    // Property Detail fields
    propertyId: '',
    ownershipQuota: '',
    landSize: '',
    landSizeUnit: 'rai',
    usableArea: '',
    floors: '',
    furnishing: '',
    constructionYear: '',
    communityFees: '',
    // Promotional price
    promotionalPrice: '',
    // Features/Amenities
    features: {
      airConditioner: false,
      bbq: false,
      dryerMachine: false,
      hairDryer: false,
      karaokeBox: false,
      kitchenware: false,
      microWave: false,
      oven: false,
      privateLift: false,
      refrigerator: false,
      tv: false,
      wardrobe: false,
      washingMachine: false,
      waterHeater: false,
      wifi: false,
      
      // Other features
      balcony: false,
      garden: false,
      parking: false,
      pool: false,
      security: false,
      fitness: false,
      petFriendly: false
    },
    // Property Highlights
    highlights: {
      // Room Types
      duplex: false,
      penthouse: false,
      oneBedPlus: false,
      duplexPenthouse: false,
      // Highlights
      brandNew: false,
      petsAllowed: false,
      companyRegistration: false,
      rentToOwn: false,
      npaAssets: false,
      foreignerQuota: false,
      saleDown: false,
      // Property Labels
      newDevelopment: false,
      newListing: false,
      reducePrice: false,
      resale: false,
      underConstruction: false,
      hotOffer: false,
      rented: false,
      sold: false,
    },
    
    // Contact Information
    contactInfo: {
      phone: '',
      secondaryPhone: '',
      email: '',
      lineId: '',
      wechatId: '',
      whatsapp: '',
      facebookMessenger: '',
      instagram: ''
    },
    nearby: {
      nearPark: false,
      nearMall: false,
      nearTrainStation: false,
      nearTransportation: false,
      nearHospital: false,
      nearAirport: false,
      nearBeach: false,
      nearMarket: false,
      nearSchool: false,
    },
    // Views
    views: {
      seaView: false,
      cityView: false,
      gardenView: false,
      lakeView: false,
      mountainView: false,
      poolView: false,
    },
    // Facilities
    facilities: {
      fitnessAndSports: {
        basketballCourt: false,
        fitness: false,
        golfSimulator: false,
        joggingTrack: false,
        squashCourt: false,
        tennisCourt: false,
        yogaRoom: false,
      },
      commonAreas: {
        greenArea: false,
        library: false,
        lobby: false,
        meetingRoom: false,
        skyGarden: false,
        workingSpace: false,
      },
      poolsAndRelaxation: {
        kidsPool: false,
        onsen: false,
        sauna: false,
        skyPool: false,
        spa: false,
        salon: false,
        swimmingPool: false,
      },
      diningAndEntertainment: {
        bar: false,
        clubhouse: false,
        gameroom: false,
        karaokeRoom: false,
        miniTheater: false,
        poolTable: false,
        restaurant: false,
        skyBar: false,
      },
      other: {
        security24hr: false,
        cctv: false,
        conciergeServices: false,
        evCharger: false,
        highSpeedLift: false,
        kidsClub: false,
      },
    }
  },
  propertyImages: [],
  showMap: true,

  // Actions
  setFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
  
  setFeature: (name, value) => set((state) => ({
    formData: {
      ...state.formData,
      features: {
        ...state.formData.features,
        [name]: value
      }
    }
  })),
  
  setHighlight: (name, value) => set((state) => ({
    formData: {
      ...state.formData,
      highlights: {
        ...state.formData.highlights,
        [name]: value
      }
    }
  })),
  
  setNearby: (name, value) => set((state) => ({
    formData: {
      ...state.formData,
      nearby: {
        ...state.formData.nearby,
        [name]: value
      }
    }
  })),
  
  setView: (name, value) => set((state) => ({
    formData: {
      ...state.formData,
      views: {
        ...state.formData.views,
        [name]: value
      }
    }
  })),
  
  setFacility: (category, name, value) => set((state) => ({
    formData: {
      ...state.formData,
      facilities: {
        ...state.formData.facilities,
        [category]: {
          ...state.formData.facilities[category],
          [name]: value
        }
      }
    }
  })),
  
  setPropertyType: (type) => set((state) => ({
    formData: {
      ...state.formData,
      propertyType: type
    }
  })),
  
  setStatus: (status) => set((state) => ({
    formData: { ...state.formData, status }
  })),
  
  setDescription: (field, value) => set((state) => ({
    formData: { ...state.formData, [field]: value } 
  })),
  
  setTranslatedDescriptions: (type, lang, value) => set((state) => {
    if (type === 'titles') {
      return {
        formData: {
          ...state.formData,
          translatedTitles: {
            ...state.formData.translatedTitles,
            [lang]: value
          }
        }
      };
    } else if (type === 'paymentPlans') {
      return {
        formData: {
          ...state.formData,
          translatedPaymentPlans: {
            ...state.formData.translatedPaymentPlans,
            [lang]: value
          }
        }
      };
    } else {
      return {
        formData: {
          ...state.formData,
          translatedDescriptions: {
            ...state.formData.translatedDescriptions,
            [lang]: value
          }
        }
      };
    }
  }),
  
  toggleMap: () => set((state) => ({ showMap: !state.showMap })),
  
  addPropertyImages: (newImages) => set((state) => ({
    propertyImages: [...state.propertyImages, ...newImages]
  })),
  
  removePropertyImage: (id) => set((state) => ({
    propertyImages: state.propertyImages.filter(image => image.id !== id)
  })),
  
  reorderPropertyImages: (sourceIndex, destinationIndex) => set((state) => {
    const result = Array.from(state.propertyImages);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    
    return {
      propertyImages: result
    };
  }),
  
  // Floor Plan Images Functions
  addFloorPlanImages: (newImages) => set((state) => ({
    floorPlanImages: [...state.floorPlanImages, ...newImages]
  })),
  
  removeFloorPlanImage: (id) => set((state) => ({
    floorPlanImages: state.floorPlanImages.filter(image => image.id !== id)
  })),
  
  reorderFloorPlanImages: (sourceIndex, destinationIndex) => set((state) => {
    const result = Array.from(state.floorPlanImages);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    
    return {
      floorPlanImages: result
    };
  }),
  
  // Unit Plan Images Functions
  addUnitPlanImages: (newImages) => set((state) => ({
    unitPlanImages: [...state.unitPlanImages, ...newImages]
  })),
  
  removeUnitPlanImage: (id) => set((state) => ({
    unitPlanImages: state.unitPlanImages.filter(image => image.id !== id)
  })),
  
  reorderUnitPlanImages: (sourceIndex, destinationIndex) => set((state) => {
    const result = Array.from(state.unitPlanImages);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    
    return {
      unitPlanImages: result
    };
  }),
  
  resetForm: () => set({
    propertyImages: [],
    floorPlanImages: [],
    unitPlanImages: [],
    formData: {
      propertyType: [],
      projectName: '',
      referenceId: '',
      propertyTitle: '',
      description: '',
      address: '',
      province: '',
      district: '',
      subdistrict: '',
      postalCode: '',
      latitude: 13.7563,
      longitude: 100.5018,
      bedrooms: '',
      bathrooms: '',
      area: '',
      price: '',
      priceUnit: 'THB',
      rentalPrice: '',
      shortTerm3Months: '',
      shortTerm6Months: '',
      shortTerm1Year: '',
      status: 'SALE',
      features: {
        airConditioning: false,
        balcony: false,
        garden: false,
        parking: false,
        pool: false,
        security: false,
        fitness: false,
        petFriendly: false,
      },
      nearby: {
        nearPark: false,
        nearMall: false,
        nearTrainStation: false,
        nearTransportation: false,
        nearHospital: false,
        nearAirport: false,
        nearBeach: false,
        nearMarket: false,
        nearSchool: false,
      },
      views: {
        seaView: false,
        cityView: false,
        gardenView: false,
        lakeView: false,
        mountainView: false,
        poolView: false,
      },
      
    },

    propertyImages: [],
    showMap: true,
  })
}));

export default usePropertyFormStore;
