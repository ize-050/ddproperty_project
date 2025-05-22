import React, { useRef } from 'react';
import { FaUpload, FaImage } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ImageUploader = ({ 
  image, 
  onImageChange, 
  placeholderText = 'Upload/Drag photos of your property',
  hintText = 'Recommended width is at least 1080px',
  className = ''
}) => {
  const fileInputRef = useRef(null);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && onImageChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(file, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className={`image-uploader ${className}`}>
      <div 
        className={`upload-area ${image ? 'has-image' : ''}`}
        onClick={triggerFileInput}
      >
        {image ? (
          <>
            <img 
              src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
              alt="Preview" 
              className="image-preview" 
            />
            <button 
              type="button" 
              className="browse-button mt-3"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              Change Image
            </button>
          </>
        ) : (
          <div className="upload-placeholder">
            <FaUpload className="upload-icon" />
            <p>{placeholderText}</p>
            <span className="upload-hint">{hintText}</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="file-input"
        />
      </div>
      {image && (
        <button 
          type="button" 
          className="browse-button"
          onClick={triggerFileInput}
        >
          Browse Files
        </button>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  onImageChange: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  hintText: PropTypes.string,
  className: PropTypes.string
};

export default ImageUploader;
