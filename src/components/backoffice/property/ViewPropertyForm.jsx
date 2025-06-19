'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

// Components (all in read-only mode)
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
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
// Store and API
import usePropertyFormStore from '@/store/propertyFormStore';

const ViewPropertyForm = ({ propertyId }) => {
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

  const [isLoading, setIsLoading] = useState(true);
  const [propertyReference, setPropertyReference] = useState('');

  const { reset } = useFormContext();

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
          property.amenities.forEach(amenity => {
            if (amenity.amenityType) {
              amenitiesObj[amenity.amenityType] = {
                active: amenity.active || false,
                iconId: amenity.iconId || null
              };
            }
          });


          const highlightsObj = {};
          property.highlights.forEach(highlight => {
            if (highlight.highlightType) {
              highlightsObj[highlight.highlightType] = {
                active: highlight.active || false,
                iconId: highlight.iconId || null
              };
            }
          });

          // แสดงข้อมูล facilities ที่ได้จาก API เพื่อดูโครงสร้าง


          const facilityIcons = {
            'common-area': {},
            'dining': {},
            'fitness': {},
            'pool': {},
            'other': {}
          };

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

          



          const viewsObj = {};
          property.views.forEach(view => {
            if (view.viewType) {
              viewsObj[view.viewType] = {
                active: view.active || false,
                iconId: view.iconId || null
              };
            }
          });

          const nearbyObj = {};
          property.nearbyPlaces.forEach(nearby => {
            if (nearby.nearbyType) {
              nearbyObj[nearby.nearbyType] = {
                active: nearby.active || false,
                iconId: nearby.iconId || null
              };
            }
          });


          const labelObj = {};
          property.labels.forEach(label => {
            if (label.labelType) {
              labelObj[label.labelType] = {
                active: label.active || false,
                iconId: label.iconId || null
              };
            }
          });

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

            // Translations
            translatedTitles: {
              th: property.translatedTitles?.th || '',
              zh: property.translatedTitles?.zh || '',
              ru: property.translatedTitles?.ru || '',
              en: property.translatedTitles?.en || ''
            },
            translatedDescriptions: {
              th: property.translatedDescriptions?.th || '',
              zh: property.translatedDescriptions?.zh || '',
              ru: property.translatedDescriptions?.ru || '',
              en: property.translatedDescriptions?.en || ''
            },
            translatedPaymentPlans: {
              th: property.translatedPaymentPlans?.th || '',
              zh: property.translatedPaymentPlans?.zh || '',
              ru: property.translatedPaymentPlans?.ru || '',
              en: property.translatedPaymentPlans?.en || ''
            },

            // Social Media
            socialMedia: {
              youtubeUrl: property.socialMedia?.youtubeUrl || '',
              tiktokUrl: property.socialMedia?.tiktokUrl || '',
              facebookUrl: property.socialMedia?.facebookUrl || '',
              instagramUrl: property.socialMedia?.instagramUrl || ''
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
              phone: property.contactInfo.phone || '',
              email: property.contactInfo.email || '',
              line: property.contactInfo.instagram || '',
              whatsapp: property.contactInfo.whatsapp || '',
              wechatId: property.contactInfo.wechatId || '',
              secondaryPhone: property.contactInfo.secondaryPhone || '',
              lineId: property.contactInfo.lineId || '',
              facebookMessenger: property.contactInfo.facebookMessenger || '',
              instagram: property.contactInfo.instagram || ''
            },

            // Status
            status: property.status || 'AVAILABLE',

            // Dates
            availableFrom: property.availableFrom ? new Date(property.availableFrom) : null,
            availableTo: property.availableTo ? new Date(property.availableTo) : null,

            // Agent info
            agentId: property.agentId || '',
            createdBy: property.createdBy || '',
            updatedBy: property.updatedBy || '',
          };

          if (property.status === 'RENT' || property.status === 'SALE_RENT') {
            propertyData.price = property.listings.find(l => l.listingType === 'SALE')?.price || 0;
            propertyData.promotionalPrice = property.listings.find(l => l.listingType === 'SALE')?.promotionalPrice || 0;
            propertyData.rentalPrice = property.listings.find(l => l.listingType === 'RENT')?.price || 0;
            propertyData.shortTerm3Months = property.listings.find(l => l.listingType === 'RENT')?.shortTerm3Months || 0;
            propertyData.shortTerm6Months = property.listings.find(l => l.listingType === 'RENT')?.shortTerm6Months || 0;
            propertyData.shortTerm1Year = property.listings.find(l => l.listingType === 'RENT')?.shortTerm1Year || 0;
          }
          else {
            propertyData.price = property.listings.find(l => l.listingType === 'SALE')?.price || 0;
            propertyData.promotionalPrice = property.listings.find(l => l.listingType === 'SALE')?.promotionalPrice || 0;
          }
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
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading property data...</p>
      </div>
    );
  }

  return (
    <div className="property-form-container">
      {/* Property Reference Display */}
      {propertyReference && (
        <div className="alert alert-info mb-4">
          <strong>Property Reference:</strong> {propertyReference}
        </div>
      )}

      {/* View-only notice */}
      <div className="alert alert-warning mb-4">
        <i className="fas fa-eye me-2"></i>
        <strong>View Mode:</strong> This property is displayed in read-only mode. All fields are disabled.
      </div>

      {/* Form Sections - All in read-only mode */}
      <ListingTypeSection type="view" />
      <PropertyTypeSection type="view" />
      <PropertyInfoSection type="view" />
      <PropertyDetailSection type="view" />
      <LocationSection type="view" />
      <PricingSection type="view" />
      <PropertyDescriptionSection type="view" />
      <FeaturesSection type="view" />
      <FacilitiesSection type="view" />
      <PropertyHighlightsSection type="view" />
      <NearbySection type="view" />
      <ViewSection type="view" />
      <PhotosSection type="view" />
      <FloorPlanSection type="view" />
      <UnitPlanSection type="view" />
      <SocialMediaSection type="view" />
      <ContactSection type="view" />

      {/* No Save Button - View Only */}
      <div className="form-actions mt-4 text-center">
        <button 
          type="button" 
          className="btn btn-secondary btn-lg"
          onClick={() => router.back()}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Properties
        </button>
      </div>
    </div>
  );
};

export default ViewPropertyForm;
