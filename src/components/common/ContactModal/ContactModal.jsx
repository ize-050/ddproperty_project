'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useDynamicTranslations from '@/hooks/useDynamicTranslations';
import { getMessagingSettings, transformSettingsToObject, generatePlatformLink, getDefaultSettings } from '@/services/messagingSettings';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose, property }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(true);
  const [contactAgent, setContactAgent] = useState(null);
  // Dynamic translations
  const { t } = useDynamicTranslations('listing');


  useEffect(() => {
    if (property?.contactInfo) {
      // ตรวจสอบว่าเป็น string หรือไม่
      if (typeof property.contactInfo === 'string') {
        try {
          setContactAgent(JSON.parse(property.contactInfo));
        } catch (error) {
          console.error('Error parsing contactInfo:', error);
          setContactAgent(null);
        }
      } else {
        // ถ้าไม่ใช่ string ก็ใช้ค่าปกติ
        setContactAgent(property.contactInfo);
      }
    } else {
      setContactAgent(null);
    }
  }, [property?.contactInfo]);


 useEffect(()=>{
  console.log("property12212",property)
 },[property])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await getMessagingSettings();
        const settingsObj = transformSettingsToObject(response.data);

        // Merge with defaults to ensure all platforms have values
        const mergedSettings = { ...getDefaultSettings(), ...settingsObj };
        setSettings(mergedSettings);
      } catch (error) {
        console.error('Failed to fetch messaging settings:', error);
        // Keep default settings on error
        setSettings(getDefaultSettings());
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    if (!property?.id) {
      alert('Property information is missing');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/messages`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          propertyId: property.id
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Message sent successfully!');
        reset(); // Reset form fields
        onClose(); // Close modal after successful submission
      } else {
        alert(`Failed to send message: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-1" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        <div className="modal-header">
          <h3>{t('for-more-information') || 'For More Information'}</h3>

        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input
              type="text"
              placeholder={t('name-placeholder') || 'Name'}
              {...register("name", { required: t('name-required') || "Name is required" })}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-group phone-group">
            <input
              type="email"
              placeholder={t('email-placeholder') || 'Email'}
              {...register("email", {
                required: t('email-required') || "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: t('email-invalid') || "Please enter a valid email"
                }
              })}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          <div className="form-group phone-group">
            <input
              type="tel"
              placeholder={t('phone-placeholder') || 'Phone Number'}
              {...register("phone", {
                required: t('phone-required') || "Phone number is required",
                pattern: {
                  value: /^[0-9]{9,10}$/,
                  message: t('phone-invalid') || "Please enter a valid phone number"
                }
              })}
            />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </div>

          <div className="form-group">
            <textarea
              placeholder={t('message-placeholder') || 'Message'}
              {...register("message", { required: t('message-required') || "Message is required" })}
              rows={4}
            />
            {errors.message && <span className="error">{errors.message.message}</span>}
          </div>

          <button
            type="submit"
            className="send-button"
            disabled={isSubmitting}
          >
            <i className="far fa-comment-dots"></i> {isSubmitting ? (t('sending') || 'Sending...') : (t('send-message') || 'Send Message')}
          </button>
        </form>

        <div className="contact-options">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div className="contact-option-wrapper">
              <a href={contactAgent?.phone ? `tel:${contactAgent.phone.replace(/[^\d+]/g, '')}` : "tel:+66123456789"} className="contact-option phone">
                <i className="fas fa-phone"></i>
              </a>
            </div>

            <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{t('call-now') || 'Call Now'}</span>
          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: '15px'
          }}>
            <div className="contact-option-wrapper">
              <a href={contactAgent?.lineId ? `https://line.me/ti/p/${contactAgent.lineId}` : "#"} className="" target="_blank" rel="noopener noreferrer">
                <img src="/images/new_icons/line.svg" alt="Line" className="social-icon" />
              </a>
            </div>

            <div className="contact-option-wrapper">
              <a href={contactAgent?.wechatId ? `weixin://dl/chat?username=${contactAgent.wechatId}` : "#"} className="" target="_blank" rel="noopener noreferrer">
                <img src="/images/new_icons/wechat.svg" alt="WeChat" className="social-icon" />
              </a>
            </div>

            <div className="contact-option-wrapper">
              <a href={contactAgent?.whatsapp ? `https://wa.me/${contactAgent.whatsapp.replace(/[^\d]/g, '')}` : "#"} className="" target="_blank" rel="noopener noreferrer">
                <img src="/images/new_icons/whatapp.svg" alt="WhatsApp" className="social-icon" />
              </a>
            </div>

            <div className="contact-option-wrapper">
              <a href={contactAgent?.facebookMessenger ? `https://m.me/${contactAgent.facebookMessenger}` : "#"} className="" target="_blank" rel="noopener noreferrer">
                <img src="/images/new_icons/message.svg" alt="Messenger" className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
