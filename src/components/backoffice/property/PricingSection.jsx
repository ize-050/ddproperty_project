'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';

const PricingSection = () => {
  const { formData, setFormData } = usePropertyFormStore();
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const [promotionEnabled, setPromotionEnabled] = useState(false);
  const [promotionalPrice, setPromotionalPrice] = useState('');
  
  // CSS class for error styling
  const getInputClassName = (fieldName) => {
    return `form-control ${errors[fieldName] ? 'is-invalid' : ''}`;
  };

  // Watch price unit changes
  const priceUnit = watch('priceUnit');

  const handlePromotionalPriceChange = (e) => {
    const value = e.target.value;
    setPromotionalPrice(value);
    setValue('promotionalPrice', value);
  };

  const handleTogglePromotion = () => {
    setPromotionEnabled(!promotionEnabled);
  };

  // Update form with promotional price when it changes
  useEffect(() => {
    if (promotionEnabled) {
      setValue('promotionalPrice', promotionalPrice);
    } else {
      setValue('promotionalPrice', '');
    }
  }, [promotionEnabled, promotionalPrice, setValue]);

  return (
    <section className="form-section">
      <div className="section-header-with-toggle">
        <h2>Pricing and Promotion Settings</h2>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="promotionToggle"
            checked={promotionEnabled}
            onChange={handleTogglePromotion}
          />
          <label htmlFor="promotionToggle"></label>
        </div>
      </div>

      {promotionEnabled && (
        <div className="promotion-info">
          <p>Promotional pricing will enhance the attractiveness of your listing.</p>
        </div>
      )}

      {promotionEnabled && (
        <div className="promotion-price-display">
          <p>Displayed price when promotion is enabled</p>
          <div className="promotion-price-box">
            <div className="original-price">
              <span className="currency-symbol">฿</span>
              <span className="strikethrough">{formData.price}</span>
            </div>
            <div className="promotional-price">
              <span className="currency-symbol">฿</span>
              <span className="promotion-price-value">{promotionalPrice}</span>
            </div>
          </div>
        </div>
      )}

      <div className="price-fields-container">
        <div className="form-group">
          <label htmlFor="price">Selling Price*</label>
          <div className="price-input-group">
            <input
              type="text"
              id="price"
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              defaultValue={formData.price}
              placeholder="e.g. 30,000,000"
              {...register('price', { required: 'Price is required' })}
            />
            <div className="currency-select">
              <select
                id="priceUnit"
                {...register('priceUnit')}
              >
                <option value="THB">THB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          {errors.price && (
            <div className="invalid-feedback">{errors.price.message}</div>
          )}
        </div>

        {promotionEnabled && (
          <div className="form-group">
            <label htmlFor="promotionalPrice">Promotional Price</label>
            <div className="price-input-group">
              <input
                type="text"
                id="promotionalPrice"
                {...register('promotionalPrice')}
                value={promotionalPrice}
                onChange={handlePromotionalPriceChange}
                placeholder="e.g. 25,000,000"
              />
              <div className="currency-select">
                <select disabled>
                  <option>{priceUnit}</option>
                </select>
              </div>
            </div>
            {errors.promotionalPrice && (
              <div className="invalid-feedback">{errors.promotionalPrice.message}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
