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
    },
    amenities: {}, // Added amenities object
    // Property Highlights
    highlights: {
    },
    // Property Labels
    propertyLabels: {
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
    },
    // Views
    views: {
    },
    // Facilities - updated structure to match API response format
    facilities: {
      'common-area': {},
      'dining': {},
      'fitness': {},
      'pool': {},
      'other': {}
    }
  },
  propertyImages: [],
  showMap: true,

  // Actions
  setFormData: (newData) => set((state) => ({
    formData: { ...state.formData, ...newData }
  })),
  setShowMap: (newData) => set((state) => ({
    showMap: newData
  })),
  // ฟังก์ชันอัปเดตสถานะของ amenity icons
  setFeature: (type, key, value) => {

    // Type should be 'amenity'
    if (type === 'amenity') {
      set(state => {

        const updatedAmenities = {
          ...state.formData.amenities,
          [key]: {
            iconId: state.formData.amenities[key]?.iconId || null, // Preserve existing iconId if available
            active: value,
          }
        };

        return { formData: { ...state.formData, amenities: updatedAmenities } };
      });
    }
  },

  setFacility: (category, key, value) => set((state) => {
    // ดึง iconId จากข้อมูลเดิม
    
    return {
      formData: {
        ...state.formData,
        facilities: {
          ...state.formData.facilities,
          [category]: {
            ...state.formData.facilities[category],
            [key]: {
              iconId: state.formData.facilities[category][key]?.iconId || null, // Preserve existing iconId if available
              active: value,
            }
          }
        }
      }
    };
  }),

  setHighlight: (key, value) => set((state) => {
    // ดึง iconId จากข้อมูลเดิม

    
    return {
      formData: {
        ...state.formData,
        highlights: {
          ...state.formData.highlights,
          [key]: {
            active: value,
            iconId: state.formData.highlights[key]?.iconId || null // Preserve existing iconId if available
          }
        }
      }
    };
  }),

  setNearby: (key, value) => set((state) => {

    return {
      formData: {
        ...state.formData,
        nearby: {
          ...state.formData.nearby,
          [key]: {
            iconId: state.formData.nearby[key]?.iconId || null,
            active: value,
          }
        }
      }
    };
  }),

  setView: (key, value) => set((state) => {

    return {
      formData: {
        ...state.formData,
        views: {
          ...state.formData.views,
          [key]: {
            iconId: state.formData.views[key]?.iconId || null,
            active: value,
          }
        }
      }
    };
  }),

  setPropertyLabel: (key, value) => set((state) => {

    return {
      formData: {
        ...state.formData,
        propertyLabels: {
          ...state.formData.propertyLabels,
          [key]: {
            iconId: state.formData.propertyLabels[key]?.iconId || null,
            active: value,
          }
        }
      }
    };
  }),

  initializeFacilities: (facilityIcons) => {
    set(state => {
      const currentFacilities = state.formData.facilities || {};
      const updatedFacilities = {...currentFacilities}

      // Handle different structures - object of arrays or a single array
      if (facilityIcons && typeof facilityIcons === 'object') {
        // Loop through each category and their items
        Object.keys(facilityIcons).forEach(category => {
          const categoryFacilities = {};

          if (Array.isArray(facilityIcons[category])) {
            // Process all icons in this category
            facilityIcons[category].forEach(icon => {
              if (icon.key) {
                if (!updatedFacilities[category]) {
                  categoryFacilities[icon.key] = {
                    active: false,
                    iconId: icon.id
                  };
                } else {
                    categoryFacilities[icon.key] = {
                        ...updatedFacilities[category][icon.key],
                        iconId: icon.id
                    };
                }
              }
            });
          }

          // Only add the category if it has items
          if (Object.keys(categoryFacilities).length > 0) {
            updatedFacilities[category] = categoryFacilities;
          }
        });
      }
      return {
        formData: {
          ...state.formData,
          facilities: {...updatedFacilities}
        }
      };

    });


  },

  // Initialize highlights icons after fetching from API
  initializeHighlights: (highlightIcons) => {
    // Get current state first to preserve existing values
    set(state => {
      const currentHighlights = state.formData.highlights || {};
      const updatedHighlights = {...currentHighlights}; // Clone to avoid direct mutation
      
      console.log('Current highlights before init:', currentHighlights);

      // Handle different structures - object of arrays or a single array
      if (highlightIcons && typeof highlightIcons === 'object') {
        // Loop through each category and their items
        Object.keys(highlightIcons).forEach(category => {
          if (Array.isArray(highlightIcons[category])) {
            // Process all icons in this category
            highlightIcons[category].forEach(icon => {
              if (icon.key) {
                if (!updatedHighlights[icon.key]) {
                  updatedHighlights[icon.key] = {
                    active: false,
                    iconId: icon.id
                  };
                } else {
                  // Keep the active state but update the iconId
                  updatedHighlights[icon.key] = {
                    ...updatedHighlights[icon.key],
                    iconId: icon.id
                  };
                }
              }
            });
          }
        });
      }
      
      return {
        formData: {
          ...state.formData,
          highlights: updatedHighlights
        }
      };
    });
  },

  // Initialize nearby icons after fetching from API
  initializeNearby: (nearbyIcons) => {
    // Get current state first to preserve existing values
    set(state => {
      const currentNearby = state.formData.nearby || {};
      const updatedNearby = {...currentNearby}; // Clone to avoid direct mutation

      // Handle different structures - object of arrays or a single array
      if (nearbyIcons && typeof nearbyIcons === 'object') {
        // Loop through each category and their items
        Object.keys(nearbyIcons).forEach(category => {
          if (Array.isArray(nearbyIcons[category])) {
            // Process all icons in this category
            nearbyIcons[category].forEach(icon => {
              if (icon.key) {
                // Preserve existing active state if it exists, otherwise initialize as false
                if (!updatedNearby[icon.key]) {
                  updatedNearby[icon.key] = {
                    active: false,
                    iconId: icon.id
                  };
                } else {
                  // Keep the active state but update the iconId
                  updatedNearby[icon.key] = {
                    ...updatedNearby[icon.key],
                    iconId: icon.id
                  };
                }
              }
            });
          }
        });
      }
      
      return {
        formData: {
          ...state.formData,
          nearby: updatedNearby
        }
      };
    });
  },

  // Initialize views icons after fetching from API
  initializeViews: (viewIcons) => {
    // Get current state first to preserve existing values
    set(state => {
      const currentViews = state.formData.views || {};
      const updatedViews = {...currentViews}; // Clone to avoid direct mutation

      // Handle different structures - object of arrays or a single array
      if (viewIcons && typeof viewIcons === 'object') {
        // Loop through each category and their items
        Object.keys(viewIcons).forEach(category => {
          if (Array.isArray(viewIcons[category])) {
            // Process all icons in this category
            viewIcons[category].forEach(icon => {
              if (icon.key) {
                // Preserve existing active state if it exists, otherwise initialize as false
                if (!updatedViews[icon.key]) {
                  updatedViews[icon.key] = {
                    active: false,
                    iconId: icon.id
                  };
                } else {
                  // Keep the active state but update the iconId
                  updatedViews[icon.key] = {
                    ...updatedViews[icon.key],
                    iconId: icon.id
                  };
                }
              }
            });
          }
        });
      }
      
      return {
        formData: {
          ...state.formData,
          views: updatedViews
        }
      };
    });
  },
  setSocialMedia: (name,socialMedia) => {
    set(state => ({
      formData: {
        ...state.formData,
        socialMedia: {
          ...state.formData.socialMedia,
          [name]: socialMedia
        }
      }
    }));
  },
  // Initialize property labels after fetching from API
  initializePropertyLabels: (labelIcons) => {
    // Get current state first to preserve existing values
    set(state => {
      const currentLabels = state.formData.propertyLabels || {};
      const updatedLabels = {...currentLabels}; // Clone to avoid direct mutation

      // Handle different structures - object of arrays or a single array
      if (labelIcons && typeof labelIcons === 'object') {
        // Loop through each category and their items
        Object.keys(labelIcons).forEach(category => {
          if (Array.isArray(labelIcons[category])) {
            // Process all icons in this category
            labelIcons[category].forEach(icon => {
              if (icon.key) {
                // Preserve existing active state if it exists, otherwise initialize as false
                if (!updatedLabels[icon.key]) {
                  updatedLabels[icon.key] = {
                    active: false,
                    iconId: icon.id
                  };
                } else {
                  // Keep the active state but update the iconId
                  updatedLabels[icon.key] = {
                    ...updatedLabels[icon.key],
                    iconId: icon.id
                  };
                }
              }
            });
          }
        });
      }
      
      return {
        formData: {
          ...state.formData,
          propertyLabels: updatedLabels
        }
      };
    });
  },

  initializeAmenities: (amenityIcons) => {
    // Get current state first to preserve existing values
    set(state => {
      const currentAmenities = state.formData.amenities || {};
      const updatedAmenities = {...currentAmenities}; // Clone to avoid direct mutation

      // Handle different structures - object of arrays or a single array
      if (amenityIcons && typeof amenityIcons === 'object') {
        // Loop through each category and their items
        Object.keys(amenityIcons).forEach(category => {
          if (Array.isArray(amenityIcons[category])) {
            // Process all icons in this category
            amenityIcons[category].forEach(icon => {
              if (icon.key) {
                // Preserve existing active state if it exists, otherwise initialize as false
                if (!updatedAmenities[icon.key]) {
                  updatedAmenities[icon.key] = {
                    active: false,
                    iconId: icon.id
                  };
                } else {
                  // Keep the active state but update the iconId
                  updatedAmenities[icon.key] = {
                    ...updatedAmenities[icon.key],
                    iconId: icon.id
                  };
                }
              }
            });
          }
        });
      }

      console.log('Updated amenities after init:', updatedAmenities);
      
      return {
        formData: {
          ...state.formData,
          amenities: updatedAmenities
        }
      };
    });
  },

  // Initialize feature icons after fetching from API
  initializeFeatures: (featureIcons) => {
    console.log('Initializing features from:', featureIcons);
    const updatedFeatures = {};

    // Handle different structures - object of arrays or a single array
    if (featureIcons && typeof featureIcons === 'object') {
      // Loop through each category and their items
      Object.keys(featureIcons).forEach(category => {
        if (Array.isArray(featureIcons[category])) {
          // Process all icons in this category
          featureIcons[category].forEach(icon => {
            if (icon.key) {
              // Initialize with false state and store iconId for each icon
              updatedFeatures[icon.key] = {
                active: false,
                iconId: icon.id
              };
            }
          });
        }
      });
    }

    set(state => ({
      formData: {
        ...state.formData,
        features: { ...updatedFeatures }
      }
    }));

  },

  setPropertyType: (type) => set((state) => ({
    formData: {
      ...state.formData,
      propertyType: type,
    }
  })),

  setStatus: (status) => set(state => ({
    formData :{
      ...state.formData,
      status: status
    }
  })),

  setDescription: (field, value) => set((state) => ({
    formData: { ...state.formData, [field]: value }
  })),

  setTranslatedDescriptions: (type, lang, value) => set((state) => {
    // Handle different types of translated fields (titles, descriptions, payment plans)
    switch (type) {
      case 'title':
      case 'titles':
        return {
          formData: {
            ...state.formData,
            translatedTitles: {
              ...state.formData.translatedTitles,
              [lang]: value
            }
          }
        };
      case 'description':
      case 'descriptions':
        return {
          formData: {
            ...state.formData,
            translatedDescriptions: {
              ...state.formData.translatedDescriptions,
              [lang]: value
            }
          }
        };
      case 'paymentPlan':
      case 'paymentPlans':
        return {
          formData: {
            ...state.formData,
            translatedPaymentPlans: {
              ...state.formData.translatedPaymentPlans,
              [lang]: value
            }
          }
        };
      default:
        return state;
    }
  }),

  toggleMap: () => set((state) => ({ showMap: !state.showMap })),

  addPropertyImages: (newImages) => set((state) => ({
    propertyImages: [...state.propertyImages, ...newImages]
  })),

  removePropertyImage: (id) => set((state) => ({
    propertyImages: state.propertyImages.filter(img => img.id !== id)
  })),

  reorderPropertyImages: (sourceIndex, destinationIndex) => set((state) => {
    const newImages = [...state.propertyImages];
    const [removed] = newImages.splice(sourceIndex, 1);
    newImages.splice(destinationIndex, 0, removed);
    
    // อัปเดต sortOrder ตามลำดับใหม่
    const updatedImages = newImages.map((image, index) => ({
      ...image,
      sortOrder: index
    }));
    
    return {
      propertyImages: updatedImages
    };
  }),

  // Floor Plan Images Functions
  addFloorPlanImages: (newImages) => set((state) => ({
    floorPlanImages: [...state.floorPlanImages, ...newImages]
  })),

  removeFloorPlanImage: (id) => set((state) => ({
    floorPlanImages: state.floorPlanImages.filter(img => img.id !== id)
  })),

  reorderFloorPlanImages: (sourceIndex, destinationIndex) => set((state) => {
    const newImages = [...state.floorPlanImages];
    const [removed] = newImages.splice(sourceIndex, 1);
    newImages.splice(destinationIndex, 0, removed);
    
    // อัปเดต sortOrder ตามลำดับใหม่
    const updatedImages = newImages.map((image, index) => ({
      ...image,
      sortOrder: index
    }));
    
    return {
      floorPlanImages: updatedImages
    };
  }),

  // Unit Plan Images Functions
  addUnitPlanImages: (newImages) => set((state) => ({
    unitPlanImages: [...state.unitPlanImages, ...newImages]
  })),

  removeUnitPlanImage: (id) => set((state) => ({
    unitPlanImages: state.unitPlanImages.filter(img => img.id !== id)
  })),

  reorderUnitPlanImages: (sourceIndex, destinationIndex) => set((state) => {
    const newImages = [...state.unitPlanImages];
    const [removed] = newImages.splice(sourceIndex, 1);
    newImages.splice(destinationIndex, 0, removed);
    
    // อัปเดต sortOrder ตามลำดับใหม่
    const updatedImages = newImages.map((image, index) => ({
      ...image,
      sortOrder: index
    }));
    
    return {
      unitPlanImages: updatedImages
    };
  }),

  resetForm: () => set({
    formData: {
      propertyType: '',
      projectName: '',
      referenceId: '',
      propertyTitle: '',
      description: '',
      paymentPlan: '',
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
      status: '',
      propertyId: '',
      ownershipQuota: '',
      landSize: '',
      landSizeUnit: 'rai',
      usableArea: '',
      floors: '',
      furnishing: '',
      constructionYear: '',
      communityFees: '',
      promotionalPrice: '',
      features: {},
      amenities: {}, // Reset amenities
      highlights: {},
      propertyLabels: {}, // Reset property labels
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
      nearby: {},
      views: {},
      facilities: {},

      views: {  },
      facilities: {
        'common-area': {},
        'dining': {},
        'fitness': {},
        'pool': {},
        'other': {}
      }
    },
    propertyImages: [],
    floorPlanImages: [],
    unitPlanImages: [],
    showMap: true
  }),
}));

export default usePropertyFormStore;
