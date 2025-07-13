'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { FaYoutube, FaTiktok } from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const SocialMediaSection = () => {
  const t = useTranslations('backoffice');
  const { formData, setSocialMedia } = usePropertyFormStore();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocialMedia(name,value);
  };

  return (
    <section className="form-section social-media-section">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="youtubeUrl" className="form-label">
            <FaYoutube className="icon-youtube" color="red" /> {t('socialMedia.youtubeUrl')}
          </label>
          <input
            type="text"
            id="youtubeUrl"
            name="youtubeUrl"
            className="form-control"
            value={formData.socialMedia?.youtubeUrl || ''}
            onChange={handleInputChange}
            placeholder={t('socialMedia.youtubePlaceholder')}

          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tiktokUrl" className="form-label">
            <FaTiktok className="icon-tiktok" /> {t('socialMedia.tiktokUrl')}
          </label>
          <input
            type="text"
            id="tiktokUrl"
            name="tiktokUrl"
            className="form-control"
            value={formData.socialMedia?.tiktokUrl || ''}
            onChange={handleInputChange}
            placeholder={t('socialMedia.tiktokPlaceholder')}
          />
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
