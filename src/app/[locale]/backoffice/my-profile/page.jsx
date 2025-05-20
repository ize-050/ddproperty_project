'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';

export const dynamic = "force-dynamic";

const MyProfilePage = () => {
  const t = useTranslations('Backoffice');
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+66 89 123 4567',
    address: '123 Sukhumvit Road, Bangkok, Thailand',
    website: 'www.johndoe.com',
    facebook: 'johndoe',
    twitter: 'johndoe',
    instagram: 'johndoe',
    linkedin: 'johndoe',
    bio: 'Real estate professional with over 10 years of experience in the Pattaya and Bangkok markets. Specializing in luxury properties and investment opportunities.',
    profileImage: '/images/team/1.jpg'
  });

  // Form state
  const [formData, setFormData] = useState({...userData});
  const [isEditing, setIsEditing] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({...formData});
    setIsEditing(false);
  };

  return (
    <BackofficeLayout>
      <div className="my-profile-page">
        <div className="page-header">
          <h2>{t('myProfile')}</h2>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-image-container">
              <Image 
                src={userData.profileImage} 
                alt={userData.name}
                width={200}
                height={200}
                className="profile-image"
              />
              {isEditing && (
                <button className="change-photo-btn">
                  {t('changePhoto')}
                </button>
              )}
            </div>
            <div className="profile-info">
              <h3>{userData.name}</h3>
              <p className="user-role">{t('realEstateAgent')}</p>
              <div className="social-links">
                {userData.facebook && (
                  <a href={`https://facebook.com/${userData.facebook}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaFacebook />
                  </a>
                )}
                {userData.twitter && (
                  <a href={`https://twitter.com/${userData.twitter}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaTwitter />
                  </a>
                )}
                {userData.instagram && (
                  <a href={`https://instagram.com/${userData.instagram}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaInstagram />
                  </a>
                )}
                {userData.linkedin && (
                  <a href={`https://linkedin.com/in/${userData.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaLinkedin />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  {t('editProfile')}
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setFormData({...userData});
                      setIsEditing(false);
                    }}
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    className="save-btn"
                    onClick={handleSubmit}
                  >
                    {t('saveChanges')}
                  </button>
                </div>
              )}
            </div>

            <div className="profile-form-container">
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3 className="section-title">{t('personalInformation')}</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaUser className="input-icon" />
                        {t('fullName')}
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange}
                          required
                        />
                      ) : (
                        <p className="info-value">{userData.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaEnvelope className="input-icon" />
                        {t('email')}
                      </label>
                      {isEditing ? (
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange}
                          required
                        />
                      ) : (
                        <p className="info-value">{userData.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaPhone className="input-icon" />
                        {t('phone')}
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="info-value">{userData.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaMapMarkerAlt className="input-icon" />
                        {t('address')}
                      </label>
                      {isEditing ? (
                        <textarea 
                          name="address" 
                          value={formData.address} 
                          onChange={handleChange}
                          rows="2"
                        />
                      ) : (
                        <p className="info-value">{userData.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">{t('onlinePresence')}</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaGlobe className="input-icon" />
                        {t('website')}
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="website" 
                          value={formData.website} 
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="info-value">{userData.website}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaFacebook className="input-icon" />
                        {t('facebook')}
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="facebook" 
                          value={formData.facebook} 
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="info-value">{userData.facebook}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaTwitter className="input-icon" />
                        {t('twitter')}
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="twitter" 
                          value={formData.twitter} 
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="info-value">{userData.twitter}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaInstagram className="input-icon" />
                        {t('instagram')}
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="instagram" 
                          value={formData.instagram} 
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="info-value">{userData.instagram}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaLinkedin className="input-icon" />
                        {t('linkedin')}
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="linkedin" 
                          value={formData.linkedin} 
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="info-value">{userData.linkedin}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">{t('biography')}</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      {isEditing ? (
                        <textarea 
                          name="bio" 
                          value={formData.bio} 
                          onChange={handleChange}
                          rows="4"
                        />
                      ) : (
                        <p className="info-value bio-text">{userData.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default MyProfilePage;
