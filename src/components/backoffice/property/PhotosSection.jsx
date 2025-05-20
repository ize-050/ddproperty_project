'use client';

import React from 'react';
import Image from 'next/image';
import { FaUpload, FaTrash } from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const PhotosSection = () => {
  const { propertyImages, addPropertyImages, removePropertyImage } = usePropertyFormStore();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    addPropertyImages(newImages);
  };

  return (
    <section className="form-section">
      <h2>Photos*</h2>
      <div className="image-upload-container">
        <div className="image-upload-box">
          <input
            type="file"
            id="propertyImages"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="propertyImages" className="upload-label">
            <FaUpload size={24} />
            <span>Click to upload</span>
            <span className="upload-hint">or drag and drop</span>
          </label>
        </div>

        {propertyImages.length > 0 && (
          <div className="uploaded-images">
            {propertyImages.map(image => (
              <div key={image.id} className="image-preview">
                <Image
                  src={image.url}
                  alt="Property"
                  width={100}
                  height={100}
                  className="preview-image"
                />
                <div className="image-info">
                  <span className="image-name">{image.name}</span>
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removePropertyImage(image.id)}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotosSection;
