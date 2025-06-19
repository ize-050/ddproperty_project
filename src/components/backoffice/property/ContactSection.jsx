'use client';

import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaLine, FaWeixin, FaWhatsapp, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';
import userService from '@/services/userService';
import { toast } from 'react-toastify';

const ContactSection = () => {
  const { formData } = usePropertyFormStore();
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Watch contact info values for controlled inputs
  const phoneValue = watch('contactInfo.phone');
  const emailValue = watch('contactInfo.email');
  
  // CSS class for error styling
  const getInputClassName = (fieldName) => {
    return `form-control ${errors.contactInfo?.[fieldName] ? 'is-invalid' : ''}`;
  };
  
  const handleUseProfileData = async (e) => {
    const { checked } = e.target;
    if (checked) {
      setLoadingProfile(true);
      try {
        // ดึงข้อมูล profile จาก API
        const response = await userService.getMyProfile();
        const userData = response.data;
        
        console.log("userData", userData)
        // ใส่ข้อมูลลงในฟอร์ม
        if (userData.phone) {
          setValue('contactInfo.phone', userData.phone);
        }
        if (userData.email) {
          setValue('contactInfo.email', userData.email);
        }
        if (userData?.line) {
          setValue('contactInfo.lineId', userData.line);
        }
        if (userData?.wechat) {
          setValue('contactInfo.wechatId', userData.wechat);
        }
        if (userData?.whatsapp) {
          setValue('contactInfo.whatsapp', userData.whatsapp);
        }
        if (userData?.facebook) {
          setValue('contactInfo.facebookMessenger', userData.facebook);
        }
        if (userData?.instagram) {
          setValue('contactInfo.instagram', userData.instagram);
        }
        if (userData?.phoneAlt){
          setValue('contactInfo.secondaryPhone', userData.phoneAlt);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Failed to load profile data');
        // Uncheck the checkbox if failed
        e.target.checked = false;
      } finally {
        setLoadingProfile(false);
      }
    } else {
      // Clear form fields when unchecked
      setValue('contactInfo.phone', '');
      setValue('contactInfo.email', '');
      setValue('contactInfo.lineId', '');
      setValue('contactInfo.wechatId', '');
      setValue('contactInfo.whatsapp', '');
      setValue('contactInfo.facebookMessenger', '');
      setValue('contactInfo.instagram', '');
    }
  };

  return (
    <section className="form-section contact-section">
      <h2 className="section-title">
        <FaEnvelope className="section-icon" /> Contact
      </h2>
      
      <div className="use-profile-data">
        <input
          type="checkbox"
          id="useProfileData"
          onChange={handleUseProfileData}
          disabled={loadingProfile}
        />
        <label htmlFor="useProfileData" className="form-label"
        style={{
          fontSize:'1rem',
          fontWeight:500,
          color:'#222',
          letterSpacing:0.2,
          marginLeft:'10px',
          marginBottom:"30px"
        }}
        >
          {loadingProfile ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Loading profile data...
            </>
          ) : (
            'Use data from profile'
          )}
        </label>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Tel. (Main)*
          </label>
          <input
            type="tel"
            id="phone"
            className={`form-control ${errors.contactInfo?.phone ? 'is-invalid' : ''}`}
            {...register('contactInfo.phone')}
          />
          {errors.contactInfo?.phone && (
            <div className="invalid-feedback">{errors.contactInfo.phone.message}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="secondaryPhone" className="form-label">
            Tel. (secondary) (optional)
          </label>
          <input
            type="tel"
            id="secondaryPhone"
            className="form-control"
            {...register('contactInfo.secondaryPhone')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            E-mail*
          </label>
          <input
            type="email"
            id="email"
            className={`form-control ${errors.contactInfo?.email ? 'is-invalid' : ''}`}
            {...register('contactInfo.email')} 
          />
          {errors.contactInfo?.email && (
            <div className="invalid-feedback">{errors.contactInfo.email.message}</div>
          )}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="lineId" className="form-label">
            <FaLine className="icon-line" color="#00B900" /> LINE ID (optional)
          </label>
          <input
            type="text"
            id="lineId"
            className="form-control"
            defaultValue={formData.contactInfo?.lineId || ''}
            {...register('contactInfo.lineId')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="wechatId" className="form-label">
            <FaWeixin className="icon-wechat" color="#00B900" /> Wechat ID (optional)
          </label>
          <input
            type="text"
            id="wechatId"
            className="form-control"
            defaultValue={formData.contactInfo?.wechatId || ''}
            {...register('contactInfo.wechatId')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="whatsapp" className="form-label">
            <FaWhatsapp className="icon-whatsapp" color="#00B900" /> WhatsApp (optional)
          </label>
          <input
            type="text"
            id="whatsapp"
            className="form-control"
            defaultValue={formData.contactInfo?.whatsapp || ''}
            {...register('contactInfo.whatsapp')}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="facebookMessenger" className="form-label">
            <FaFacebookMessenger className="icon-messenger" /> Facebook Messenger
          </label>
          <input
            type="text"
            id="facebookMessenger"
            className="form-control"
            defaultValue={formData.contactInfo?.facebookMessenger || ''}
            {...register('contactInfo.facebookMessenger')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="instagram" className="form-label">
            <FaInstagram className="icon-instagram" /> Instagram
          </label>
          <input
            type="text"
            id="instagram"
            className="form-control"
            defaultValue={formData.contactInfo?.instagram || ''}
            {...register('contactInfo.instagram')}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
