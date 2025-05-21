'use client';

import React from 'react';
import { FaEnvelope, FaPhone, FaLine, FaWeixin, FaWhatsapp, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';

const ContactSection = () => {
  const { formData } = usePropertyFormStore();
  const { register, formState: { errors }, setValue } = useFormContext();
  
  // CSS class for error styling
  const getInputClassName = (fieldName) => {
    return `form-control ${errors[`contactInfo.${fieldName}`] ? 'is-invalid' : ''}`;
  };
  
  const handleUseProfileData = (e) => {
    const { checked } = e.target;
    if (checked) {
      // ในกรณีจริงควรดึงข้อมูลจาก profile ของผู้ใช้
      // นี่เป็นเพียงตัวอย่าง
      setValue('contactInfo.phone', '0812345678');
      setValue('contactInfo.email', 'example@email.com');
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
        />
        <label htmlFor="useProfileData">use data from profile</label>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Tel. (Main)*
          </label>
          <input
            type="tel"
            id="phone"
            className={`form-control ${errors['contactInfo.phone'] ? 'is-invalid' : ''}`}
            defaultValue={formData.contactInfo?.phone || ''}
            {...register('contactInfo.phone', { required: 'Main telephone number is required' })}
          />
          {errors['contactInfo.phone'] && (
            <div className="invalid-feedback">{errors['contactInfo.phone'].message}</div>
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
            defaultValue={formData.contactInfo?.secondaryPhone || ''}
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
            className={`form-control ${errors['contactInfo.email'] ? 'is-invalid' : ''}`}
            defaultValue={formData.contactInfo?.email || ''}
            {...register('contactInfo.email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors['contactInfo.email'] && (
            <div className="invalid-feedback">{errors['contactInfo.email'].message}</div>
          )}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="lineId" className="form-label">
            <FaLine className="icon-line" /> LINE ID (optional)
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
            <FaWeixin className="icon-wechat" /> Wechat ID (optional)
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
            <FaWhatsapp className="icon-whatsapp" /> WhatsApp (optional)
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
