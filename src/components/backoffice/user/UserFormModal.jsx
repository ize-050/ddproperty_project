import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FaTimes } from 'react-icons/fa';

/**
 * Modal component for creating and editing users
 */
const UserFormModal = ({ isOpen, onClose, onSubmit, user, mode }) => {
  const t = useTranslations('Users');
  
  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'USER',
      facebook: '',
      line: '',
      whatsapp: '',
      wechat: ''
    }
  });
  
  // Watch password to compare with confirmPassword
  const watchPassword = watch('password');
  
  // Reset form when user changes
  useEffect(() => {
    if (user) {
      // Prefill form with user data if in edit mode
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
      setValue('role', user.role || 'USER');
      
      // Handle social media JSON field
      if (user.socialMedia) {
        let socialMedia;
        try {
          // Handle both string and object formats
          socialMedia = typeof user.socialMedia === 'string' 
            ? JSON.parse(user.socialMedia) 
            : user.socialMedia;
          
          setValue('facebook', socialMedia.facebook || '');
          setValue('line', socialMedia.line || '');
          setValue('whatsapp', socialMedia.whatsapp || '');
          setValue('wechat', socialMedia.wechat || '');
        } catch (error) {
          console.error('Error parsing social media:', error);
        }
      }
    } else {
      // Reset form for add mode
      reset();
    }
  }, [user, setValue, reset]);
  
  // Handle form submission
  const handleFormSubmit = (data) => {
    // Remove confirmPassword as it's not needed in the API
    const { confirmPassword, ...userData } = data;
    
    // If editing and password is empty, remove it
    if (mode === 'edit' && !userData.password) {
      delete userData.password;
    }
    
    // Format social media data
    const socialMedia = {
      facebook: userData.facebook || '',
      line: userData.line || '',
      whatsapp: userData.whatsapp || '',
      wechat: userData.wechat || ''
    };
    
    // Remove individual social media fields
    delete userData.facebook;
    delete userData.line;
    delete userData.whatsapp;
    delete userData.wechat;
    
    // Add formatted socialMedia
    userData.socialMedia = socialMedia;
    
    // Submit the data
    onSubmit(userData);
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{mode === 'add' ? t('addUser') : t('editUser')}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="form-body">
            <div className="form-section">
              <h3>{t('basicInfo')}</h3>
              
              <div className="form-group">
                <label htmlFor="name">{t('name')} *</label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { 
                    required: t('nameRequired')
                  })}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">{t('email')} *</label>
                <input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: t('emailRequired'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('invalidEmail')
                    }
                  })}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">{t('phone')}</label>
                  <input
                    id="phone"
                    type="text"
                    {...register('phone', {
                      pattern: {
                        value: /^[0-9+\-\s()]*$/,
                        message: t('invalidPhone')
                      }
                    })}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="role">{t('role')} *</label>
                  <select
                    id="role"
                    {...register('role', { 
                      required: t('roleRequired')
                    })}
                    className={errors.role ? 'error' : ''}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                    <option value="AGENT">Agent</option>
                  </select>
                  {errors.role && <span className="error-message">{errors.role.message}</span>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>{t('password')}</h3>
              
              <div className="form-group">
                <label htmlFor="password">
                  {mode === 'add' ? `${t('password')} *` : `${t('password')} (${t('leaveEmptyToKeep')})`}
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password', { 
                    required: mode === 'add' ? t('passwordRequired') : false,
                    minLength: {
                      value: 8,
                      message: t('passwordTooShort')
                    }
                  })}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password.message}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  {mode === 'add' ? `${t('confirmPassword')} *` : `${t('confirmPassword')}`}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', { 
                    required: mode === 'add' ? t('confirmPasswordRequired') : false,
                    validate: value => 
                      !value || !watchPassword || value === watchPassword || t('passwordsMustMatch')
                  })}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
              </div>
            </div>
            
            <div className="form-section">
              <h3>{t('socialMedia')}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="facebook">Facebook</label>
                  <input
                    id="facebook"
                    type="text"
                    {...register('facebook')}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="line">Line</label>
                  <input
                    id="line"
                    type="text"
                    {...register('line')}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp</label>
                  <input
                    id="whatsapp"
                    type="text"
                    {...register('whatsapp')}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="wechat">WeChat</label>
                  <input
                    id="wechat"
                    type="text"
                    {...register('wechat')}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              className="submit-button"
            >
              {mode === 'add' ? t('create') : t('update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
