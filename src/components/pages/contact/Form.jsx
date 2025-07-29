"use client";

import React, { useState } from "react";
import useTranslationStore  from "@/store/useTranslationStore";
import { useEmail } from "@/hooks/useEmail";

const Form = ({ translations, locale }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  // Get translations from store (client-side)
  const { getTranslation } = useTranslationStore();
  
  // Email hook
  const { loading, error, success, sendContactForm, reset } = useEmail();
  
  // Map frontend locale to database field name
  const getLocaleField = (locale) => {
    switch (locale) {
      case 'zh':
        return 'zhCN'; // Database field for Chinese
      case 'th':
        return 'th';
      case 'ru':
        return 'ru';
      default:
        return 'en';
    }
  };
  
  const dbLocale = getLocaleField(locale);
  
  // Helper function to get translation by slug
  const getContactText = (slug, fallback) => {
    // First try from props (server-side)
    if (translations) {
      const found = translations.find(t => t.slug === slug);
      if (found) {
        return found[dbLocale] || found.en || fallback;
      }
    }
    
    // Then try from store (client-side)
    return getTranslation('contact', slug) || fallback;
  };
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous states
    reset();
    
    // Prepare email data
    const emailData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject || 'Contact Form Inquiry',
      message: formData.message,
    };
    
    // Send email
    const result = await sendContactForm(emailData);
    
    if (result.success) {
      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }
  };
  
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {/* Status Messages */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-3" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {getContactText('message_sent_success', 'Message sent successfully! We will get back to you soon.')}
        </div>
      )}
      
      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">
          {getContactText('your_name', 'First Name')}
        </label>
        <input 
          type="text" 
          className="form-control" 
          id="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder={getContactText('first_name_placeholder', 'Enter your first name')}
          required 
          disabled={loading}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">
          {getContactText('last_name', 'Last Name')}
        </label>
        <input 
          type="text" 
          className="form-control" 
          id="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder={getContactText('last_name_placeholder', 'Enter your last name')}
          required 
          disabled={loading}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          {getContactText('email_address', 'Email')}
        </label>
        <input 
          type="email" 
          className="form-control" 
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={getContactText('email_placeholder', 'Enter your email address')}
          required 
          disabled={loading}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">
          {getContactText('phone_number', 'Phone Number')}
        </label>
        <input 
          type="tel" 
          className="form-control" 
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={getContactText('phone_placeholder', 'Enter your phone number')}
          disabled={loading}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="subject" className="form-label">
          {getContactText('subject', 'Subject')}
        </label>
        <input 
          type="text" 
          className="form-control" 
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={getContactText('subject_placeholder', 'Enter message subject')}
          disabled={loading}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          {getContactText('your_message', 'Message')}
        </label>
        <textarea 
          className="form-control" 
          id="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={getContactText('message_placeholder', 'Enter your message')}
          style={{ height: '150px' }}
          required
          disabled={loading}
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        className="btn btn-dark w-100 py-3 mt-3" 
        disabled={loading}
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin me-2"></i>
            {getContactText('sending_message', 'Sending...')}
          </>
        ) : (
          <>
            {getContactText('send_message', 'Submit')} 
            <i className="fas fa-arrow-right ms-2"></i>
          </>
        )}
      </button>
    </form>
  );
};

export default Form;
