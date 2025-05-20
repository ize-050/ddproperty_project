'use client';

import React, { useState, useEffect } from 'react';
import usePropertyFormStore from '@/store/propertyFormStore';

const PricingSection = () => {
  const { formData, setFormData } = usePropertyFormStore();
  const [promotionEnabled, setPromotionEnabled] = useState(false);
  const [promotionalPrice, setPromotionalPrice] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handlePromotionalPriceChange = (e) => {
    setPromotionalPrice(e.target.value);
  };

  const handleTogglePromotion = () => {
    setPromotionEnabled(!promotionEnabled);
  };

  // Update store with promotional price when it changes
  useEffect(() => {
    if (promotionEnabled) {
      setFormData({ promotionalPrice });
    } else {
      setFormData({ promotionalPrice: '' });
    }
  }, [promotionEnabled, promotionalPrice, setFormData]);

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
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g. 30,000,000"
              required
            />
            <div className="currency-select">
              <select
                id="priceUnit"
                name="priceUnit"
                value={formData.priceUnit}
                onChange={handleInputChange}
              >
                <option value="THB">THB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>

        {promotionEnabled && (
          <div className="form-group">
            <label htmlFor="promotionalPrice">Promotional Price</label>
            <div className="price-input-group">
              <input
                type="text"
                id="promotionalPrice"
                name="promotionalPrice"
                value={promotionalPrice}
                onChange={handlePromotionalPriceChange}
                placeholder="e.g. 26,500,000"
              />
              <div className="currency-select">
                <select
                  id="promotionalPriceUnit"
                  name="promotionalPriceUnit"
                  value={formData.priceUnit}
                  disabled
                >
                  <option value="THB">THB</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
