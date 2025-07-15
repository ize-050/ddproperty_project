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
    // Co-Agent Accept fields
    coAgentAccept: false,
    commissionType: 'percent', // 'percent' or 'amount'
    commissionPercent: '',
    commissionAmount: '',
    privateNote: '',
    // Featured property
    isFeatured: false,
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
  setAmenity: (key, value, id) => set((state) => {
    console.log('setAmenity called with:', { key, value, id });
    console.log('Current amenities before update:', state.formData.amenities);
    
    const updatedState = {
      formData: {
        ...state.formData,
        amenities: {
          ...state.formData.amenities,
          [key]: {
            active: value,
            iconId: id
          }
        }
      }
    };
    
    console.log('Updated amenities after update:', updatedState.formData.amenities);
    return updatedState;
  }),

  setFacility: (category, key, value, id) => set((state) => {
    return {
      formData: {
        ...state.formData,
        facilities: {
          ...state.formData.facilities,
          [category]: {
            ...state.formData.facilities[category],
            [key]: {
              active: value,
              iconId: id
            }
          }
        }
      }
    };
  }),

  setHighlight: (key, value, id) => set((state) => {
    return {
      formData: {
        ...state.formData,
        highlights: {
          ...state.formData.highlights,
          [key]: {
            active: value,
            iconId: id
          }
        }
      }
    };
  }),

  setNearby: (key, value, id) => set((state) => {
    return {
      formData: {
        ...state.formData,
        nearby: {
          ...state.formData.nearby,
          [key]: {
            active: value,
            iconId: id
          }
        }
      }
    };
  }),

  setView: (key, value, id) => set((state) => {
    return {
      formData: {
        ...state.formData,
        views: {
          ...state.formData.views,
          [key]: {
            active: value,
            iconId: id
          }
        }
      }
    };
  }),

  setPropertyLabel: (key, value, id) => set((state) => {
    return {
      formData: {
        ...state.formData,
        propertyLabels: {
          ...state.formData.propertyLabels,
          [key]: {
            active: value,
            iconId: id
          }
        }
      }
    };
  }),

  setFeature: (category, key, value, id) => set((state) => {
    return {
      formData: {
        ...state.formData,
        features: {
          ...state.formData.features,
          [category]: {
            ...state.formData.features[category],
            [key]: {
              active: value,
              iconId: id
            }
          }
        }
      }
    };
  }),

  initializeFacilities: (facilityIcons) => {
    console.log('initializeFacilities called with:', facilityIcons);
    set((state) => {
      const currentFacilities = state.formData.facilities || {};
      const updatedFacilities = { ...currentFacilities };

      // Handle different data structures
      if (facilityIcons && typeof facilityIcons === 'object') {
        // Loop through each category and their items
        Object.keys(facilityIcons).forEach(category => {
          if (Array.isArray(facilityIcons[category])) {
            // Process all icons in this category
            facilityIcons[category].forEach(icon => {
              if (icon && icon.key) {
                // Preserve existing active state if it exists, otherwise initialize as false
                if (!updatedFacilities[category]) {
                  updatedFacilities[category] = {};
                }
                if (!updatedFacilities[category][icon.key]) {
                  updatedFacilities[category][icon.key] = {
                    active: false,
                    iconId: icon.id
                  };
                  console.log(`Initialized facility icon: ${category}.${icon.key} with iconId: ${icon.id}`);
                } else {
                  // Keep the active state but update the iconId
                  updatedFacilities[category][icon.key] = {
                    ...updatedFacilities[category][icon.key],
                    iconId: icon.id
                  };
                }
              }
            });
          }
        });
      }

      console.log('Updated facilities data:', updatedFacilities);

      return {
        formData: {
          ...state.formData,
          facilities: updatedFacilities
        }
      };
    });
  },

  initializeFeatures: (featureIcons) => {
    console.log('initializeFeatures called with:', featureIcons);
    set((state) => {
      const currentFeatures = state.formData.features || {};
      const updatedFeatures = { ...currentFeatures };

      // Handle different data structures
      if (featureIcons && typeof featureIcons === 'object') {
        // Loop through each category and their items
        Object.keys(featureIcons).forEach(category => {
          if (Array.isArray(featureIcons[category])) {
            // Process all icons in this category
            featureIcons[category].forEach(icon => {
              if (icon && icon.key) {
                // Preserve existing active state if it exists, otherwise initialize as false
                if (!updatedFeatures[category]) {
                  updatedFeatures[category] = {};
                }
                if (!updatedFeatures[category][icon.key]) {
                  updatedFeatures[category][icon.key] = {
                    active: false,
                    iconId: icon.id
                  };
                  console.log(`Initialized feature icon: ${category}.${icon.key} with iconId: ${icon.id}`);
                } else {
                  // Keep the active state but update the iconId
                  updatedFeatures[category][icon.key] = {
                    ...updatedFeatures[category][icon.key],
                    iconId: icon.id
                  };
                }
              }
            });
          }
        });
      }

      console.log('Updated features data:', updatedFeatures);

      return {
        formData: {
          ...state.formData,
          features: updatedFeatures
        }
      };
    });
  },

  // Initialize highlights icons after fetching from API
  initializeHighlights: (highlightIcons) => {
    // Get current state first to preserve existing values
    set(state => {
      const currentHighlights = state.formData.highlights || {};
      const updatedHighlights = { ...currentHighlights }; // Clone to avoid direct mutation



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
    console.log('initializeNearby called with:', nearbyIcons);
    // Get current state first to preserve existing values
    set(state => {
      const currentNearby = state.formData.nearby || {};
      const updatedNearby = { ...currentNearby }; // Clone to avoid direct mutation

      // Handle different data structures
      let iconsToProcess = [];
      
      if (Array.isArray(nearbyIcons)) {
        iconsToProcess = nearbyIcons;
      } else if (nearbyIcons && typeof nearbyIcons === 'object') {
        // If it's an object, try to extract arrays from it
        iconsToProcess = Object.values(nearbyIcons).flat();
      }

      console.log('Icons to process for nearby:', iconsToProcess);

      iconsToProcess.forEach(icon => {
        if (icon && icon.key && !updatedNearby[icon.key]) {
          updatedNearby[icon.key] = {
            active: false,
            iconId: icon.id
          };
          console.log(`Initialized nearby icon: ${icon.key} with iconId: ${icon.id}`);
        }
      });

      console.log('Updated nearby data:', updatedNearby);

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
      const updatedViews = { ...currentViews }; // Clone to avoid direct mutation

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
  setSocialMedia: (name, socialMedia) => {
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
    console.log('initializePropertyLabels called with:', labelIcons);
    set((state) => {
      const currentLabels = state.formData.propertyLabels || {};
      const updatedLabels = { ...currentLabels };

      // Handle different data structures
      let iconsToProcess = [];
      
      if (Array.isArray(labelIcons)) {
        iconsToProcess = labelIcons;
      } else if (labelIcons && typeof labelIcons === 'object') {
        iconsToProcess = Object.values(labelIcons).flat();
      }

      console.log('Icons to process for property labels:', iconsToProcess);

      iconsToProcess.forEach(icon => {
        if (icon && icon.key && !updatedLabels[icon.key]) {
          updatedLabels[icon.key] = {
            active: false,
            iconId: icon.id
          };
          console.log(`Initialized property label icon: ${icon.key} with iconId: ${icon.id}`);
        }
      });

      return {
        formData: {
          ...state.formData,
          propertyLabels: updatedLabels
        }
      };
    });
  },

  initializeAmenities: (amenityIcons) => {
    console.log('initializeAmenities called with:', amenityIcons);
    set((state) => {
      const currentAmenities = state.formData.amenities || {};
      const updatedAmenities = { ...currentAmenities };

      // Handle different data structures
      let iconsToProcess = [];
      
      if (Array.isArray(amenityIcons)) {
        iconsToProcess = amenityIcons;
      } else if (amenityIcons && typeof amenityIcons === 'object') {
        iconsToProcess = Object.values(amenityIcons).flat();
      }

      console.log('Icons to process for amenities:', iconsToProcess);

      iconsToProcess.forEach(icon => {
        if (icon && icon.key && !updatedAmenities[icon.key]) {
          updatedAmenities[icon.key] = {
            active: false,
            iconId: icon.id
          };
          console.log(`Initialized amenity icon: ${icon.key} with iconId: ${icon.id}`);
        }
      });

      return {
        formData: {
          ...state.formData,
          amenities: updatedAmenities
        }
      };
    });
  },

  initializeHighlights: (highlightIcons) => {
    console.log('initializeHighlights called with:', highlightIcons);
    set((state) => {
      const currentHighlights = state.formData.highlights || {};
      const updatedHighlights = { ...currentHighlights };

      // Handle different data structures
      let iconsToProcess = [];
      
      if (Array.isArray(highlightIcons)) {
        iconsToProcess = highlightIcons;
      } else if (highlightIcons && typeof highlightIcons === 'object') {
        iconsToProcess = Object.values(highlightIcons).flat();
      }

      console.log('Icons to process for highlights:', iconsToProcess);

      iconsToProcess.forEach(icon => {
        if (icon && icon.key && !updatedHighlights[icon.key]) {
          updatedHighlights[icon.key] = {
            active: false,
            iconId: icon.id
          };
          console.log(`Initialized highlight icon: ${icon.key} with iconId: ${icon.id}`);
        }
      });

      return {
        formData: {
          ...state.formData,
          highlights: updatedHighlights
        }
      };
    });
  },

  initializeViews: (viewIcons) => {
    console.log('initializeViews called with:', viewIcons);
    set((state) => {
      const currentViews = state.formData.views || {};
      const updatedViews = { ...currentViews };

      // Handle different data structures
      let iconsToProcess = [];
      
      if (Array.isArray(viewIcons)) {
        iconsToProcess = viewIcons;
      } else if (viewIcons && typeof viewIcons === 'object') {
        iconsToProcess = Object.values(viewIcons).flat();
      }

      console.log('Icons to process for views:', iconsToProcess);

      iconsToProcess.forEach(icon => {
        if (icon && icon.key && !updatedViews[icon.key]) {
          updatedViews[icon.key] = {
            active: false,
            iconId: icon.id
          };
          console.log(`Initialized view icon: ${icon.key} with iconId: ${icon.id}`);
        }
      });

      return {
        formData: {
          ...state.formData,
          views: updatedViews
        }
      };
    });
  },

  initializePropertyLabels: (labelIcons) => {
    console.log('initializePropertyLabels called with:', labelIcons);
    set((state) => {
      const currentLabels = state.formData.propertyLabels || {};
      const updatedLabels = { ...currentLabels };

      // Handle different data structures
      let iconsToProcess = [];
      
      if (Array.isArray(labelIcons)) {
        iconsToProcess = labelIcons;
      } else if (labelIcons && typeof labelIcons === 'object') {
        iconsToProcess = Object.values(labelIcons).flat();
      }

      console.log('Icons to process for property labels:', iconsToProcess);

      iconsToProcess.forEach(icon => {
        if (icon && icon.key && !updatedLabels[icon.key]) {
          updatedLabels[icon.key] = {
            active: false,
            iconId: icon.id
          };
          console.log(`Initialized property label icon: ${icon.key} with iconId: ${icon.id}`);
        }
      });

      return {
        formData: {
          ...state.formData,
          propertyLabels: updatedLabels
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
    formData: {
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
    const items = Array.from(state.propertyImages);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);
    
    // อัปเดต sortOrder ให้ตรงกับตำแหน่งใหม่
    const updatedItems = items.map((item, index) => ({
      ...item,
      sortOrder: index
    }));
    
    return { propertyImages: updatedItems };
  }),

  // Floor Plan Images Functions
  addFloorPlanImages: (newImages) => set((state) => ({
    floorPlanImages: [...state.floorPlanImages, ...newImages],
  })),

  removeFloorPlanImage: (id) => set((state) => ({
    floorPlanImages: state.floorPlanImages.filter((img) => img.id !== id),
  })),

  reorderFloorPlanImages: (sourceIndex, destinationIndex) =>
    set((state) => {
      const items = Array.from(state.floorPlanImages);
      const [reorderedItem] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, reorderedItem);
      
      // อัปเดต sortOrder ให้ตรงกับตำแหน่งใหม่
      const updatedItems = items.map((item, index) => ({
        ...item,
        sortOrder: index
      }));
      
      return { floorPlanImages: updatedItems };
    }),

  // Unit Plan Images Functions
  addUnitPlanImages: (newImages) => set((state) => ({
    unitPlanImages: [...state.unitPlanImages, ...newImages],
  })),

  removeUnitPlanImage: (id) => set((state) => ({
    unitPlanImages: state.unitPlanImages.filter((img) => img.id !== id),
  })),

  reorderUnitPlanImages: (sourceIndex, destinationIndex) =>
    set((state) => {
      const items = Array.from(state.unitPlanImages);
      const [reorderedItem] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, reorderedItem);
      
      // อัปเดต sortOrder ให้ตรงกับตำแหน่งใหม่
      const updatedItems = items.map((item, index) => ({
        ...item,
        sortOrder: index
      }));
      
      return { unitPlanImages: updatedItems };
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
      coAgentAccept: false,
      commissionType: 'percent', // 'percent' or 'amount'
      commissionPercent: '',
      commissionAmount: '',
      privateNote: '',
      // Featured property
      isFeatured: false,
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

      views: {},
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

  // Co-Agent Accept setters
  setCoAgentAccept: (value) => set((state) => ({
    formData: { ...state.formData, coAgentAccept: value }
  })),
  
  setCommissionType: (value) => set((state) => ({
    formData: { ...state.formData, commissionType: value }
  })),
  
  setCommissionPercent: (value) => set((state) => ({
    formData: { ...state.formData, commissionPercent: value }
  })),
  
  setCommissionAmount: (value) => set((state) => ({
    formData: { ...state.formData, commissionAmount: value }
  })),
  
  setPrivateNote: (value) => set((state) => ({
    formData: { ...state.formData, privateNote: value }
  })),

  // Initialize highlights icons after fetching from API
  initializeHighlights: (highlightIcons) => {
    // Get current state first to preserve existing values
    set(state => {
      const currentHighlights = state.formData.highlights || {};
      const updatedHighlights = { ...currentHighlights }; // Clone to avoid direct mutation



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

}));

export default usePropertyFormStore;
