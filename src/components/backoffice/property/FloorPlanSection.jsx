'use client';

import React, { useState } from 'react';
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
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import usePropertyFormStore from '@/store/propertyFormStore';
import { compressImage, getImageInfo, isImageFile } from '@/utils/imageCompression';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

// Sortable Floor Plan Item Component
const SortableFloorPlan = ({ image, onRemove }) => {
  const t = useTranslations('backoffice');
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
      <Image
        src={image.url}
        alt={t('floorPlan.alt')}
        width={100}
        height={100}
        className="preview-image"
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

const FloorPlanSection = () => {
  const t = useTranslations('backoffice');
  const { floorPlanImages, addFloorPlanImages, removeFloorPlanImage, reorderFloorPlanImages } = usePropertyFormStore();
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

    const totalImages = floorPlanImages.length + files.length;
    if (totalImages > 100) {
      toast.error(t('floorPlan.maxImagesError', { filesLength: files.length, floorPlanImagesLength: floorPlanImages.length }));
      e.target.value = '';
      return;
    }

    setIsCompressing(true);
    const loadingToast = toast.loading(t('floorPlan.compressing', { filesLength: files.length }));

    try {
      const processedImages = [];

      for (const file of files) {
        if (!isImageFile(file)) {
          toast.error(t('floorPlan.invalidFile', { fileName: file.name }));
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
      toast.error(t('floorPlan.processError', { errorMessage: error.message }));
    } finally {
      setIsCompressing(false);
      toast.dismiss(loadingToast);
      e.target.value = '';
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = floorPlanImages.findIndex((img) => img.id === active.id);
      const newIndex = floorPlanImages.findIndex((img) => img.id === over.id);
      reorderFloorPlanImages(oldIndex, newIndex);
    }
  };

  const handleBrowseFiles = () => {
    if (isCompressing) return;
    document.getElementById('floorPlanImages').click();
  };

  return (
    <section className="form-section floor-plan-section">
      <h2 className="section-title">{t('floorPlan.title')}</h2>
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
              {t('floorPlan.imagesTitle', { floorPlanImagesLength: floorPlanImages.length })}
            </h4>
            <p className="images-subtitle">{t('floorPlan.reorderSubtitle')}</p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={floorPlanImages} strategy={rectSortingStrategy}>
                <div className={`uploaded-images has-images`}>
                  {floorPlanImages.map((image) => (
                    <SortableFloorPlan key={image.id} image={image} onRemove={removeFloorPlanImage} />
                  ))}

                  {floorPlanImages.length < 100 && (
                    <div 
                      className={`add-more-photos ${isCompressing ? 'disabled' : ''}`} 
                      onClick={handleBrowseFiles}
                    >
                      <div className="add-icon">
                        {isCompressing ? <div className="spinner-border spinner-border-sm" role="status"></div> : <FaUpload size={24} />}
                      </div>
                      <p>{isCompressing ? t('floorPlan.compressingButton') : t('floorPlan.addMoreButton')}</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <div className="upload-area">
            <div className="icon mb30">
              <span className="flaticon-upload" style={{
                fontSize: '60px',
              }} />
            </div>
            <div className="upload-text">
              <p className="upload-title">{t('floorPlan.uploadTitle')}</p>
              <p className="upload-subtitle">{t('floorPlan.uploadSubtitle')}</p>
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
                  {t('floorPlan.compressingButton')}
                </>
              ) : (
                t('floorPlan.browseFilesButton')
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FloorPlanSection;