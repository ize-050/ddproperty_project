'use client';

import React from 'react';
import { FaYoutube, FaTiktok } from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const SocialMediaSection = () => {
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
            <FaYoutube className="icon-youtube" color="red" /> YouTube URL
          </label>
          <input
            type="text"
            id="youtubeUrl"
            name="youtubeUrl"
            className="form-control"
            value={formData.socialMedia?.youtubeUrl || ''}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."

          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tiktokUrl" className="form-label">
            <FaTiktok className="icon-tiktok" /> TikTok URL
          </label>
          <input
            type="text"
            id="tiktokUrl"
            name="tiktokUrl"
            className="form-control"
            value={formData.socialMedia?.tiktokUrl || ''}
            onChange={handleInputChange}
            placeholder="https://www.tiktok.com/@username/video/..."
          />
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
