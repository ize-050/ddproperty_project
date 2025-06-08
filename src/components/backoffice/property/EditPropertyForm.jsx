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

// Store and API
import usePropertyFormStore from '@/store/propertyFormStore';

const EditPropertyForm = ({ propertyId }) => {
  const router = useRouter();
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

  console.log("GetPropertyForm propertyId:", propertyId)
  
  const [validationSummary, setValidationSummary] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { handleSubmit, formState: { errors }, trigger, reset } = useFormContext();
  
  // ดึงข้อมูล Property เดิมเมื่อโหลด component
  useEffect(() => {

    console.log("GetPropertyId ",propertyId)
    const fetchPropertyData = async () => {
      if (!propertyId) return;
      
      try {
        setIsLoading(true);
        
        // ดึง token
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('token');
        
        // เรียก API เพื่อดึงข้อมูล property
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
          console.log('Facilities from API:', property.facilities);
          
          // สร้างโครงสร้างตามที่ FacilitiesSection คาดหวัง
          const facilitiesObj = {
            'common-area': {},
            'dining': {},
            'fitness': {},
            'pool': {},
            'other': {}
          };
          
          property.facilities.forEach(facility => {
            if (facility.facilityType) {
              // กำหนด category จากข้อมูล หรือใช้ default เป็น 'other'
              const category = facility.category || 
                                 (facility.facilityType.includes('pool') ? 'pool' :
                                     facility.facilityType.includes('restaurant') ? 'restaurant' :
                                         facility.facilityType.includes('fitness') ? 'fitness' :
                                  facility.facilityType.includes('dining') ? 'dining' :
                                  facility.facilityType.includes('common') ? 'common-area' :
                                  'other');
              
              // เพิ่มข้อมูลลงในโครงสร้าง nested ตาม category
              facilitiesObj[category][facility.facilityType] = {
                active: facility.active === true,
                iconId: facility.iconId || null
              };
            }
          });

          console.log('Formatted facilities:', facilitiesObj);

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
            propertyId: property.propertyId || property.id,
            propertyCode: property.propertyCode,
            projectName: property.projectName || '',
            referenceId: property.referenceId || '',
            propertyTitle: property.propertyTitle || property.title || '',
            propertyType: property.propertyType || '',
            listingType: property.listingType || 'SALE',
            description: property.description || '',
            paymentPlan: property.paymentPlan || '',

            // Translations
            translatedTitles: {
              th: property.translatedTitles?.th || '',
              zh: property.translatedTitles?.zh || '',
              ru: property.translatedTitles?.ru || ''
            },
            translatedDescriptions: {
              th: property.translatedDescriptions?.th || '',
              zh: property.translatedDescriptions?.zh || '',
              ru: property.translatedDescriptions?.ru || ''
            },
            translatedPaymentPlans: {
              th: property.translatedPaymentPlans?.th || '',
              zh: property.translatedPaymentPlans?.zh || '',
              ru: property.translatedPaymentPlans?.ru || ''
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
            ownershipQuota : property.ownershipQuota || '',
            province: property.province || '',
            usableArea:property.usableArea || '',
            landSize: property.landSize || '',
            landArea: property.landArea || '',
            direction: property.direction || '',
            road: property.road || '',
            property_code : property.propertyCode || '',
            building: property.building || '',
            floors: property.floors || '',
            furnishing: property.furnishing || '',
            constructionYear: property.constructionYear || '',
            communityFees  : property.communityFee || '',
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
            pricePerSqm: property.pricePerSqm || '',
            
            // เตรียมข้อมูลสำหรับ components ต่างๆ
            // สำคัญมาก: ชื่อฟิลด์เหล่านี้ต้องตรงกับที่ components ต่างๆ คาดหวัง
            
            // Features (Amenities)
            amenities: amenitiesObj,
            propertyLabels: labelObj,

            // Facilities
            facilities:facilitiesObj, // Clone the object to avoid modifying the original facilitiesObj,

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

          if(property.status === 'RENT' || property.status === 'SALE_RENT') {
            propertyData.rentalPrice = property.listings.find(l => l.listingType === 'RENT')?.price || 0;
            propertyData.shortTerm3Months = property.listings.find(l => l.listingType === 'RENT')?.shortTerm3Months || 0;
            propertyData.shortTerm6Months = property.listings.find(l => l.listingType === 'RENT')?.shortTerm6Months || 0;
            propertyData.shortTerm1Year = property.listings.find(l => l.listingType === 'RENT')?.shortTerm1Year || 0;
          }
          else{
            propertyData.price = property.listings.find(l => l.listingType === 'SALE')?.price || 0;
          }
          // เซ็ตค่า form data ใน store
          setFormData(propertyData);
          
          // เซ็ตค่า form data ใน React Hook Form
          reset(propertyData);
          
          // ตั้งค่ารูปภาพ property (ถ้ามี)
          if (property.images && property.images.length > 0) {
            const formattedImages = property.images.map(img => ({
              id: String(img.id || Math.random().toString()),
              url: process.env.NEXT_PUBLIC_IMAGE_URL + img.url ||  process.env.NEXT_PUBLIC_IMAGE_URL + img.imageUrl,
              isFeatured: img.isFeatured || false,
              sortOrder: img.sortOrder || 0,
              file: null, // ไม่มีไฟล์เพราะเป็นการ load รูปที่มีอยู่แล้ว
              isExisting: true // เพิ่ม flag เพื่อบอกว่าเป็นรูปที่มีอยู่แล้ว
            })).sort((a, b) => a.sortOrder - b.sortOrder);

            console.log('formattedImages:', formattedImages);
            addPropertyImages(formattedImages);
          }
          
          // ตั้งค่ารูปภาพ floor plan (ถ้ามี)
          if (property.floorPlans && property.floorPlans.length > 0) {
            const formattedFloorPlans = property.floorPlans.map(img => ({
              id: String(img.id || Math.random().toString()),
              url: process.env.NEXT_PUBLIC_IMAGE_URL + img.url || process.env.NEXT_PUBLIC_IMAGE_URL + img.imageUrl,
              file: null,
              isExisting: true,
              sortOrder: img.sortOrder || 0,
            })).sort((a, b) => a.sortOrder - b.sortOrder);

            console.log('formattedFloorPlans:', formattedFloorPlans);

            addFloorPlanImages(formattedFloorPlans);
          }
          
          // ตั้งค่ารูปภาพ unit plan (ถ้ามี)
          if (property.unitPlans && property.unitPlans.length > 0) {
            const formattedUnitPlans = property.unitPlans.map(img => ({
              id: String(img.id || Math.random().toString()),
              url: process.env.NEXT_PUBLIC_IMAGE_URL + img.url ||  process.env.NEXT_PUBLIC_IMAGE_URL + img.imageUrl,
              file: null,
              isExisting: true,
              sortOrder: img.sortOrder || 0,
            })).sort((a, b) => a.sortOrder - b.sortOrder);
            addUnitPlanImages(formattedUnitPlans);
          }
          
          console.log('Property data loaded successfully:', propertyData);
        } else {
          throw new Error('Invalid property data format');
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
        toast.error(t('errorFetchingPropertyData') || 'Failed to load property data');
      } finally {
        setIsLoading(false);
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
      setValidationSummary([]);
      setFormSubmitted(false);
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

      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
          // แปลง object เป็น JSON string
          formDataObj.append(key, JSON.stringify(value));
        } else {
          formDataObj.append(key, value);
        }
      }
      
      // ตั้งค่าชื่อฟิลด์ให้ถูกต้องตามที่ backend คาดหวัง
      formDataObj.append('title', data.propertyTitle);
      formDataObj.append('zipCode', data.postalCode);

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
      formDataObj.append('replaceImages', 'true'); // เพิ่ม flag ให้ลบรูปเก่าก่อน
      
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
      formDataObj.append('replaceFloorPlans', 'true'); // เพิ่ม flag ให้ลบรูปเก่าก่อน
      
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
      formDataObj.append('replaceUnitPlans', 'true'); // เพิ่ม flag ให้ลบรูปเก่าก่อน
      
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

      console.log('Sending data to API...', { formDataSize: [...formDataObj.entries()].length });
      
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
        
        // แปลงข้อมูลการตอบกลับเป็น JSON
        const result = await response.json();
        console.log('Property update success:', result);
        
        // แสดงข้อความสำเร็จ
        toast.success(t('propertyUpdateSuccess') || 'Property updated successfully');
        
        // นำทางกลับไปหน้ารายการทรัพย์สิน
        setTimeout(() => {
          router.push('/backoffice/my-properties');
        }, 1500);
      } catch (error) {
        // จัดการข้อผิดพลาด
        console.error('Error updating property:', error);
        toast.dismiss(loadingToast);
        toast.error(error.message || t('errorUpdatingProperty') || 'Failed to update property');
      } finally {
        // ตั้งค่าสถานะการบันทึกเป็น false ไม่ว่าจะสำเร็จหรือไม่ก็ตาม
        setSaving(false);
      }
    } catch (error) {

      toast.error(error.message || t('errorSavingProperty'));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">{t('loadingPropertyData')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      
       Property Form Sections

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
  );
};

export default EditPropertyForm;
