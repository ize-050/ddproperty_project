'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getMessagingSettings, transformSettingsToObject, generatePlatformLink, getDefaultSettings } from '@/services/messagingSettings';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose, property }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch messaging settings on component mount
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
          <h3>FOR MORE INFOMATION</h3>

        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Name" 
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-group phone-group">
            <input 
              type="email" 
              placeholder="Email" 
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email"
                }
              })}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          
          <div className="form-group phone-group">
            <div className="country-code">
              +66 <i className="fas fa-chevron-down"></i>
            </div>
            <input 
              type="tel" 
              placeholder="Phone Number" 
              {...register("phone", { 
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{9,10}$/,
                  message: "Please enter a valid phone number"
                }
              })}
            />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </div>
          
          <div className="form-group">
            <textarea 
              placeholder="Massage" 
              {...register("message", { required: "Message is required" })}
              rows={4}
            />
            {errors.message && <span className="error">{errors.message.message}</span>}
          </div>
          
          <button 
            type="submit" 
            className="send-button" 
            disabled={isSubmitting}
          >
            <i className="far fa-comment-dots"></i> {isSubmitting ? 'Sending...' : 'Send Massage'}
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
              <a href={settings.whatsapp ? `tel:${settings.whatsapp.replace(/[^\d+]/g, '')}` : "tel:+66123456789"} className="contact-option phone">
                <i className="fas fa-phone"></i>
              </a>
            </div>
            
            <span style={{ marginLeft: '10px' ,fontWeight: 'bold' }}>Call Now</span>
          </div>
          
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: '15px'
          }}>
            <div className="contact-option-wrapper">

              <a href="#" className="">
                <img src="/images/new_icons/line.png" alt="Line" className="social-icon" />
              </a>
            </div>

            <div className="contact-option-wrapper">
              <a href="#" className="">
                <img src="/images/new_icons/wechat.png" alt="WeChat" className="social-icon" />
              </a>
            </div>

            <div className="contact-option-wrapper">
              <a href="https://wa.me/66123456789" className="">
                <img src="/images/new_icons/whatapp.png" alt="WhatsApp" className="social-icon" />
              </a>
            </div>

            <div className="contact-option-wrapper">
              <a href="https://m.me/ddproperty" className="">
                 <img src="/images/new_icons/message.png" alt="Messenger" className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
