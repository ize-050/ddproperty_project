'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaUpload, FaTrash, FaGripLines, FaArrowUp } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import usePropertyFormStore from '@/store/propertyFormStore';
import { compressImage, getImageInfo, isImageFile } from '@/utils/imageCompression';
import { toast } from 'react-hot-toast';

const FloorPlanSection = () => {
  const { floorPlanImages, addFloorPlanImages, removeFloorPlanImage, reorderFloorPlanImages } = usePropertyFormStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check total image limit for floor plans
    const totalImages = floorPlanImages.length + files.length;
    if (totalImages > 100) {
      toast.error(`Maximum 100 floor plan images allowed. You're trying to add ${files.length} images but already have ${floorPlanImages.length}. Please remove some images first.`);
      e.target.value = '';
      return;
    }
    
    setIsCompressing(true);
    const loadingToast = toast.loading(`Compressing ${files.length} floor plan image(s)...`);
    
    try {
      const processedImages = [];
      
      for (const file of files) {
        if (!isImageFile(file)) {
          toast.error(`${file.name} is not a valid image file`);
          continue;
        }
        
        // Get original image info
        const originalInfo = await getImageInfo(file);
        console.log('Original floor plan info:', originalInfo);
        
        // Compress image with settings optimized for floor plans
        const compressedFile = await compressImage(file, {
          maxWidth: 2048,      // Higher resolution for floor plans
          maxHeight: 1536,     // Maintain detail for technical drawings
          quality: 0.85,       // Higher quality for clarity
          format: 'jpeg',      
          maxSizeKB: 800       // Allow larger size for detailed plans
        });
        
        // Get compressed image info
        const compressedInfo = await getImageInfo(compressedFile);
        console.log('Compressed floor plan info:', compressedInfo);
        
        // Calculate compression results (but don't show individual toast)
        const compressionRatio = Math.round((1 - compressedFile.size / file.size) * 100);
        
        processedImages.push({
          id: String(Math.random().toString(36).substring(2, 11)),
          file: compressedFile,
          url: URL.createObjectURL(compressedFile),
          name: compressedFile.name,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          compressionRatio
        });
      }
      
      if (processedImages.length > 0) {
        addFloorPlanImages(processedImages);
      }
      
    } catch (error) {
      console.error('Error processing floor plan images:', error);
      toast.error('Failed to process floor plan images: ' + error.message);
    } finally {
      setIsCompressing(false);
      toast.dismiss(loadingToast);
      e.target.value = '';
    }
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
      reorderFloorPlanImages(result.source.index, result.destination.index);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleBrowseFiles = () => {
    if (isCompressing) return;
    document.getElementById('floorPlanImages').click();
  };

  return (
    <section className="form-section floor-plan-section">
      <h2 className="section-title">Floor Plan</h2>
      <div className="image-upload-container">
        <input
          type="file"
          id="floorPlanImages"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {floorPlanImages.length > 0 ? (
          <div className="images-container">
            <h4 className="images-title">
              Floor Plan Images ({floorPlanImages.length}/100)
            </h4>
            <p className="images-subtitle">Drag to reorder - first image will be the main floor plan</p>

            <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
              <Droppable droppableId="floor-plan-images" direction="horizontal">
                {(provided) => (
                  <div
                    className={`uploaded-images ${isDragging ? 'dragging' : ''} has-images`}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {floorPlanImages.map((image, index) => (
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
                              alt="Floor Plan"
                              width={100}
                              height={100}
                              className="preview-image"
                            />
                            <div className="image-info">
                              <span className="image-name">{image.name}</span>
                              <button
                                type="button"
                                className="remove-image"
                                onClick={() => removeFloorPlanImage(image.id)}
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {/* Add more photos button */}
                    {floorPlanImages.length < 100 && (
                      <div 
                        className={`add-more-photos ${isCompressing ? 'disabled' : ''}`}
                        onClick={handleBrowseFiles}
                      >
                        <div className="add-icon">
                          {isCompressing ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Compressing...</span>
                            </div>
                          ) : (
                            <FaUpload size={24} />
                          )}
                        </div>
                        <p>{isCompressing ? 'Compressing...' : 'Add More Floor Plans'}</p>
                      </div>
                    )}
                    
                    {floorPlanImages.length >= 100 && (
                      <div className="add-more-photos disabled">
                        <div className="add-icon">
                          <span>📐</span>
                        </div>
                        <p>Maximum 100 floor plans reached</p>
                      </div>
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          <div className="upload-area">
            <div className="icon mb30">
              <span className="flaticon-upload" style={{
                fontSize: '60px',
              }} />
            </div>
            <div className="upload-text">
              <p className="upload-title">Upload/Drag floor plan images</p>
              <p className="upload-subtitle">Images must be JPG or PNG format and at least 2048x768 (Maximum 100 images)</p>
            </div>
            <button
              type="button"
              className={`browse-files-btn ${isCompressing ? 'disabled' : ''}`}
              onClick={handleBrowseFiles}
              disabled={isCompressing}
            >
              {isCompressing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Compressing...
                </>
              ) : (
                'Browse Files'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FloorPlanSection;