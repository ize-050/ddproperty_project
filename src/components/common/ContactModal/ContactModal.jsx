'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose, property }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
              <a href="tel:+66123456789" className="contact-option phone">
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
