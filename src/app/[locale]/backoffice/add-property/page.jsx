'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import ListingTypeSection from '@/components/backoffice/property/ListingTypeSection';
import PropertyTypeSection from '@/components/backoffice/property/PropertyTypeSection';
import PropertyInfoSection from '@/components/backoffice/property/PropertyInfoSection';
import LocationSection from '@/components/backoffice/property/LocationSection';
import PricingSection from '@/components/backoffice/property/PricingSection';
import FeaturesSection from '@/components/backoffice/property/FeaturesSection';
import PropertyHighlightsSection from '@/components/backoffice/property/PropertyHighlightsSection';
import MoreRoomTypeSection from '@/components/backoffice/property/MoreRoomTypeSection';
import NearbySection from '@/components/backoffice/property/NearbySection';
import ViewSection from '@/components/backoffice/property/ViewSection';
import FacilitiesSection from '@/components/backoffice/property/FacilitiesSection';
import PropertyDescriptionSection from '@/components/backoffice/property/PropertyDescriptionSection';
import PropertyDetailSection from '@/components/backoffice/property/PropertyDetailSection';
import { propertyFormSchemaBasic } from '@/validations/propertyFormSchema';

import PhotosSection from '@/components/backoffice/property/PhotosSection';
import FloorPlanSection from '@/components/backoffice/property/FloorPlanSection';
import UnitPlanSection from '@/components/backoffice/property/UnitPlanSection';
import SocialMediaSection from '@/components/backoffice/property/SocialMediaSection';
import ContactSection from '@/components/backoffice/property/ContactSection';
import CoAgentSection from '@/components/backoffice/property/CoAgentSection';
import { useLocale } from 'next-intl';
import usePropertyFormStore from '@/store/propertyFormStore';
import '@/styles/backoffice/add-property.scss';
import '@/styles/backoffice/form-validation.css';

//lib
import Swal from 'sweetalert2';

const AddNewProperty = () => {
  const router = useRouter();
  const t = useTranslations('AddProperty');
  const { formData, propertyImages, floorPlanImages, unitPlanImages, setFormData, resetForm } = usePropertyFormStore();
  const [validationSummary, setValidationSummary] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoadingNextCode, setIsLoadingNextCode] = useState(true);
  const [saving, setSaving] = useState(false);
  const locale = useLocale();

  // Initialize React Hook Form with Yup schema validation
  const methods = useForm({
    resolver: yupResolver(propertyFormSchemaBasic),
    defaultValues: formData,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const { handleSubmit, formState: { errors, isDirty }, watch, trigger, setError, getValues, reset } = methods;
  const watchedStatus = watch('status');

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // Only update specific field that changed to avoid full form reset
      if (name && type === 'change') {
        setFormData({ ...formData, [name]: value[name] });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, formData, setFormData]);



  useEffect(() => {
    reset();
    setFormData({});
    resetForm();
  }, []);



  // Update validation summary whenever errors change
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
  }, [errors, formSubmitted]);

  // Force validation on all fields when form is submitted
  useEffect(() => {
    if (formSubmitted) {
      trigger();
    }
  }, [formSubmitted, trigger]);

  // Fetch next property code when page loads
  useEffect(() => {
    const fetchNextPropertyCode = async () => {
      try {
        setIsLoadingNextCode(true);

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
          // Set the property ID in the form and store
          setFormData({ ...formData, propertyId: data.propertyCode });
          methods.setValue('propertyId', data.propertyCode);
          console.log('Next property code set:', data.propertyCode);
        }
      } catch (error) {
        console.error('Error fetching next property code:', error);
        toast.error(t('errorFetchingPropertyCode'));
      } finally {
        setIsLoadingNextCode(false);
      }
    };

    fetchNextPropertyCode();
  }, []);

  const onSubmit = async (data) => {
    console.log('Form Data Received on Submit:', data);
    console.log('Promotional Price Value:', data.promotionalPrice);
    try {
      setValidationSummary([]);
      setFormSubmitted(false);
      setSaving(true);

      // แสดงข้ความกำลังบันทึกข้อมูล
      const loadingToast = toast.loading(t('savingData'));

      // สร้าง FormData object สำหรับส่งข้อมูลและรูปภาพ
      const formDataObj = new FormData();

      // ดึงข้อมูลจาก store




      // ลบข้อมูล amenities ฯลฯ ออกจาก data เพื่อไม่ให้ซ้ำซ้อน
      delete data.amenities;
      delete data.highlights;
      delete data.nearby;
      delete data.views;
      delete data.facilities;
      delete data.propertyLabels;

      delete data.socialMedia;

      // Exclude co-agent fields from general loop to avoid duplication
      const excludeFields = ['coAgentAccept', 'commissionType', 'commissionPercent', 'commissionAmount', 'privateNote'];

      // เพิ่มข้อมูลพื้นฐานลงใน FormData
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

      formDataObj.append('facility', JSON.stringify(formData.facility || []));
      formDataObj.append('amenities', JSON.stringify(formData.amenities || []));
      formDataObj.append('highlights', JSON.stringify(formData.highlights || []));
      formDataObj.append('nearby', JSON.stringify(formData.nearby || []));
      formDataObj.append('views', JSON.stringify(formData.views || []));
      formDataObj.append('facilities', JSON.stringify(formData.facilities || []));
      formDataObj.append('labels', JSON.stringify(formData.propertyLabels || []));
      formDataObj.append('socialMedia', JSON.stringify(formData.socialMedia || []));

      // แปลงชื่อฟิลด์ให้ตรงกับ backend
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

      // เพิ่มรูปภาพหลักลงใน FormData
      propertyImages.forEach((image, index) => {
        if (image.file) {
          formDataObj.append('images', image.file);
        }
      });

      // เพิ่มรูปภาพ Floor Plan ลงใน FormData
      floorPlanImages.forEach((image, index) => {
        if (image.file) {
          formDataObj.append('floorPlanImages', image.file);
        }
      });

      // เพิ่มรูปภาพ Unit Plan ลงใน FormData
      unitPlanImages.forEach((image, index) => {
        if (image.file) {
          formDataObj.append('unitPlanImages', image.file);
        }
      });


      // ส่งข้อมูลไปยัง API endpoint
      // ดึง token จาก localStorage หรือ cookie
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('token');

      console.log('Sending data to API...', { formDataSize: [...formDataObj.entries()].length });

      // ใช้ URL ที่ถูกต้องสำหรับ backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/properties`, formDataObj, {
        headers: {
          // ไม่ต้องกำหนด Content-Type เพราะ browser จะกำหนดให้อัตโนมัติเมื่อใช้ FormData
          'Authorization': `Bearer ${token}`,
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY
        }
      });


      // รีเซ็ตฟอร์ม
      reset();
      setFormData({});
      setSaving(false);

      if (response.data.status === 'success') {
        console.log('Property created successfully:', response.data);
        // แสดง dialog ถามว่าต้องการไปที่หน้ารายการอสังหาฯ หรือไม่
        Swal.fire({
          title: 'Property Added!',
          html: `<div class="text-center">${'The property has been successfully added.'}</div>`,
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
        console.log('Failed to create property:', response);
        throw new Error(response.message || 'Failed to create property');
      }

    } catch (error) {
      console.error('Error creating property:', error);
      setSaving(false);

      // Check if it's an image limit error
      if (error.response?.data?.error === 'IMAGE_LIMIT_EXCEEDED') {
        Swal.fire({
          icon: 'warning',
          title: 'จำนวนรูปภาพเกินกำหนด',
          text: 'จำนวนรูปภาพเกิน 50 รูป กรุณาเลือกรูปภาพไม่เกิน 50 รูป',
          confirmButtonText: 'ตกลง'
        });
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        text: error.response?.data?.message || error.response?.data?.error || error.message || t('errorSavingData'),
        footer: error.response?.data?.errors ? `<pre>${JSON.stringify(error.response.data.errors, null, 2)}</pre>` : ''
      }).then(() => {
        // window.location.reload();
      });

    }
  };

  // Handle form errors and scroll to the first error
  const onError = (errors) => {
    console.log('Form validation errors:', errors);
    setFormSubmitted(true);

    // Create validation summary
    const errorMessages = [];
    Object.entries(errors).forEach(([key, error]) => {
      if (error.message) {
        errorMessages.push(error.message);
      }
    });
    setValidationSummary(errorMessages);

    // Force trigger validation on all fields to show all errors
    trigger();

    // Show error message
    alert(t('pleaseFillInAllRequiredFields'));

    // Scroll to validation summary
    const validationSummaryElement = document.getElementById('validation-summary');
    if (validationSummaryElement) {
      validationSummaryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="add-property-container">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>{t('addNewProperty')}</h1>
            <p>{t('createPropertyDetails')}</p>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        {validationSummary.length > 0 && (
          <div id="validation-summary" className="validation-summary">
            <h4>{t('pleaseCorrectTheFollowingErrors')}:</h4>
            <ul>
              {validationSummary.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <ListingTypeSection type={"add"} />
          <PropertyTypeSection />
          <PropertyInfoSection />


          <LocationSection />
          <PricingSection />
          <PropertyDetailSection watchedStatus={watchedStatus} />


          <MoreRoomTypeSection />
          <PropertyHighlightsSection />
          <NearbySection />
          <ViewSection />
          <FacilitiesSection />
          <FeaturesSection />
          <PropertyDescriptionSection />

          <PhotosSection />
          <FloorPlanSection />
          <UnitPlanSection />
          <SocialMediaSection />
          <ContactSection />
          <CoAgentSection />

          {/* Terms & Conditions */}
          <section className="form-section">
            <div className="terms-container">
              <input
                type="checkbox"
                id="termsAgree"
                {...methods.register('termsAgree', { required: t('youMustAgreeToTheTerms') })}
              />
              <label htmlFor="termsAgree">{t('iConfirmThatAllInformationProvidedIsAccurateAndIHaveRightsToListThisProperty')}</label>
              {methods.formState.errors.termsAgree && (
                <p className="error-message">{methods.formState.errors.termsAgree.message}</p>
              )}
            </div>
          </section>

          {/* Form Validation Errors Summary */}
          {Object.keys(methods.formState.errors).length > 0 && (
            <section className="form-section error-summary">
              <h3>{t('pleaseCorrectTheFollowingErrors')}:</h3>
              <ul>
                {Object.entries(methods.formState.errors).map(([field, error]) => (
                  <li key={field}>{error.message}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Form Buttons */}
          <div className="form-buttons">

            <button
              type="button"
              className="btn btn-primary"
              disabled={saving}
              onClick={() => {
                // Set form as submitted to show all validation errors
                setFormSubmitted(true);

                // Force validate all fields
                trigger().then(isValid => {
                  if (isValid) {
                    handleSubmit(onSubmit)();
                  } else {
                    // Show error message
                    alert(t('pleaseFillInAllRequiredFields'));

                    // Add red border to all required fields that are empty
                    // ProjectInfoSection


                    if (!getValues('projectName')) {
                      document.getElementById('projectName').style.border = '2px solid #dc3545';
                    }
                    if (!getValues('area')) {
                      document.getElementById('area').style.border = '2px solid #dc3545';
                    }

                    // LocationSection
                    if (!getValues('address')) {
                      document.getElementById('address').style.border = '2px solid #dc3545';
                    }
                    if (!getValues('city')) {
                      document.getElementById('city').style.border = '2px solid #dc3545';
                    }
                    if (!getValues('district')) {
                      document.getElementById('district').style.border = '2px solid #dc3545';
                    }
                    if (!getValues('subdistrict')) {
                      document.getElementById('subdistrict').style.border = '2px solid #dc3545';
                    }
                    if (!getValues('postalCode')) {
                      document.getElementById('postalCode').style.border = '2px solid #dc3545';
                    }

                    // PricingSection
                    if (!getValues('price')) {
                      document.getElementById('price').style.border = '2px solid #dc3545';
                    }

                    // ContactSection
                    if (!getValues('contactInfo.phone')) {
                      document.getElementById('phone').style.border = '2px solid #dc3545';
                    }
                    if (!getValues('contactInfo.email')) {
                      document.getElementById('email').style.border = '2px solid #dc3545';
                    }

                    // PropertyDescriptionSection
                    if (!getValues('propertyTitle')) {
                      document.getElementById('propertyTitle').style.border = '2px solid #dc3545';
                    }
                    if (!getValues('description')) {
                      document.getElementById('description').style.border = '2px solid #dc3545';
                    }
                  }
                });
              }}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {t('saving')}
                </>
              ) : t('saveProperty')}
            </button>

            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
              {t('cancel')}
            </button>

          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddNewProperty;
