'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaTrash, FaArrowRight, FaLine, FaWhatsapp, FaWeixin, FaFacebookMessenger, FaInstagram, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import userService from '@/services/userService';

// Import SCSS
import '@/styles/backoffice/my-profile.scss';

export const dynamic = "force-dynamic";

const MyProfilePage = () => {
  const t = useTranslations('Profile');
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for profile data
  const [profileData, setProfileData] = useState({
    name: '',
    firstname: '',
    lastname: '',
    phone: '',
    phoneAlt: '',
    email: '',
    picture: '',
    lineId: '',
    wechatId: '',
    whatsapp: '',
    facebook: '',
    instagram: ''
  });
  
  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getMyProfile();
        const userData = response.data;
        
        setProfileData(prevData => ({
          ...prevData,
          name: userData.name || '',
          firstname: userData.firstname || '',
          lastname: userData.lastname || '',
          phone: userData.phone || '',
          phoneAlt: userData.phoneAlt || '',
          email: userData.email || '',
          picture: userData.picture || '',
          lineId: userData?.line || '',
          wechatId: userData?.wechat || '',
          whatsapp: userData?.whatsapp || '',
          facebook: userData?.facebook || '',
          instagram: userData?.instagram || ''
        }));
        
        if (userData.picture) {
          setPreviewImage(process.env.NEXT_PUBLIC_IMAGE_URL + userData.picture);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error(t('errorFetchingProfile') || 'Error fetching profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [t]);
  
  // Handle profile input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  
  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };
  
  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        toast.error(t('onlyImageFilesAllowed'));
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t('fileTooLarge'));
        return;
      }
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Store file for later upload
      setSelectedFile(file);
    }
  };
  
  // Handle delete image
  const handleDeleteImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Call the updateMyProfile method with form data and image
      await userService.updateMyProfile(profileData, selectedFile);
      toast.success(t('profileUpdated'));
      
      // Reset selectedFile after successful upload
      setSelectedFile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('errorUpdatingProfile'));
    } finally {
      setSaving(false);
    }
  };
  
  // Handle social media form submission
  const handleSocialMediaSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Only send social media fields
      const socialMediaData = {
        lineId: profileData.lineId,
        wechatId: profileData.wechatId,
        whatsapp: profileData.whatsapp,
        facebook: profileData.facebook,
        instagram: profileData.instagram
      };
      
      await userService.updateMyProfile(socialMediaData);
      toast.success(t('socialMediaUpdated') || 'Social media updated successfully');
    } catch (error) {
      console.error('Error updating social media:', error);
      toast.error(t('errorUpdatingSocialMedia') || 'Error updating social media');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation: Check if new passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    
    // Check if new password is at least 6 characters
    if (passwordData.newPassword.length < 6) {
      toast.error(t('passwordTooShort') || 'Password must be at least 6 characters');
      return;
    }
    
    setChangingPassword(true);
    
    try {
      // Call backend to change password
      const response = await userService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success(t('passwordUpdated'));
      
      // Reset form
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      
      // Check if it's an old password error
      if (error.response?.status === 400 || error.response?.data?.message?.includes('password')) {
        toast.error(t('incorrectOldPassword') || 'Incorrect old password');
      } else {
        toast.error(t('errorChangingPassword') || 'Error changing password');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  return (
      <div className="my-profile-page">
        <div className="profile-container">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-main-section">
              <div className="profile-image-section">
                <div className="profile-image-container">
                  {/* Render preview image or placeholder */}
                  {previewImage ? (
                    <div className="profile-image-wrapper">
                      <img src={previewImage} alt="Profile" className="profile-image" />
                      <button
                        type="button"
                        className="delete-image-button"
                        onClick={handleDeleteImage}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="profile-image-placeholder"
                      style={{
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '24px',
                          color: '#999',
                        }}
                      >
                        {profileData.firstname ? profileData.firstname.charAt(0) : ''}
                        {profileData.lastname ? profileData.lastname.charAt(0) : ''}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 style={{ marginBottom: '10px' }}>{t('myProfile')}</h2>
                  <button
                    type="button"
                    className="upload-profile-button"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {t('uploadPhoto')}
                  </button>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    accept="image/*"
                    ref={fileInputRef}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="profile-row">
                  <div className="form-group">
                    <label htmlFor="name">{t('name')}*</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="firstname">{t('firstname')}*</label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={profileData.firstname}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastname">{t('lastname')}*</label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={profileData.lastname}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="profile-row">
                  <div className="form-group">
                    <label htmlFor="phone">{t('phone')}*</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneAlt">{t('phoneAlt')} ({t('optional')})</label>
                    <input
                      type="tel"
                      id="phoneAlt"
                      name="phoneAlt"
                      value={profileData.phoneAlt}
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

                <div className="update-btn-container">
                  <button type="submit" className="btn-primary update-profile-button">
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('updating')}
                      </>
                    ) : (
                      <>
                        {t('updateProfile')} <FaArrowRight className="button-icon" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="profile-card">
            <div className="social-media-section">
              <h2>{t('socialMedia')}</h2>

              <form onSubmit={handleSocialMediaSubmit}>
                <div className="social-media-grid">
                  <div className="form-group">
                    <label htmlFor="lineId">
                      <span className="social-icon line-icon" ><FaLine className="line-icon"/> LINE</span> 
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
                      <span className="social-icon wechat-icon"><FaWeixin className="wechat-icon" /> WeChat</span> 
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
                      <span className="social-icon whatsapp-icon"><FaWhatsapp className="whatsapp-icon" /> WhatsApp</span> 
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

                  <div className="form-group">
                    <label htmlFor="facebook">
                      <span className="social-icon facebook-icon"><FaFacebookMessenger className="facebook-icon" /> Messenger</span> 
                      {t('facebook')} ({t('optional')})
                    </label>
                    <input
                      type="text"
                      id="facebook"
                      name="facebook"
                      value={profileData.facebook}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="instagram">
                      <span className="social-icon instagram-icon"><FaInstagram className="instagram-icon" /> Instagram</span> 
                      {t('instagram')} ({t('optional')})
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={profileData.instagram}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="update-btn-container text-end mb-4">
                  <button type="submit" className="btn-primary update-social-button">
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('updating')}
                      </>
                    ) : (
                      <>
                        {t('updateSocialMedia')} <FaArrowRight className="button-icon" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="profile-card">
            <div className="change-password-section">
              <h2>{t('changePassword')}</h2>

              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="oldPassword">{t('oldPassword')}</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="password-row">
                  <div className="form-group">
                    <label htmlFor="newPassword">{t('newPassword')}</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">{t('confirmNewPassword')}</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="update-btn-container text-end">
                  <button type="submit" className="btn-primary update-password-button">
                    {changingPassword ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('updating')}
                      </>
                    ) : (
                      <>
                        {t('updatePassword')} <FaArrowRight className="button-icon" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MyProfilePage;