'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import Swal from 'sweetalert2';

// Components
import ListingTypeSection from './ListingTypeSection';
import PropertyTypeSection from './PropertyTypeSection';
import PropertyInfoSection from './PropertyInfoSection';
import LocationSection from './LocationSection';
import PricingSection from './PricingSection';
import FeaturesSection from './FeaturesSection';
import PropertyHighlightsSection from './PropertyHighlightsSection';
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
import MoreRoomTypeSection from './MoreRoomTypeSection';
import CoAgentSection from './CoAgentSection';
import { useLocale } from 'next-intl';

// Store and API
import usePropertyFormStore from '@/store/propertyFormStore';

const EditPropertyForm = ({ propertyId }) => {
  const router = useRouter();
  const t = useTranslations('AddProperty');
  const locale = useLocale();
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

  console.log("GetPropertyForm propertyId:", propertyId)

  const [validationSummary, setValidationSummary] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [propertyReference, setPropertyReference] = useState('');
  const [originalImageCount, setOriginalImageCount] = useState(0);
  const [originalFloorPlanCount, setOriginalFloorPlanCount] = useState(0);
  const [originalUnitPlanCount, setOriginalUnitPlanCount] = useState(0);

  const { handleSubmit, formState: { errors }, trigger, reset } = useFormContext();

  // ดึงข้อมูล Property เดิมเมื่อโหลด component
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

        console.log("responseData", responseData);

        if (responseData.status === 'success' && responseData.data) {
          const property = responseData.data;
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

          // แสดงข้อมูล facilities ที่ได้จาก API เพื่อดูโครงสร้าง


          const facilityIcons = {
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
                  facilityIcons[key][facility?.Icon?.key] = {
                    active: facility.active,
                    iconId: facility.iconId,
                  };
                }
              })
            });
          }

          



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
            // ข้อมูลพื้นฐาน
            propertyId: property.propertyCode,
            propertyCode: property.propertyCode,
            promotionalPrice: property.promotionalPrice || '',
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

            // Social Media
            socialMedia: {
              youtubeUrl: parsedSocialMedia?.youtubeUrl || '',
              tiktokUrl: parsedSocialMedia?.tiktokUrl || '',
              facebookUrl: parsedSocialMedia?.facebookUrl || '',
              instagramUrl: parsedSocialMedia?.instagramUrl || ''
            },

            // Location
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

            // Property details
            bedrooms: property.bedrooms || '',
            bathrooms: property.bathrooms || '',
            area: property.area || '',
            price: property.price || '',
            priceUnit: property.priceUnit || 'THB',
            longTerm1Year: property.longTerm1Year || '',
            propertyPriceTypeId: property.propertyPriceTypeId || '',
            pricePerSqm: property.pricePerSqm,

            // เตรียมข้อมูลสำหรับ components ต่างๆ
            // สำคัญมาก: ชื่อฟิลด์เหล่านี้ต้องตรงกับที่ components ต่างๆ คาดหวัง

            // Features (Amenities)
            amenities: amenitiesObj,
            propertyLabels: labelObj,

            // Facilities
            facilities: facilityIcons,

            // Nearby places
            nearby: nearbyObj,

            // Property highlights
            highlights: highlightsObj,


            // Views
            views: viewsObj,

            // Property labels

            // Contact info
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

            // Status
            status: property.status || 'AVAILABLE',
            
            // Featured property
            isFeatured: property.isFeatured || false,

            // Dates
            availableFrom: property.availableFrom ? new Date(property.availableFrom) : null,
            availableTo: property.availableTo ? new Date(property.availableTo) : null,

            // Agent info
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
          };

          if (property.status === 'SALE' || property.status === 'SALE_RENT') {
            propertyData.price = property.listings.find(l => l.listingType === 'SALE')?.price || 0;
            propertyData.promotionalPrice = property.listings.find(l => l.listingType === 'SALE')?.promotionalPrice || '';
            propertyData.rentalPrice = property.listings.find(l => l.listingType === 'RENT')?.price || 0;
            propertyData.shortTerm3Months = property.listings.find(l => l.listingType === 'RENT')?.shortTerm3Months || 0;
            propertyData.shortTerm6Months = property.listings.find(l => l.listingType === 'RENT')?.shortTerm6Months || 0;
            propertyData.shortTerm1Year = property.listings.find(l => l.listingType === 'RENT')?.shortTerm1Year || 0;
          }
          else {
            propertyData.price = property.listings.find(l => l.listingType === 'SALE')?.price || 0;
            propertyData.promotionalPrice = property.listings.find(l => l.listingType === 'SALE')?.promotionalPrice || '';
          }
          console.log("propertyData for form:", propertyData);
          setFormData(propertyData);
          

          reset(propertyData);

          if (property.images && property.images.length > 0) {
            const formattedImages = property.images.map(img => ({
              id: String(img.id || Math.random().toString()),
              url: process.env.NEXT_PUBLIC_IMAGE_URL + img.url || process.env.NEXT_PUBLIC_IMAGE_URL + img.imageUrl,
              isFeatured: img.isFeatured || false,
              sortOrder: img.sortOrder || 0,
              file: null,
              isExisting: true
            })).sort((a, b) => a.sortOrder - b.sortOrder);

            addPropertyImages(formattedImages);
            setOriginalImageCount(formattedImages.length);
          }

          if (property.floorPlans && property.floorPlans.length > 0) {
            const formattedFloorPlans = property.floorPlans.map(img => ({
              id: String(img.id || Math.random().toString()),
              url: process.env.NEXT_PUBLIC_IMAGE_URL + img.url || process.env.NEXT_PUBLIC_IMAGE_URL + img.imageUrl,
              file: null,
              isExisting: true,
              sortOrder: img.sortOrder || 0,
            })).sort((a, b) => a.sortOrder - b.sortOrder);

            addFloorPlanImages(formattedFloorPlans);
            setOriginalFloorPlanCount(formattedFloorPlans.length);
          }

          if (property.unitPlans && property.unitPlans.length > 0) {
            const formattedUnitPlans = property.unitPlans.map(img => ({
              id: String(img.id || Math.random().toString()),
              url: process.env.NEXT_PUBLIC_IMAGE_URL + img.url || process.env.NEXT_PUBLIC_IMAGE_URL + img.imageUrl,
              file: null,
              isExisting: true,
              sortOrder: img.sortOrder || 0,
            })).sort((a, b) => a.sortOrder - b.sortOrder);
            addUnitPlanImages(formattedUnitPlans);
            setOriginalUnitPlanCount(formattedUnitPlans.length);
          }


        } else {
          throw new Error('Invalid property data format');
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
        toast.error(t('errorFetchingPropertyData') || 'Failed to load property data');
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    if (propertyId) {
      // Reset form before loading new data
      resetForm();
      fetchPropertyData();
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

  const onSubmit = async (data) => {
    try {
      console.log("dataRequestEdit", data);
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
      if (data.land_size_rai) formDataObj.append('land_size_rai', data.land_size_rai);
      if (data.land_size_ngan) formDataObj.append('land_size_ngan', data.land_size_ngan);
      if (data.land_size_sq_wah) formDataObj.append('land_size_sq_wah', data.land_size_sq_wah);
      
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

      // เพิ่มรูปภาพ property
      // ถ้ามีการลบรูปเก่า หรือมีการเปลี่ยนแปลงใดๆ ให้ใช้ replaceImages=true และส่ง existingImages[] เพื่อระบุรูปที่ต้องการเก็บไว้
      // เพื่อให้แน่ใจว่าการเปลี่ยนแปลงต่างๆ จะถูกบันทึกในฐานข้อมูล
      // ใช้ replaceImages=true เสมอเพื่อให้ backend อัพเดตข้อมูลรูปภาพทั้งหมด
      formDataObj.append('replaceImages', 'true');

      propertyImages.forEach((image) => {
        if (image.file) {
          formDataObj.append(`images`, image.file);

          // เพิ่มข้อมูล isFeatured และ sortOrder สำหรับรูปใหม่
          formDataObj.append(`imageMetadata[${image.id}][isFeatured]`, image.isFeatured ? 'true' : 'false');
          formDataObj.append(`imageMetadata[${image.id}][sortOrder]`, image.sortOrder || 0);
        } else if (image.isExisting) {
          formDataObj.append(`existingImages[]`, image.id);

          // เพิ่มข้อมูล isFeatured และ sortOrder สำหรับรูปเก่า
          formDataObj.append(`existingImageMetadata[${image.id}][isFeatured]`, image.isFeatured ? 'true' : 'false');
          formDataObj.append(`existingImageMetadata[${image.id}][sortOrder]`, image.sortOrder || 0);
        }
      });

      // เพิ่มรูปภาพ floor plan
      const hasFloorPlanChanges = floorPlanImages.some(img => img.file) ||
        originalFloorPlanCount !== floorPlanImages.length;
      formDataObj.append('replaceFloorPlans', hasFloorPlanChanges ? 'true' : 'false'); // Don't replace existing floor plans

      floorPlanImages.forEach((image) => {
        if (image.file) {
          formDataObj.append(`floorPlanImages`, image.file);
          formDataObj.append(`floorPlanMetadata[${image.id}][isFeatured]`, image.isFeatured ? 'true' : 'false');
          formDataObj.append(`floorPlanMetadata[${image.id}][sortOrder]`, image.sortOrder || 0);
        } else if (image.isExisting) {
          formDataObj.append(`existingFloorPlans[]`, image.id);

          formDataObj.append(`existingFloorPlanMetadata[${image.id}][isFeatured]`, image.isFeatured ? 'true' : 'false');
          formDataObj.append(`existingFloorPlanMetadata[${image.id}][sortOrder]`, image.sortOrder || 0);
        }
      });

      // เพิ่มรูปภาพ unit plan
      const hasUnitPlanChanges = unitPlanImages.some(img => img.file) ||
        originalUnitPlanCount !== unitPlanImages.length;
      formDataObj.append('replaceUnitPlans', hasUnitPlanChanges ? 'true' : 'false'); // เพิ่ม flag ให้ลบรูปเก่าก่อน

      unitPlanImages.forEach((image) => {
        if (image.file) {
          formDataObj.append(`unitPlanImages`, image.file);

          // เพิ่มข้อมูล isFeatured และ sortOrder สำหรับรูปใหม่
          formDataObj.append(`unitPlanMetadata[${image.id}][isFeatured]`, image.isFeatured ? 'true' : 'false');
          formDataObj.append(`unitPlanMetadata[${image.id}][sortOrder]`, image.sortOrder || 0);
        } else if (image.isExisting) {
          formDataObj.append(`existingUnitPlans[]`, image.id);

          // เพิ่มข้อมูล isFeatured และ sortOrder สำหรับรูปเก่า
          formDataObj.append(`existingUnitPlanMetadata[${image.id}][isFeatured]`, image.isFeatured ? 'true' : 'false');
          formDataObj.append(`existingUnitPlanMetadata[${image.id}][sortOrder]`, image.sortOrder || 0);
        }
      });


      try {
        // แสดงข้อมูลที่ส่งไป API แบบละเอียด
        for (let [key, value] of formDataObj.entries()) {
          console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
        }

        // ดึง token จาก localStorage หรือ sessionStorage
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication token not found. Please login again.');
        }

        // ส่งข้อมูลไปยัง API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY
          },
          body: formDataObj,
        });

        // ปิด toast loading
        toast.dismiss(loadingToast);

        // ตรวจสอบสถานะการตอบกลับจาก API
        if (!response.ok) {
          // พยายามอ่านข้อความผิดพลาดจาก response (ถ้ามี)
          const errorData = await response.json().catch(() => ({
            message: `HTTP error: ${response.status} ${response.statusText}`
          }));

          throw new Error(errorData.message || `Error updating property: ${response.status}`);
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create property');
        }
        const responseData = await response.json();

        if (responseData.status === 'success') {
          // แสดง dialog ถามว่าต้องการไปที่หน้ารายการอสังหาฯ หรือไม่
          Swal.fire({
            title: 'Property Updated!',
            html: `<div class="text-center">${'The property has been successfully updated.'}</div>`,
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
        Swal.fire({
          title: 'Error',
          text: 'Failed to create property ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setSaving(false);
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

  }



  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="container-fluid">


        {isLoading && (
          <div className="position-fixed w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ top: 0, left: 0, backgroundColor: 'rgba(4, 3, 3, 0.7)', zIndex: 9999 }}>
            <div className="spinner-border" style={{ color: '#922014' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}


        {/* Validation Summary */}
        {validationSummary.length > 0 && (
          <div className="validation-summary alert alert-danger">
            <h5>{t('validationErrors')}:</h5>
            <ul>
              {validationSummary.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}





      

        <div className="card mb-4">
          <div className="card-body">
            <ListingTypeSection type={"edit"} />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <PropertyInfoSection />
          </div>
        </div>


        <div className="card mb-4">
          <div className="card-body">
            <PropertyTypeSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <LocationSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <PricingSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <PropertyDescriptionSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <PhotosSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <FloorPlanSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <UnitPlanSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <PropertyDetailSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <FeaturesSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <MoreRoomTypeSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <PropertyHighlightsSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <FacilitiesSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <NearbySection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <ViewSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <SocialMediaSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <ContactSection />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <CoAgentSection />
          </div>
        </div>

        {/* Form Actions */}
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
              t('updateProperty')
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
    </>
  );
};

export default EditPropertyForm;
