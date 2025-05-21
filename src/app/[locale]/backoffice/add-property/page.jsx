'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';
import axios from 'axios';
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
  const { formData, propertyImages, floorPlanImages, unitPlanImages, setFormData, resetForm } = usePropertyFormStore();
  const [validationSummary, setValidationSummary] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
    const subscription = watch((value) => {
      // Only update the store if values have changed
      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormData(value);
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

  const onSubmit = async (data) => {
    try {
      setValidationSummary([]);
      setFormSubmitted(false);
      
      // แสดงข้อความกำลังบันทึกข้อมูล
      const loadingToast = toast.loading('กำลังบันทึกข้อมูล...');
      
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
      
      // แปลง features, highlights, nearby, views, facilities เป็นรูปแบบที่ backend ต้องการ
      // Features
      const featuresArray = [];
      for (const [key, value] of Object.entries(data.features)) {
        if (value === true) {
          featuresArray.push({ name: key, value: 'true' });
        }
      }
      formDataObj.append('features', JSON.stringify(featuresArray));
      
      // Highlights
      const highlightsArray = [];
      for (const [key, value] of Object.entries(data.highlights)) {
        if (value === true) {
          highlightsArray.push(key.toUpperCase());
        }
      }
      formDataObj.append('highlights', JSON.stringify(highlightsArray));
      
      // Nearby
      const nearbyArray = [];
      for (const [key, value] of Object.entries(data.nearby)) {
        if (value === true) {
          nearbyArray.push({ type: key.toUpperCase(), distance: null });
        }
      }
      formDataObj.append('nearby', JSON.stringify(nearbyArray));
      
      // Views
      const viewsArray = [];
      for (const [key, value] of Object.entries(data.views)) {
        if (value === true) {
          viewsArray.push(key.toUpperCase());
        }
      }
      formDataObj.append('views', JSON.stringify(viewsArray));
      
      // Facilities
      const facilitiesArray = [];
      for (const category of ['fitnessSports', 'commonAreas', 'poolsSpaRelaxation', 'diningEntertainmentLeisure', 'other']) {
        if (data.facilities && data.facilities[category]) {
          for (const [key, value] of Object.entries(data.facilities[category])) {
            if (value === true) {
              facilitiesArray.push({
                type: key.toUpperCase(),
                category: category.toUpperCase()
              });
            }
          }
        }
      }
      formDataObj.append('facilities', JSON.stringify(facilitiesArray));
      
      // ส่งข้อมูลไปยัง API endpoint
      // ดึง token จาก localStorage หรือ cookie
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('token');
      
      console.log('Sending data to API...', { formDataSize: [...formDataObj.entries()].length });
      
      // ใช้ URL ที่ถูกต้องสำหรับ backend API
      // อาจต้องเปลี่ยนเป็น URL ที่ถูกต้องของ backend
      // ตรวจสอบว่า backend ทำงานอยู่ที่ port 5001 หรือไม่
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/properties`, formDataObj, {
        headers: {
          // ไม่ต้องกำหนด Content-Type เพราะ browser จะกำหนดให้อัตโนมัติเมื่อใช้ FormData
          'Authorization': `Bearer ${token}` 
        },
        credentials: 'include' // ส่ง cookies ไปด้วย (ถ้าใช้ cookie-based authentication)
      });
      
      // ปิด loading toast
      toast.dismiss(loadingToast);
      
      // เมื่อใช้ axios ไม่ต้องตรวจสอบ response.ok และไม่ต้องเรียก response.json()
      // axios จะจัดการการแปลงข้อมูล JSON ให้โดยอัตโนมัติ
      const result = response.data;
      
      // แสดงข้อความสำเร็จ
      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว');
      
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
          let errorMessage = 'ข้อมูลไม่ถูกต้อง:\n';
          
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
          toast.error('ไม่ได้รับอนุญาตให้เข้าถึง API กรุณาเข้าสู่ระบบใหม่');
        } else {
          // ข้อผิดพลาดอื่นๆ จาก API
          toast.error(error.response.data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
      } else if (error.request) {
        // ส่งคำขอไปแล้วแต่ไม่ได้รับการตอบสนอง
        console.log('Request was made but no response was received:', error.request);
        toast.error('ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาตรวจสอบว่า backend server ทำงานอยู่หรือไม่');
      } else {
        // ข้อผิดพลาดอื่นๆ
        console.log('Error:', error.message);
        toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
      
      // เพิ่มข้อมูลเพื่อ debug
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'); 
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
    alert('Please fill in all required fields');
    
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
              <h1>Add/New Property</h1>
              <p>create property details</p>
            </div>
          </div>
        </div>

        <FormProvider {...methods}>
          {validationSummary.length > 0 && (
            <div id="validation-summary" className="validation-summary">
              <h4>Please correct the following errors:</h4>
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
                {...methods.register('termsAgree', { required: 'You must agree to the terms' })} 
              />
              <label htmlFor="termsAgree">I confirm that all information provided is accurate and I have rights to list this property</label>
              {methods.formState.errors.termsAgree && (
                <p className="error-message">{methods.formState.errors.termsAgree.message}</p>
              )}
            </div>
          </section>

          {/* Form Validation Errors Summary */}
          {Object.keys(methods.formState.errors).length > 0 && (
            <section className="form-section error-summary">
              <h3>Please correct the following errors:</h3>
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
              Cancel
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
                    alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
                    
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
              Save
            </button>
          </div>
        </form>
        </FormProvider>
      </div>
    </BackofficeLayout>
  );
};

export default AddNewProperty;
