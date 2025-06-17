'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaTrash, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Import SCSS
import '@/styles/backoffice/my-profile.scss';

export const dynamic = "force-dynamic";

const MyProfilePage = () => {
  const t = useTranslations('Profile');
  
  // State for profile data
  const [profileData, setProfileData] = useState({
    username: 'admin123',
    firstName: 'John',
    lastName: 'Doe',
    telMain: '+66891234567',
    telSecondary: '',
    email: 'john.doe@example.com',
    profileImage: '/images/team/1.jpg',
    lineId: '',
    wechatId: '',
    whatsapp: '',
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  
  // Handle profile image change
  const handleImageChange = (file) => {
    setProfileData({
      ...profileData,
      profileImage: file,
    });
  };
  
  // Handle image delete
  const handleImageDelete = () => {
    if (window.confirm(t('confirmDeleteImage'))) {
      setProfileData({
        ...profileData,
        profileImage: null,
      });
      toast.success(t('imageDeleted'));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to update the profile
    toast.success(t('profileUpdated'));
  };

  return (
      <div className="my-profile-page">
        <div className="page-header">
          <h1>{t('myProfile')}</h1>
          <p>{t('manageYourProfile')}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="profile-section">
            <div className="profile-image-section">
              <div className="profile-image-container">
                {profileData.profileImage ? (
                  <div className="profile-image-wrapper">
                    <img 
                      src={typeof profileData.profileImage === 'string' 
                        ? profileData.profileImage 
                        : URL.createObjectURL(profileData.profileImage)} 
                      alt="Profile" 
                      className="profile-image" 
                    />
                    <button 
                      type="button"
                      className="delete-image-button"
                      onClick={handleImageDelete}
                      aria-label={t('deleteImage')}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <div className="profile-image-placeholder">
                    <img 
                      src="https://via.placeholder.com/150" 
                      alt="Profile Placeholder" 
                      className="profile-image" 
                    />
                    <button 
                      type="button"
                      className="delete-image-button"
                      onClick={handleImageDelete}
                      aria-label={t('deleteImage')}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              <button type="button" className="upload-profile-button">
                {t('uploadProfileFiles')} <span className="upload-icon">↗</span>
              </button>
            </div>
            
            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="username">{t('username')}*</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="firstName">{t('firstName')}*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">{t('lastName')}*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telMain">{t('telMain')}*</label>
                <input
                  type="tel"
                  id="telMain"
                  name="telMain"
                  value={profileData.telMain}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telSecondary">{t('telSecondary')} ({t('optional')})</label>
                <input
                  type="tel"
                  id="telSecondary"
                  name="telSecondary"
                  value={profileData.telSecondary}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">{t('email')}*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="profile-section social-media-section">
            <h2>{t('socialMedia')}</h2>
            
            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="lineId">
                  <span className="social-icon line-icon">LINE</span> 
                  {t('lineId')} ({t('optional')})
                </label>
                <input
                  type="text"
                  id="lineId"
                  name="lineId"
                  value={profileData.lineId}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="wechatId">
                  <span className="social-icon wechat-icon">WeChat</span> 
                  {t('wechatId')} ({t('optional')})
                </label>
                <input
                  type="text"
                  id="wechatId"
                  name="wechatId"
                  value={profileData.wechatId}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="whatsapp">
                  <span className="social-icon whatsapp-icon">WhatsApp</span> 
                  {t('whatsapp')} ({t('optional')})
                </label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={profileData.whatsapp}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="update-profile-button">
              {t('updateProfile')} <FaArrowRight className="button-icon" />
            </button>
          </div>
        </form>
      </div>
  );
};

export default MyProfilePage;
