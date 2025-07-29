"use client";
import React, { useState } from "react";
import useDynamicTranslations  from "@/hooks/useDynamicTranslations";
import { useEmail } from "@/hooks/useEmail";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: ""
  });
  
  const { t } = useDynamicTranslations('home');
  
  // Email hook
  const { loading, error, success, sendContactForm, reset } = useEmail();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Reset previous states
    reset();
    
    // Prepare email data
    const emailData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: "", // Homepage form doesn't have phone field
      subject: formData.subject || 'Homepage Contact Form Inquiry',
      message: formData.subject, // Use subject as message for homepage form
    };
    
    // Send email
    const result = await sendContactForm(emailData);
    
    if (result.success) {
      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: ""
      });
    }
  };
  return (
      <>
    <form className="form-style1" onSubmit={handleSubmit}>
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
          {t('contact-message-sent-success') || 'Message sent successfully! We will get back to you soon.'}
        </div>
      )}
      
      <div className="row">
        <div className="col-lg-6">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
                {t('contact-name')}
            </label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder=""
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              {t('contact-last-name')}
            </label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder=""
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">{t('contact-email')}</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              {t('contact-subject')}
            </label>
            <textarea
              name="subject"
              className="form-control"
              cols={30}
              rows={4}
              value={formData.subject}
              onChange={handleChange}
              placeholder={t('contact-subject-placeholder') || 'Enter your message or inquiry'}
              required
              disabled={loading}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-md-12">
          <div className="d-grid">
            <button type="submit" className="ud-btn btn-dark" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  {t('contact-sending') || 'Sending...'}
                </>
              ) : (
                <>
                  {t('contact-send-message')}
                  <i className="fal fa-arrow-right-long" />
                </>
              )}
            </button>
          </div>
        </div>
        {/* End .col */}
      </div>
    </form>
      </>
  );
};

export default Contact;
