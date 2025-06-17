"use client";

import React, { useState } from "react";
import useTranslationStore  from "@/store/useTranslationStore";

const Form = ({ translations, locale }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  
  // Get translations from store (client-side)
  const { getTranslation } = useTranslationStore();
  
  // Helper function to get translation by slug
  const getContactText = (slug, fallback) => {
    // First try from props (server-side)
    if (translations) {
      const found = translations.find(t => t.slug === slug);
      if (found) {
        return found[locale] || found.en || fallback;
      }
    }
    
    // Then try from store (client-side)
    return getTranslation('contact', slug) || fallback;
  };
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };
  
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
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
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          {getContactText('message', 'Message')}
        </label>
        <textarea 
          className="form-control" 
          id="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={getContactText('message_placeholder', 'Enter your message')}
          style={{ height: '150px' }}
          required
        ></textarea>
      </div>
      
      <button type="submit" className="btn btn-dark w-100 py-3 mt-3">
        {getContactText('send_message', 'Submit')} <i className="fas fa-arrow-right ms-2"></i>
      </button>
    </form>
  );
};

export default Form;
