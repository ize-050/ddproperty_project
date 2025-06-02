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
import usePropertyFormStore from '@/store/propertyFormStore';
import '@/styles/backoffice/add-property.scss';
import '@/styles/backoffice/form-validation.css';

const AddNewProperty = () => {
  const router = useRouter();
  const t = useTranslations('AddProperty');
  const { formData, propertyImages, floorPlanImages, unitPlanImages, setFormData, resetForm } = usePropertyFormStore();
  const [validationSummary, setValidationSummary] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoadingNextCode, setIsLoadingNextCode] = useState(true);
  
  // Initialize React Hook Form with Yup schema validation
  const methods = useForm({
    resolver: yupResolver(propertyFormSchemaBasic),
    defaultValues: formData,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const { handleSubmit, formState: { errors, isDirty }, watch, trigger, setError, getValues, reset } = methods;

  // Sync form values with Zustand store when form values change
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // Only update specific field that changed to avoid full form reset
      if (name && type === 'change') {
        setFormData({ ...formData, [name]: value[name] });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, formData, setFormData]);

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
    try {
      setValidationSummary([]);
      setFormSubmitted(false);

      
      // แสดงข้อความกำลังบันทึกข้อมูล
      const loadingToast = toast.loading(t('savingData'));
      
      // สร้าง FormData object สำหรับส่งข้อมูลและรูปภาพ
      const formDataObj = new FormData();
      
      // เพิ่มข้อมูลพื้นฐานลงใน FormData
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
          // แปลง object เป็น JSON string
          formDataObj.append(key, JSON.stringify(value));
        } else {
          formDataObj.append(key, value);
        }
      }
      
      // แปลงชื่อฟิลด์ให้ตรงกับ backend
      formDataObj.append('title', data.propertyTitle);
      formDataObj.append('zipCode', data.postalCode);
      
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
      
      // ปิด loading toast
      toast.dismiss(loadingToast);
      
      // เมื่อใช้ axios ไม่ต้องตรวจสอบ response.ok และไม่ต้องเรียก response.json()
      // axios จะจัดการการแปลงข้อมูล JSON ให้โดยอัตโนมัติ
      const result = response.data;
      
      // แสดงข้อความสำเร็จ
      toast.success(t('dataSavedSuccessfully'));
      
      // รีเซ็ตฟอร์ม
      // resetForm();
      
      // Redirect to my properties page after submission
      setTimeout(() => {
        router.push('/backoffice/my-properties');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // ปิด loading toast ถ้ายังแสดงอยู่
      toast.dismiss(loadingToast);
      
      // จัดการ error จาก axios ซึ่งมีรูปแบบต่างจาก fetch
      if (error.response) {
        // ได้รับการตอบสนองจากเซิร์ฟเวอร์แต่มีข้อผิดพลาด (status code ไม่อยู่ในช่วง 2xx)
        console.log('Response data:', error.response.data);
        console.log('Status code:', error.response.status);
        
        // ตรวจสอบว่ามีข้อมูล validation errors หรือไม่
        if (error.response.data && error.response.data.errors) {
          // มี validation errors จาก backend
          const validationErrors = error.response.data.errors;
          
          // แสดงข้อความ error ทั้งหมด
          let errorMessage = t('invalidData') + ':\n';
          
          // ถ้าเป็น array ของ errors
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach((err, index) => {
              errorMessage += `${index + 1}. ${err.msg || err.message}\n`;
            });
          } else {
            // ถ้าเป็น object ของ errors แยกตามฟิลด์
            Object.keys(validationErrors).forEach(field => {
              const fieldError = validationErrors[field];
              if (typeof fieldError === 'string') {
                errorMessage += `- ${field}: ${fieldError}\n`;
              } else if (Array.isArray(fieldError)) {
                fieldError.forEach(err => {
                  errorMessage += `- ${field}: ${err.msg || err.message || err}\n`;
                });
              }
            });
          }
          
          toast.error(errorMessage);
          
          // แสดงข้อมูล validation errors ใน console เพื่อ debug
          console.log('Validation errors:', validationErrors);
        } else if (error.response.status === 401) {
          toast.error(t('notAuthorized'));
        } else {
          // ข้อผิดพลาดอื่นๆ จาก API
          toast.error(error.response.data.message || t('errorSavingData'));
        }
      } else if (error.request) {
        // ส่งคำขอไปแล้วแต่ไม่ได้รับการตอบสนอง
        console.log('Request was made but no response was received:', error.request);
        toast.error(t('cannotConnectToAPI'));
      } else {
        // ข้อผิดพลาดอื่นๆ
        console.log('Error:', error.message);
        toast.error(error.message || t('errorSavingData'));
      }
      
      // เพิ่มข้อมูลเพื่อ debug
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); 
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
    <BackofficeLayout>
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
          <ListingTypeSection />
          <PropertyTypeSection />
          <PropertyInfoSection />
          <PropertyDetailSection />
         
          <LocationSection />
          <PricingSection />
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
            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
              {t('cancel')}
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
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
              {t('save')}
            </button>
          </div>
        </form>
        </FormProvider>
      </div>
    </BackofficeLayout>
  );
};

export default AddNewProperty;
