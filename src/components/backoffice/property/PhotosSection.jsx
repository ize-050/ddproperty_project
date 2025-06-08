'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaUpload, FaTrash, FaGripLines, FaArrowUp } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import usePropertyFormStore from '@/store/propertyFormStore';

const PhotosSection = () => {
  const { propertyImages, addPropertyImages, removePropertyImage, reorderPropertyImages } = usePropertyFormStore();
  const [isDragging, setIsDragging] = useState(false);



  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: String(Math.random().toString(36).substr(2, 9)),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    addPropertyImages(newImages);
    e.target.value = '';
  };
  
  // Handle drag end event
  const handleDragEnd = (result) => {
    setIsDragging(false);
    
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    // If the item was dropped in a different position, reorder the images
    if (result.source.index !== result.destination.index) {
      reorderPropertyImages(result.source.index, result.destination.index);
    }
  };
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleBrowseFiles = () => {
    document.getElementById('propertyImages').click();
  };

  return (
    <section className="form-section media-section">
      <h2 className="section-title">Media</h2>
      <div className="photo-gallery">
        <h3>Photo Gallery</h3>
        <div className="image-upload-container">
          <input
            type="file"
            id="propertyImages"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          
          {propertyImages.length > 0 ? (
            <div className="images-container">
              <h4 className="images-title">Property Photos</h4>
              <p className="images-subtitle">Drag to reorder - first image will be the main photo</p>
              
              <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                <Droppable droppableId="property-images" direction="horizontal">
                  {(provided) => (
                    <div 
                      className={`uploaded-images ${isDragging ? 'dragging' : ''} has-images`}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {propertyImages.map((image, index) => (
                        <Draggable key={image.id} draggableId={image.id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              className={`image-preview ${snapshot.isDragging ? 'dragging' : ''}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <div className="drag-handle" {...provided.dragHandleProps}>
                                <FaGripLines size={16} />
                              </div>
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
                          )}
                        </Draggable>
                      ))}
                      
                      {/* Add more photos button */}
                      <div className="add-more-photos" onClick={handleBrowseFiles}>
                        <div className="add-icon">
                          <FaUpload size={24} />
                        </div>
                        <p>Add More Photos</p>
                      </div>
                      
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ) : (
            <div className="upload-area">
              <div className="upload-icon">
                <FaArrowUp size={24} />
              </div>
              <div className="upload-text">
                <p className="upload-title">Upload/Drag photos of your property</p>
                <p className="upload-subtitle">Photos must be JPG or PNG format and at least 2048x768</p>
              </div>
              <button 
                type="button" 
                className="browse-files-btn"
                onClick={handleBrowseFiles}
              >
                Browse Files
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PhotosSection;
