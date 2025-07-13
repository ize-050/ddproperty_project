'use client';

import React, { useEffect } from 'react';
import usePropertyFormStore from '@/store/propertyFormStore';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const ListingTypeSection = ({type}) => {
  const t = useTranslations('backoffice');
  const { formData, setStatus } = usePropertyFormStore();
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  // ตั้งค่าเริ่มต้นเป็น SALE ถ้ายังไม่มีการเลือก
  useEffect(() => {
    if (!formData.status) {
      setStatus('SALE');
      setValue('status', 'SALE');
    }
  }, [formData.status, setStatus, setValue]);

  // อัพเดท React Hook Form เมื่อ Zustand store เปลี่ยน
  useEffect(() => {
    if (formData.status) {
      setValue('status', formData.status);
    }
  }, [formData.status, setValue]);

  const handleStatusChange = (status) => {
    if (type === "edit" || type === "view") return; // ไม่อนุญาตให้เปลี่ยนสถานะถ้าเป็นโหมดแก้ไขหรือดู
    
    setStatus(status);
    setValue('status', status, { shouldValidate: true });
  };

  // เช็คว่าอยู่ในโหมดแก้ไขหรือดูหรือไม่
  const isDisabled = type === "edit" || type === "view";

  return (
    <section className="form-section">
      <div className="section-header">
        <Image 
          src="/images/icons/iconproperty/listingproperty.svg" 
          alt={t('listingType.alt')} 
          width={24} 
          height={24} 
          className="section-icon"
        />
        <h2 className="section-title">{t('listingType.title')}</h2>
      </div>
      <div className="listing-type-options">
        <div
          className={`listing-option ${formData.status === 'SALE' ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
          onClick={() => handleStatusChange('SALE')}
        >
          <input 
            type="radio" 
            {...register('status', { required: t('listingType.required') })} 
            value="SALE"
            id="status-sale"
            className="hidden"
            style={{ display: 'none' }}
            disabled={isDisabled}
            checked={formData.status === 'SALE'}
            onChange={() => handleStatusChange('SALE')}
          />
          <label htmlFor="status-sale">{t('listingType.forSale')}</label>
        </div>
        <div
          className={`listing-option ${formData.status === 'RENT' ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
          onClick={() => handleStatusChange('RENT')}
        >
          <input 
            type="radio" 
            {...register('status', { required: t('listingType.required') })} 
            value="RENT"
            id="status-rent"
            className="hidden"
            style={{ display: 'none' }}
            disabled={isDisabled}
            checked={formData.status === 'RENT'}
            onChange={() => handleStatusChange('RENT')}
          />
          <label htmlFor="status-rent">{t('listingType.forRent')}</label>
        </div>
        <div
          className={`listing-option ${formData.status === 'SALE_RENT' ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
          onClick={() => handleStatusChange('SALE_RENT')}
        >
          <input 
            type="radio" 
            {...register('status', { required: t('listingType.required') })} 
            value="SALE_RENT"
            id="status-sale-rent"
            className="hidden"
            style={{ display: 'none' }}
            disabled={isDisabled}
            checked={formData.status === 'SALE_RENT'}
            onChange={() => handleStatusChange('SALE_RENT')}
          />
          <label htmlFor="status-sale-rent">{t('listingType.forSaleAndRent')}</label>
        </div>
      </div>
      {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
      <p className="text-gray-500 text-sm mt-1">{t('listingType.currentSelection', { status: watch('status') || t('listingType.noSelection') })}</p>
      {isDisabled && (
        <p className="text-amber-500 text-sm mt-1">{t('listingType.disabled')}</p>
      )}
    </section>
  );
};

export default ListingTypeSection;
