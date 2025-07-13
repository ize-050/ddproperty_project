'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import Swal from 'sweetalert2';
import { useLocale } from 'next-intl';

// Components
import ListingTypeSection from './ListingTypeSection';
import PropertyTypeSection from './PropertyTypeSection';
import PropertyInfoSection from './PropertyInfoSection';
import LocationSection from './LocationSection';
import PricingSection from './PricingSection';
import FeaturesSection from './FeaturesSection';
import PropertyHighlightsSection from './PropertyHighlightsSection';
import MoreRoomTypeSection from './MoreRoomTypeSection';
import NearbySection from './NearbySection';
import ViewSection from './ViewSection';
import FacilitiesSection from './FacilitiesSection';
import PropertyDescriptionSection from './PropertyDescriptionSection';
import PropertyDetailSection from './PropertyDetailSection';
import PhotosSection from './PhotosSection';
import FloorPlanSection from './FloorPlanSection';
import UnitPlanSection from './UnitPlanSection';
import SocialMediaSection from './SocialMediaSection';
import ContactSection from './ContactSection';
import CoAgentSection from './CoAgentSection';

// Store and API
import usePropertyFormStore from '@/store/propertyFormStore';

const DuplicatePropertyForm = ({ propertyId }) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('AddProperty');
  const {
    formData,
    propertyImages,
    floorPlanImages,
    unitPlanImages,
    setFormData,
    resetForm,
    addPropertyImages,
    addFloorPlanImages,
    addUnitPlanImages
  } = usePropertyFormStore();

  const [validationSummary, setValidationSummary] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [propertyReference, setPropertyReference] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { handleSubmit, formState: { errors }, trigger, reset, watch, register } = useFormContext();
  const watchedStatus = watch('status');

  console.log("DuplicatePropertyForm propertyId:", propertyId);

  const fetchNextPropertyCode = async () => {
    try {
      // Get token
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('token');

      // Call API to get next property code
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/next-property-code`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch next property code');
      }

      const data = await response.json();

      if (data.success && data.propertyCode) {
        setFormData({ ...formData, propertyId: data.propertyCode });
        setPropertyReference(data.propertyCode);
        methods.setValue('propertyId', data.propertyCode);
      }
    } catch (error) {
      console.error('Error fetching next property code:', error);
    }
  };


  useEffect(() => {
    reset()
    resetForm()
    addPropertyImages([])
    addFloorPlanImages([])
    addUnitPlanImages([])
  }, [propertyId])

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY
          }
        });


        if (!response.ok) {
          throw new Error('Failed to fetch property data');
        }

        const responseData = await response.json();

        if (responseData.status === 'success' && responseData.data) {
          const property = responseData.data;
          console.log("Property data retrieved:", property);

          // แปลงข้อมูล Property ให้ตรงกับ formData structure


          const amenitiesObj = {};
          if (property.amenities && Array.isArray(property.amenities)) {
            property.amenities.forEach(amenity => {
              if (amenity.amenityType) {
                amenitiesObj[amenity.amenityType] = {
                  active: amenity.active || false,
                  iconId: amenity.iconId || null
                };
              }
            });
          }


          const highlightsObj = {};
          if (property.highlights && Array.isArray(property.highlights)) {
            property.highlights.forEach(highlight => {
              if (highlight.highlightType) {
                highlightsObj[highlight.highlightType] = {
                  active: highlight.active || false,
                  iconId: highlight.iconId || null
                };
              }
            });
          }



          let facilitiesObj = {}

          let facilityIcons = {
            'common-area': {},
            'dining': {},
            'fitness': {},
            'pool': {},
            'other': {}
          };

          if (property.facilities && Array.isArray(property.facilities)) {
            property.facilities.forEach(facility => {
              Object.keys(facilityIcons).forEach(key => {
                if (facility?.Icon?.sub_name === key) {
                  facilityIcons[key] = facilityIcons[key] || {};
                  facilityIcons[key][facility.Icon.key] = {
                    active: facility.active,
                    iconId: facility.iconId,
                  };
                }
              })
            });
          }

          facilitiesObj = facilityIcons;
          

          const viewsObj = {};
          if (property.views && Array.isArray(property.views)) {
            property.views.forEach(view => {
              if (view.viewType) {
                viewsObj[view.viewType] = {
                  active: view.active || false,
                  iconId: view.iconId || null
                };
              }
            });
          }

          const nearbyObj = {};
          if (property.nearbyPlaces && Array.isArray(property.nearbyPlaces)) {
            property.nearbyPlaces.forEach(nearby => {
              if (nearby.nearbyType) {
                nearbyObj[nearby.nearbyType] = {
                  active: nearby.active || false,
                  iconId: nearby.iconId || null
                };
              }
            });
          }


          const labelObj = {};
          if (property.labels && Array.isArray(property.labels)) {
            property.labels.forEach(label => {
              if (label.labelType) {
                labelObj[label.labelType] = {
                  active: label.active || false,
                  iconId: label.iconId || null
                };
              }
            });
          }

          // Parse JSON fields if they are JSON strings
          let parsedContactInfo = {};
          let parsedSocialMedia = {};
          let parsedTranslatedTitles = {};
          let parsedTranslatedDescriptions = {};
          let parsedTranslatedPaymentPlans = {};
          
          try {
            if (typeof property.contactInfo === 'string') {
              parsedContactInfo = JSON.parse(property.contactInfo);
            } else {
              parsedContactInfo = property.contactInfo || {};
            }
          } catch (error) {
            console.error('Error parsing contactInfo:', error);
            parsedContactInfo = {};
          }
          
          try {
            if (typeof property.socialMedia === 'string') {
              parsedSocialMedia = JSON.parse(property.socialMedia);
            } else {
              parsedSocialMedia = property.socialMedia || {};
            }
          } catch (error) {
            console.error('Error parsing socialMedia:', error);
            parsedSocialMedia = {};
          }

          try {
            if (typeof property.translatedTitles === 'string') {
              parsedTranslatedTitles = JSON.parse(property.translatedTitles);
            } else {
              parsedTranslatedTitles = property.translatedTitles || {};
            }
          } catch (error) {
            console.error('Error parsing translatedTitles:', error);
            parsedTranslatedTitles = {};
          }

          try {
            if (typeof property.translatedDescriptions === 'string') {
              parsedTranslatedDescriptions = JSON.parse(property.translatedDescriptions);
            } else {
              parsedTranslatedDescriptions = property.translatedDescriptions || {};
            }
          } catch (error) {
            console.error('Error parsing translatedDescriptions:', error);
            parsedTranslatedDescriptions = {};
          }

          try {
            if (typeof property.translatedPaymentPlans === 'string') {
              parsedTranslatedPaymentPlans = JSON.parse(property.translatedPaymentPlans);
            } else {
              parsedTranslatedPaymentPlans = property.translatedPaymentPlans || {};
            }
          } catch (error) {
            console.error('Error parsing translatedPaymentPlans:', error);
            parsedTranslatedPaymentPlans = {};
          }



          let propertyData = {
            property_code: property.propertyCode,
            projectName: property.projectName || '',
            referenceId: property.referenceId || '',
            propertyTitle: property.propertyTitle || property.title || '',
            propertyType: property.propertyTypeId || '',
            listingType: property.listingType || 'SALE',
            description: property.description || '',
            paymentPlan: property.paymentPlan || '',

            // Translations (use parsed data)
            translatedTitles: {
              th: parsedTranslatedTitles?.th || '',
              zh: parsedTranslatedTitles?.zh || '',
              ru: parsedTranslatedTitles?.ru || '',
              en: parsedTranslatedTitles?.en || ''
            },
            translatedDescriptions: {
              th: parsedTranslatedDescriptions?.th || '',
              zh: parsedTranslatedDescriptions?.zh || '',
              ru: parsedTranslatedDescriptions?.ru || '',
              en: parsedTranslatedDescriptions?.en || ''
            },
            translatedPaymentPlans: {
              th: parsedTranslatedPaymentPlans?.th || '',
              zh: parsedTranslatedPaymentPlans?.zh || '',
              ru: parsedTranslatedPaymentPlans?.ru || '',
              en: parsedTranslatedPaymentPlans?.en || ''
            },

            socialMedia: {
              youtubeUrl: parsedSocialMedia?.youtubeUrl || '',
              tiktokUrl: parsedSocialMedia?.tiktokUrl || '',
              facebookUrl: parsedSocialMedia?.facebookUrl || '',
              instagramUrl: parsedSocialMedia?.instagramUrl || ''
            },

            address: property.address || '',
            ownershipQuota: property.ownershipQuota || '',
            province: property.province || '',
            usableArea: property.usableArea || '',
            landSize: property.landSize || '',
            landArea: property.landArea || '',
            direction: property.direction || '',
            road: property.road || '',
            property_code: property.propertyCode || '',
            building: property.building || '',
            floors: property.floors || '',
            furnishing: property.furnishing || '',
            constructionYear: property.constructionYear || '',
            communityFees: property.communityFee || '',
            propertyStatus: property.propertyStatus || '',
            unit: property.unit || '',


            district: property.district || '',
            subdistrict: property.subdistrict || '',
            postalCode: property.zipCode || '',
            latitude: property.latitude || 13.7563,
            longitude: property.longitude || 100.5018,

            zone_id: property.zoneId || '',

            bedrooms: property.bedrooms || '',
            bathrooms: property.bathrooms || '',
            area: property.area || '',
            price: property.price || '',
            priceUnit: property.priceUnit || 'THB',
            longTerm1Year: property.longTerm1Year || '',
            propertyPriceTypeId: property.propertyPriceTypeId || '',
            pricePerSqm: property.pricePerSqm,
            amenities: amenitiesObj,
            propertyLabels: labelObj,
            facilities: facilitiesObj,
            nearby: nearbyObj,
            highlights: highlightsObj,
            views: viewsObj,
            contactInfo: {
              phone: parsedContactInfo?.phone || '',
              email: parsedContactInfo?.email || '',
              lineId: parsedContactInfo?.lineId || '',
              whatsapp: parsedContactInfo?.whatsapp || '',
              wechatId: parsedContactInfo?.wechatId || '',
              secondaryPhone: parsedContactInfo?.secondaryPhone || '',
              facebookMessenger: parsedContactInfo?.facebookMessenger || '',
              instagram: parsedContactInfo?.instagram || ''
            },
            status: property.status || 'AVAILABLE',
            availableFrom: property.availableFrom ? new Date(property.availableFrom) : null,
            availableTo: property.availableTo ? new Date(property.availableTo) : null,
            agentId: property.agentId || '',
            createdBy: property.createdBy || '',
            updatedBy: property.updatedBy || '',

            // Co-Agent fields
            coAgentAccept: property.coAgentAccept || false,
            commissionType: property.commissionType === 'PERCENT' ? 'percent' : 
                           property.commissionType === 'FIXED_AMOUNT' ? 'amount' : 
                           property.commissionType || 'percent',
            commissionPercent: property.commissionPercent || '',
            commissionAmount: property.commissionAmount || '',
            privateNote: property.privateNote || '',

            // Land Size fields
            land_size_rai: property.landSizeRai || '',
            land_size_ngan: property.landSizeNgan || '',
            land_size_sq_wah: property.landSizeSqWah || '',
            landSizeSqm: property.landSizeSqm || ''
          };

          const saleListing = property.listings.find(l => l.listingType === 'SALE');
          const rentListing = property.listings.find(l => l.listingType === 'RENT');

          if (saleListing) {
            propertyData.price = saleListing.price || 0;
            propertyData.promotionalPrice = saleListing.promotionalPrice || '';
          }

          if (rentListing) {
            propertyData.rentalPrice = rentListing.price || 0;
            propertyData.shortTerm3Months = rentListing.shortTerm3Months || 0;
            propertyData.shortTerm6Months = rentListing.shortTerm6Months || 0;
            propertyData.shortTerm1Year = rentListing.shortTerm1Year || 0;
          }
          
          // เซ็ตค่า form data ใน store
          setFormData({ ...propertyData });
          reset(propertyData);

          // Handle property images
          if (property.images && property.images.length > 0) {
            const formattedImages = property.images.map(img => {
              const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + img.url || process.env.NEXT_PUBLIC_IMAGE_URL + img.imageUrl;
              const filename = imageUrl.split('/').pop() || `property-image-${img.id}.jpg`;

              return {
                id: String(Math.random().toString().substring(2)), // Generate new ID for duplicate
                url: imageUrl,
                isFeatured: img.isFeatured || false,
                sortOrder: img.sortOrder || 0,
                file: null,
                filename: filename,
                isExisting: false // Treat as new file for duplication
              };
            }).sort((a, b) => a.sortOrder - b.sortOrder);


            // Convert image URLs to File objects
            const processImages = async () => {
              const newImages = [];

              for (const img of formattedImages) {
                try {
                  const file = await urlToFile(img.url, img.filename, 'image/jpeg');
                  if (file) {
                    newImages.push({
                      ...img,
                      file: file
                    });
                  }
                } catch (error) {
                  console.error('Error converting image URL to file:', error);
                }
              }

              if (newImages.length > 0) {
                addPropertyImages(newImages);
              }
            };

            processImages();
          }

          // Handle floor plan images
          if (property.floorPlans && property.floorPlans.length > 0) {
            const formattedFloorPlans = property.floorPlans.map(img => {
              const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + img.url || process.env.NEXT_PUBLIC_IMAGE_URL + img.imageUrl;
              const filename = imageUrl.split('/').pop() || `floor-plan-${img.id}.jpg`;

              return {
                id: String(Math.random().toString().substring(2)), // Generate new ID for duplicate
                url: imageUrl,
                file: null, // Will be converted to file later
                filename: filename,
                isExisting: false, // Treat as new file for duplication
                sortOrder: img.sortOrder || 0,
              };
            }).sort((a, b) => a.sortOrder - b.sortOrder);

            // Convert image URLs to File objects
            const processFloorPlanImages = async () => {
              const newImages = [];

              for (const img of formattedFloorPlans) {
                try {
                  const file = await urlToFile(img.url, img.filename, 'image/jpeg');
                  if (file) {
                    newImages.push({
                      ...img,
                      file: file
                    });
                  }
                } catch (error) {
                  console.error('Error converting floor plan URL to file:', error);
                }
              }

              if (newImages.length > 0) {
                addFloorPlanImages(newImages);
              }
            };

            processFloorPlanImages();
          }

          // Handle unit plan images
          if (property.unitPlans && property.unitPlans.length > 0) {
            const formattedUnitPlans = property.unitPlans.map(img => {
              const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + img.url || process.env.NEXT_PUBLIC_IMAGE_URL + img.imageUrl;
              const filename = imageUrl.split('/').pop() || `unit-plan-${img.id}.jpg`;

              return {
                id: String(Math.random().toString().substring(2)), // Generate new ID for duplicate
                url: imageUrl,
                file: null, // Will be converted to file later
                filename: filename,
                isExisting: false, // Treat as new file for duplication
                sortOrder: img.sortOrder || 0,
              };
            }).sort((a, b) => a.sortOrder - b.sortOrder);

            // Convert image URLs to File objects
            const processUnitPlanImages = async () => {
              const newImages = [];

              for (const img of formattedUnitPlans) {
                try {
                  const file = await urlToFile(img.url, img.filename, 'image/jpeg');
                  if (file) {
                    newImages.push({
                      ...img,
                      file: file
                    });
                  }
                } catch (error) {
                  console.error('Error converting unit plan URL to file:', error);
                }
              }

              if (newImages.length > 0) {
                addUnitPlanImages(newImages);
              }
            };

            processUnitPlanImages();

          }
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        } else {
          toast.error('Failed to load property data');
          setIsLoading(false);
        }
      } catch (error) {
        toast.error('Failed to load property data');
        setIsLoading(false);
      }
    };

    // Function to convert image URL to File object
    const urlToFile = async (url, filename, mimeType) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
        const blob = await response.blob();
        return new File([blob], filename, { type: mimeType || blob.type });
      } catch (error) {
        console.error('Error converting URL to File:', error);
        return null;
      }
    };

    if (propertyId) {
      resetForm();
      fetchPropertyData();
      fetchNextPropertyCode();
    }
  }, [propertyId]);

  useEffect(() => {
    if (formSubmitted && Object.keys(errors).length > 0) {
      const errorMessages = [];
      Object.entries(errors).forEach(([key, error]) => {
        if (error.message) {
          errorMessages.push(error.message);
        }
      });
      setValidationSummary(errorMessages);
    } else {
      setValidationSummary([]);
    }
  }, [errors, formSubmitted])


  useEffect(() => {
    if (formSubmitted) {
      trigger();
    }
  }, [formSubmitted, trigger]);



  // Handle form submission
  const onSubmit = async (data) => {
    // Use the new property code for the duplicated property
    data.propertyId = propertyReference;
    data.propertyCode = propertyReference;
    try {
      setValidationSummary([]);
      setFormSubmitted(false);

       console.log("dataRequestEdit",data);
            setValidationSummary([]);
            setFormSubmitted(false);
            
            // ตรวจสอบว่าหากเปิดโปรโมชั่นจะต้องกรอกราคาโปรโมชั่นด้วย
            const hasPromotion = document.getElementById('promotionToggle')?.checked;
            if (hasPromotion && (!data.promotionalPrice || data.promotionalPrice === '0' || data.promotionalPrice === 0 || data.promotionalPrice === '')) {
              toast.error('Promotional price is required when promotion is enabled');
              setValidationSummary(['Promotional price is required when promotion is enabled']);
              setSaving(false);
              
              // เลื่อนไปที่ promotionalPrice field
              const promotionalPriceElement = document.getElementById('promotionalPrice');
              if (promotionalPriceElement) {
                promotionalPriceElement.focus();
                promotionalPriceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
              
              return;
            }
            

      setSaving(true);

      // แสดงข้อความกำลังบันทึกข้อมูล
      const loadingToast = toast.loading(t('savingData'));


      // สร้าง FormData object สำหรับส่งข้อมูลและรูปภาพ
      const formDataObj = new FormData();

      delete data.amenities;
      delete data.highlights;
      delete data.nearby;
      delete data.views;
      delete data.facilities;
      delete data.labels;
      delete data.socialMedia;

      // Exclude co-agent fields from general loop to avoid duplication
      const excludeFields = ['coAgentAccept', 'commissionType', 'commissionPercent', 'commissionAmount', 'privateNote'];

      for (const [key, value] of Object.entries(data)) {
        if (!excludeFields.includes(key)) {
          if (typeof value === 'object' && value !== null) {
            // แปลง object เป็น JSON string
            formDataObj.append(key, JSON.stringify(value));
          } else {
            formDataObj.append(key, value);
          }
        }
      }

      // ตั้งค่าชื่อฟิลด์ให้ถูกต้องตามที่ backend คาดหวัง
      formDataObj.append('title', data.propertyTitle);
      formDataObj.append('zipCode', data.postalCode);
      
      // เพิ่ม land size fields
      const landSizeFields = ['land_size_rai', 'land_size_ngan', 'land_size_sq_wah', 'landSizeSqm'];
      landSizeFields.forEach((field) => {
        if (data[field]) {
          formDataObj.append(field, data[field]);
        }
      });
      
      // เพิ่ม co-agent fields
      formDataObj.append('coAgentAccept', data.coAgentAccept || false);
      if (data.commissionType) formDataObj.append('commissionType', data.commissionType);
      if (data.commissionPercent) formDataObj.append('commissionPercent', data.commissionPercent);
      if (data.commissionAmount) formDataObj.append('commissionAmount', data.commissionAmount);
      if (data.privateNote) formDataObj.append('privateNote', data.privateNote);

      // ส่งฟิลด์ arrays ตาม format ที่ backend ต้องการ
      formDataObj.append('facility', JSON.stringify(formData.facility || []));
      formDataObj.append('amenities', JSON.stringify(formData.amenities || []));
      formDataObj.append('highlights', JSON.stringify(formData.highlights || []));
      formDataObj.append('nearby', JSON.stringify(formData.nearby || []));
      formDataObj.append('views', JSON.stringify(formData.views || []));
      formDataObj.append('facilities', JSON.stringify(formData.facilities || []));
      formDataObj.append('labels', JSON.stringify(formData.propertyLabels || []));
      formDataObj.append('socialMedia', JSON.stringify(formData.socialMedia || []));

      // สร้าง listings array ตามประเภทการขาย/เช่า
      const listings = [];

      if (data.status === 'SALE' || data.status === 'SALE_RENT') {
        listings.push({
          listingType: 'SALE',
          price: data.price,
          pricePerSqm: data.pricePerSqm,
          promotionalPrice: data.promotionalPrice,
          currency: data.currency || 'THB'
        });
      }

      if (data.status === 'RENT' || data.status === 'SALE_RENT') {
        listings.push({
          listingType: 'RENT',
          price: data.rentalPrice,
          shortTerm3Months: data.shortTerm3Months,
          shortTerm6Months: data.shortTerm6Months,
          shortTerm1Year: data.shortTerm1Year,
          minimumStay: data.minimumStay,
          currency: data.currency || 'THB'
        });
      }

      // เพิ่ม listings array เข้าไปใน formData
      formDataObj.append('listings', JSON.stringify(listings));

      // เพิ่มรูปภาพ property - ทุกรูปเป็นรูปใหม่สำหรับการ duplicate
      propertyImages.forEach((image) => {
        if (image.file) {
          formDataObj.append(`images`, image.file);
        }
      });

      // เพิ่มรูปภาพ floor plan - ทุกรูปเป็นรูปใหม่สำหรับการ duplicate
      floorPlanImages.forEach((image) => {
        if (image.file) {
          formDataObj.append(`floorPlanImages`, image.file);
        }
      });

      // เพิ่มรูปภาพ unit plan - ทุกรูปเป็นรูปใหม่สำหรับการ duplicate
      unitPlanImages.forEach((image) => {
        if (image.file) {
          formDataObj.append(`unitPlanImages`, image.file);
        }
      });

      console.log('Sending data to API...', { formDataSize: [...formDataObj.entries()].length });

      // แสดงข้อมูลที่ส่งไป API แบบละเอียด
      for (let [key, value] of formDataObj.entries()) {
        console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
      }

      // ดึง token จาก localStorage หรือ sessionStorage
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // ส่งข้อมูลไปยัง API สร้างใหม่แทนที่จะอัปเดต
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY
        },
        body: formDataObj,
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create property');
      }
      const responseData = await response.json();

      if (responseData.status === 'success') {
        // แสดง dialog ถามว่าต้องการไปที่หน้ารายการอสังหาฯ หรือไม่
        Swal.fire({
          title: 'Property Duplicated!',
          html: `<div class="text-center">${'The property has been successfully duplicated.'}</div>`,
          icon: 'success',
          confirmButtonText: 'View Property'
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to the property list
            router.push(`/${locale}/backoffice/my-properties`);
          }
        });

        // Reset form
        resetForm();
      } else {
        throw new Error(responseData.message || 'Failed to create property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      
      // Check if it's an image limit error
      if (error.response?.data?.error === 'IMAGE_LIMIT_EXCEEDED') {
        Swal.fire({
          icon: 'warning',
          title: 'จำนวนรูปภาพเกินกำหนด',
          text: 'จำนวนรูปภาพเกิน 50 รูป กรุณาเลือกรูปภาพไม่เกิน 50 รูป',
          confirmButtonText: 'ตกลง'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to create property ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container-fluid">
      {/* Loading overlay */}
      {isLoading && (
        <div className="position-fixed w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ top: 0, left: 0, backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 9999 }}>
          <div className="spinner-border" style={{ color: '#922014' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {validationSummary.length > 0 && (
        <div className="alert alert-danger">
          <ul>
            {validationSummary.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

    

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <ListingTypeSection type={"edit"} />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <PropertyInfoSection />
        </div>
      </div>

     

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <PropertyTypeSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <LocationSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <PricingSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <PropertyDescriptionSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <PhotosSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <FloorPlanSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <UnitPlanSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <PropertyDetailSection watchedStatus={watchedStatus} />
        </div>
      </div>



      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <FeaturesSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <MoreRoomTypeSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <PropertyHighlightsSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <FacilitiesSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <NearbySection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <ViewSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <SocialMediaSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <ContactSection />
        </div>
      </div>

      <div className="card mb-4" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <div className="card-body">
          <CoAgentSection />
        </div>
      </div>

      {/* Submit buttons */}
      <div className="form-actions d-flex justify-content-center mb-5">
        <button
          type="submit"
          className="btn btn-dark me-3"
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {t('saving')}
            </>
          ) : (
            'Create Duplicate'
          )}
        </button>

        <button
          type="button"
          className="btn btn-outline-dark"
          onClick={() => router.push('/backoffice/properties')}
          disabled={saving}
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
};

export default DuplicatePropertyForm;
