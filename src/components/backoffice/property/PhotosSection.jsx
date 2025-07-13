'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FaUpload, FaTrash, FaGripLines } from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import usePropertyFormStore from '@/store/propertyFormStore';
import { compressImage, getImageInfo, isImageFile } from '@/utils/imageCompression';
import { toast } from 'react-hot-toast';

// Sortable Photo Item Component
const SortablePhoto = ({ image, onRemove }) => {
  const t = useTranslations('backoffice.photos');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`image-preview ${isDragging ? 'dragging' : ''}`}
      {...attributes}
    >
      <div className="drag-handle" {...listeners}>
        <FaGripLines size={16} />
      </div>
      <img
        src={image.url}
        alt={t('propertyAlt')}
        width="100"
        height="100"
        className="preview-image"
        style={{ objectFit: 'cover' }}
      />
      <div className="image-info">
        <span className="image-name">{image.name}</span>
        <button
          type="button"
          className="remove-image"
          onClick={() => onRemove(image.id)}
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

const PhotosSection = () => {
  const t = useTranslations('backoffice.photos');
  const { propertyImages, addPropertyImages, removePropertyImage, reorderPropertyImages } = usePropertyFormStore();
  const [activeId, setActiveId] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const totalImages = propertyImages.length + files.length;
    if (totalImages > 100) {
      toast.error(t('maxImagesError', { filesLength: files.length, propertyImagesLength: propertyImages.length }));
      e.target.value = '';
      return;
    }
    
    setIsCompressing(true);
    const loadingToast = toast.loading(t('compressing', { filesLength: files.length }));
    
    try {
      const processedImages = [];
      
      for (const file of files) {
        if (!isImageFile(file)) {
          toast.error(t('invalidFile', { fileName: file.name }));
          continue;
        }
        
        const compressedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8,
          format: 'jpeg',
          maxSizeKB: 500
        });
        
        processedImages.push({
          id: String(Math.random().toString(36).substring(2, 11)),
          file: compressedFile,
          url: URL.createObjectURL(compressedFile),
          name: compressedFile.name,
        });
      }
      
      if (processedImages.length > 0) {
        addPropertyImages(processedImages);
      }
      
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error(t('processError', { errorMessage: error.message }));
    } finally {
      setIsCompressing(false);
      toast.dismiss(loadingToast);
      e.target.value = '';
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = propertyImages.findIndex((img) => img.id === active.id);
      const newIndex = propertyImages.findIndex((img) => img.id === over.id);
      reorderPropertyImages(oldIndex, newIndex);
    }
  };

  const handleBrowseFiles = () => {
    if (isCompressing) return;
    document.getElementById('propertyImages').click();
  };

  return (
    <section className="form-section media-section">
      <div className="section-header">
        <Image
          src="/images/icons/iconproperty/camera.svg"
          alt={t('mediaAlt')}
          width={24}
          height={24}
          className="section-icon"
        />
        <h2 className="section-title">{t('title')}</h2>
      </div>
      <div className="photo-gallery">
        <h3>{t('galleryTitle')}</h3>
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
              <h4 className="images-title">
                {t('imagesTitle', { propertyImagesLength: propertyImages.length })}
              </h4>
              <p className="images-subtitle">{t('reorderSubtitle')}</p>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={propertyImages} strategy={rectSortingStrategy}>
                  <div className={`uploaded-images has-images`}>
                    {propertyImages.map((image) => (
                      <SortablePhoto key={image.id} image={image} onRemove={removePropertyImage} />
                    ))}

                    {/* Add more photos button */}
                    {propertyImages.length < 100 && (
                      <div 
                        className={`add-more-photos ${isCompressing ? 'disabled' : ''}`} 
                        onClick={handleBrowseFiles}
                      >
                        <div className="add-icon">
                          {isCompressing ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">{t('compressingButton')}</span>
                            </div>
                          ) : (
                            <FaUpload size={24} />
                          )}
                        </div>
                        <p>{isCompressing ? t('compressingButton') : t('addMoreButton')}</p>
                      </div>
                    )}
                    
                    {propertyImages.length >= 100 && (
                      <div className="add-more-photos disabled">
                        <div className="add-icon">
                          <span>📸</span>
                        </div>
                        <p>{t('maxImagesReached')}</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="upload-area  position-relative overflow-hidden bdrs12 text-center mb30 px-2">
              <div className="icon mb30">
                <span className="flaticon-upload" style={{
                  fontSize: '60px',
                }} />
              </div>
              <div className="upload-text">
                <p className="upload-title">{t('uploadTitle')}</p>
                <p className="upload-subtitle">{t('uploadSubtitle')}</p>
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
                    {t('compressingButton')}
                  </>
                ) : (
                  t('browseFilesButton')
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PhotosSection;
