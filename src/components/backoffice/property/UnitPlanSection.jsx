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
import { compressImage, isImageFile } from '@/utils/imageCompression';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

// Sortable Unit Plan Item Component
const SortableUnitPlan = ({ image, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });
  const t = useTranslations('backoffice.unitPlan');

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
        alt={t('alt')}
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

const UnitPlanSection = () => {
  const { unitPlanImages, addUnitPlanImages, removeUnitPlanImage, reorderUnitPlanImages } = usePropertyFormStore();
  const [isCompressing, setIsCompressing] = useState(false);
  const t = useTranslations('backoffice.unitPlan');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalImages = unitPlanImages.length + files.length;
    if (totalImages > 100) {
      toast.error(t('maxImagesError', { count: unitPlanImages.length }));
      e.target.value = '';
      return;
    }

    setIsCompressing(true);
    const loadingToast = toast.loading(t('compressing', { count: files.length }));

    try {
      const processedImages = [];
      for (const file of files) {
        if (!isImageFile(file)) {
          toast.error(t('invalidFile', { fileName: file.name }));
          continue;
        }
        const compressedFile = await compressImage(file, { maxWidth: 2048, quality: 0.85, format: 'jpeg', maxSizeKB: 800 });
        processedImages.push({
          id: String(Math.random().toString(36).substring(2, 11)),
          file: compressedFile,
          url: URL.createObjectURL(compressedFile),
          name: compressedFile.name,
        });
      }
      if (processedImages.length > 0) {
        addUnitPlanImages(processedImages);
      }
    } catch (error) {
      console.error('Error processing unit plan images:', error);
      toast.error(t('processError', { error: error.message }));
    } finally {
      setIsCompressing(false);
      toast.dismiss(loadingToast);
      e.target.value = '';
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = unitPlanImages.findIndex((img) => img.id === active.id);
      const newIndex = unitPlanImages.findIndex((img) => img.id === over.id);
      reorderUnitPlanImages(oldIndex, newIndex);
    }
  };

  const handleBrowseFiles = () => {
    if (isCompressing) return;
    document.getElementById('unitPlanImagesInput').click();
  };

  return (
    <section className="form-section unit-plan-section">
      <h2 className="section-title">{t('title')}</h2>
      <div className="image-upload-container">
        <input
          type="file"
          id="unitPlanImagesInput"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {unitPlanImages.length > 0 ? (
          <div className="images-container">
            <h4 className="images-title">
              {t('imagesTitle', { count: unitPlanImages.length })}
            </h4>
            <p className="images-subtitle">{t('reorderSubtitle')}</p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={unitPlanImages} strategy={rectSortingStrategy}>
                <div className={`uploaded-images has-images`}>
                  {unitPlanImages.map((image) => (
                    <SortableUnitPlan key={image.id} image={image} onRemove={removeUnitPlanImage} />
                  ))}

                  {unitPlanImages.length < 100 && (
                    <div 
                      className={`add-more-photos ${isCompressing ? 'disabled' : ''}`} 
                      onClick={handleBrowseFiles}
                    >
                      <div className="add-icon">
                        {isCompressing ? <div className="spinner-border spinner-border-sm" role="status"></div> : <FaUpload size={24} />}
                      </div>
                      <p>{isCompressing ? t('compressingButton') : t('addMore')}</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <div className="upload-area">
            <div className="icon mb30"><span className="flaticon-upload" style={{ fontSize: '60px' }} /></div>
            <h6 className="title">{t('uploadTitle')}</h6>
            <p className="subtitle">{t('uploadSubtitle')}</p>
            <button type="button" className={`browse-files-btn ${isCompressing ? 'disabled' : ''}`} onClick={handleBrowseFiles} disabled={isCompressing}>
              {isCompressing ? t('compressingButton') : t('browseFiles')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UnitPlanSection;
