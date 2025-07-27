'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const PropertyDetailSection = ({ watchedStatus }) => {
  const t = useTranslations('backoffice.propertyDetail');
  const { formData, setFormData } = usePropertyFormStore();
  const { register, formState: { errors }, setValue, watch } = useFormContext();

  const watchedFields = watch();
  const propertyTypeId = watch('propertyTypeId');
  const propertyTypes = watch('propertyTypes');

  useEffect(() => {
    const updateStore = () => {
      const fieldsToUpdate = [
        'propertyId', 'ownershipQuota', 'land_size_rai', 'land_size_ngan', 'land_size_sq_wah',
        'usableArea', 'floors', 'furnishing', 'bedrooms', 'bathrooms',
        'constructionYear', 'communityFees'
      ];

      const updates = {};
      fieldsToUpdate.forEach(field => {
        if (watchedFields[field] !== undefined && watchedFields[field] !== formData[field]) {
          updates[field] = watchedFields[field];
        }
      });

      if (Object.keys(updates).length > 0) {
        setFormData(updates);
      }
    };

    updateStore();
  }, [watchedFields, setFormData, formData]);

  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key, value);
      }
    });
  }, []);

  const getCommunityFeeUnitKey = () => {
    if (!propertyTypeId || !propertyTypes) return 'units.sqm';

    const selectedType = propertyTypes.find(pt => pt.id.toString() === propertyTypeId.toString());
    if (!selectedType) return 'units.sqm';

    const typeName = selectedType.nameEn.toLowerCase();
    const sqmTypes = ['condo', 'apartment', 'commercial', 'office', 'retail'];
    const sqwahTypes = ['house', 'villa', 'townhouse', 'land'];

    if (sqmTypes.includes(typeName)) {
      return 'units.sqm';
    }
    if (sqwahTypes.includes(typeName)) {
      return 'units.sqwah';
    }

    return 'units.sqm';
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <Image
          src="/images/icons/iconproperty/property_information.svg"
          alt={t('alt')}
          width={24}
          height={24}
          className="section-icon"
        />
        <h2 className="section-title">{t('title')}</h2>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="propertyId">{t('labels.propertyId')}</label>
          <input
            type="text"
            id="propertyId"
            className="form-control"
            disabled
            {...register('propertyId')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownershipQuota">{t('labels.ownershipQuota')}</label>
          <select
            id="ownershipQuota"
            defaultValue="freehold"
            className={`form-control custom-select ${errors.ownershipQuota ? 'is-invalid' : ''}`}
            {...register('ownershipQuota', { required: t('validation.ownershipRequired') })}
          >
            <option value="Thai Quota">Thai Quota</option>
            <option value="Foreign Quota">Foreign Quota</option>
            <option value="Company Name">Company Name</option>
          </select>
          {errors.ownershipQuota && <p className="error-message">{errors.ownershipQuota.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="landSize">{t('labels.landSize')}</label>
          <div className="land-size-grid">
            <div className="land-size-item">
              <input
                type="number"
                id="landSizeRai"
                className="form-control"
                placeholder="0"
                {...register('land_size_rai')}
              />
              <span className="unit-label"> Rai</span>
            </div>
            <div className="land-size-item">
              <input
                type="number"
                id="landSizeNgan"
                className="form-control"
                placeholder="0"
                {...register('land_size_ngan')}
              />
              <span className="unit-label">Ngan</span>
            </div>
            <div className="land-size-item">
              <input
                type="number"
                id="landSizeSqWah"
                className="form-control"
                placeholder="0"
                {...register('land_size_sq_wah')}
              />
              <span className="unit-label">Sq.wah</span>
            </div>

            {(watchedStatus === 'RENT' || watchedStatus === 'SALE_RENT') && (
              <div className="land-size-item">
                <input
                  type="number"
                  id="landSizeSqm"
                  className="form-control"
                  placeholder="0"
                  {...register('landSizeSqm')}
                />
                <span className="unit-label">Sqm.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="usableArea">{t('labels.usableArea')}</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="usableArea"
              className="form-control"
              {...register('usableArea', { required: t('validation.usableAreaRequired') })}
            />
            <span className="unit">Sqm.</span>
          </div>
          {errors.usableArea && <p className="error-message">{errors.usableArea.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="floors">{t('labels.floors')}</label>
          <select
            id="floors"
            className={`form-control custom-select ${errors.floors ? 'is-invalid' : ''}`}
            {...register('floors', { required: t('validation.required') })}
          >
            <option value="">-</option>
            {[...Array(59)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          {errors.floors && <p className="error-message">{errors.floors.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="furnishing">{t('labels.furnishing')}</label>
          <select
            id="furnishing"
            defaultValue="FULLY_FURNISHED"
            className={`form-control custom-select ${errors.furnishing ? 'is-invalid' : ''}`}
            {...register('furnishing', { required: t('validation.required') })}
          >
            <option value="FULLY_FURNISHED">Fully Furnished</option>
            <option value="PARTIALLY_FURNISHED">Partially Furnished</option>
            <option value="UNFURNISHED">Unfurnished</option>
          </select>
          {errors.furnishing && <p className="error-message">{errors.furnishing.message}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bedrooms">{t('labels.bedrooms')}</label>
          <select
            id="bedrooms"
            defaultValue={1}
            className={`form-control custom-select ${errors.bedrooms ? 'is-invalid' : ''}`}
            {...register('bedrooms', { required: t('validation.required') })}
          >

            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          {errors.bedrooms && <p className="error-message">{errors.bedrooms.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="bathrooms">{t('labels.bathrooms')}</label>
          <select
            id="bathrooms"
            defaultValue={1}
            className={`form-control custom-select ${errors.bathrooms ? 'is-invalid' : ''}`}
            {...register('bathrooms', { required: t('validation.required') })}
          >

            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          {errors.bathrooms && <p className="error-message">{errors.bathrooms.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="constructionYear">{t('labels.constructionYear')}</label>
          <select
            id="constructionYear"
            defaultValue={new Date().getFullYear()}
            className={`form-control custom-select ${errors.constructionYear ? 'is-invalid' : ''}`}
            {...register('constructionYear', { required: t('validation.required') })}
          >
            {(() => {
              const currentYear = new Date().getFullYear();
              const years = [];
              for (let year = 2035; year >= currentYear - 50; year--) {
                years.push(<option key={year} value={year}>{year}</option>);
              }
              return years;
            })()}
          </select>
          {errors.constructionYear && <p className="error-message">{errors.constructionYear.message}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="communityFees">{t('labels.communityFees')}</label>
          <div className="input-with-unit">
            <input
              type="text"
              id="communityFees"
              className="form-control"
              {...register('communityFees')}
            />
            <span className="unit">{t(getCommunityFeeUnitKey())}</span>
          </div>
          {errors.communityFees && <p className="error-message">{errors.communityFees.message}</p>}
        </div>
        <div className="form-group"></div>
        <div className="form-group"></div>
      </div>
    </section>
  );
};

export default PropertyDetailSection;
