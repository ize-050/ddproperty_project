'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';

const PricingSection = () => {
  const { formData, setFormData } = usePropertyFormStore();
  const { register, formState: { errors }, setValue, watch, trigger, getValues } = useFormContext();
  const [promotionEnabled, setPromotionEnabled] = useState(false);
  
  // Watch the short term rental values
  const shortTerm3Months = watch('shortTerm3Months');
  const shortTerm6Months = watch('shortTerm6Months');
  const shortTerm1Year = watch('shortTerm1Year');
  const promotionalPrice = watch('promotionalPrice');
  const priceUnit = watch('priceUnit');
  
  // ตั้งค่าเริ่มต้น
  useEffect(() => {
    // ถ้ามีค่า promotionalPrice จาก backend ให้เปิด toggle โดยอัตโนมัติ
    if (formData.promotionalPrice && formData.promotionalPrice !== '0' && formData.promotionalPrice !== 0) {
      setPromotionEnabled(true);
      setValue('promotionalPrice', formData.promotionalPrice);
    }
  }, [formData.promotionalPrice, setValue]);
  
  // Register promotionalPrice field with validation whenever promotionEnabled changes
  useEffect(() => {
    register('promotionalPrice', {
      validate: value => {
        if (promotionEnabled && (!value || value === '0' || value === 0 || value === '')) {
          return 'Promotional price is required when promotion is enabled';
        }
        return true;
      }
    });
    
    // Validate immediately when toggle changes
    if (promotionEnabled) {
      trigger('promotionalPrice');
    }
  }, [register, promotionEnabled, trigger]);


  // priceUnit is already declared above

  const handlePromotionalPriceChange = (e) => {
    const value = e.target.value;
    setValue('promotionalPrice', value);
    
    // ทำ validation ทันทีเมื่อมีการเปลี่ยนแปลงค่า
    if (promotionEnabled) {
      setTimeout(() => trigger('promotionalPrice'), 100);
    }
  };

  const handleTogglePromotion = () => {
    const newState = !promotionEnabled;
    setPromotionEnabled(newState);
    
    if(newState) {
      // เมื่อเปิดใช้งานโปรโมชั่น ใช้ค่าเดิม (ถ้ามี) หรือค่าว่าง
      const currentValue = getValues('promotionalPrice');
      if (!currentValue || currentValue === 0 || currentValue === '0') {
        setValue('promotionalPrice', '');
      }
      // ทำ validation ทันที
      setTimeout(() => trigger('promotionalPrice'), 100);
    } else {
      // เมื่อปิดใช้งานโปรโมชั่น ตั้งค่าเป็น 0
      setValue('promotionalPrice', 0);
    }
  };

  useEffect(() => {
    if (promotionEnabled) {
      setValue('promotionalPrice', formData.promotionalPrice);
      if (formData.promotionalPrice) {
        trigger('promotionalPrice');
      }
    } else {
      setValue('promotionalPrice', '0');
    }
  }, [promotionEnabled, promotionalPrice, setValue, trigger]);

  // ตรวจสอบว่าเป็นประเภทการลงประกาศแบบใด
  const showSaleSection = formData.status === 'SALE' || formData.status === 'SALE_RENT';
  const showRentSection = formData.status === 'RENT' || formData.status === 'SALE_RENT';

  return (
    <section className="form-section">
      {showSaleSection && (
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
      )}

      {promotionEnabled && showSaleSection && (
        <div className="promotion-info">
          <p>Promotional pricing will enhance the attractiveness of your listing.</p>
        </div>
      )}

      {promotionEnabled && showSaleSection && (
        <div className="promotion-price-display">
          <p>Displayed price when promotion is enabled</p>
          <div className="promotion-price-box" >
            <div className="original-price" style={{ color: '#fefefe' }}>
              <span className="currency-symbol" style={{ color: '#fefefe' }}>฿</span>
              <span className="strikethrough" style={{ color: '#fefefe' }}>{formData.price}</span>
            </div>
            <div className="promotional-price" style={{ color: '#fefefe' }}>
              <span className="currency-symbol" style={{ color: '#fefefe' }}>฿</span>
              <span className="promotion-price-value" style={{ color: '#fefefe' }}>{promotionalPrice}</span>
            </div>
          </div>
        </div>
      )}

      <div className="price-fields-container">
        <div className="row">
          {/* แสดงส่วนราคาขายเมื่อเลือก Sale หรือ Sale & Rent */}
          {showSaleSection && (
            <div className={showRentSection ? "col-md-6" : "col-md-12"}>
              <div className="form-group">
                <label htmlFor="price">Selling Price</label>
                <div className="price-input-wrapper">
                  <input
                    type="text"
                    id="price"
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    defaultValue={formData.price}
                    placeholder="e.g. 30,000,000"
                    {...register('price', { required: showSaleSection ? 'Price is required' : false })}
                  />
                  <span className="unit-text">THB</span>
                </div>
                {errors.price && (
                  <div className="invalid-feedback">{errors.price.message}</div>
                )}
              </div>
            </div>
          )}

          {/* แสดงส่วนราคาเช่าเมื่อเลือก Rent หรือ Sale & Rent */}
          {showRentSection && (
            <div className={showSaleSection ? "col-md-6" : "col-md-12"}>
              <div className="form-group">
                <label htmlFor="rentalPrice">Rental Price</label>
                <div className="price-input-wrapper">
                  <input
                    type="text"
                    id="rentalPrice"
                    className={`form-control ${errors.rentalPrice ? 'is-invalid' : ''}`}
                    defaultValue={formData.rentalPrice}
                    placeholder="e.g. 80,000"
                    {...register('rentalPrice', { required: showRentSection ? 'Rental price is required' : false })}
                  />
                  <span className="unit-text">THB/Month</span>
                </div>
                {errors.rentalPrice && (
                  <div className="invalid-feedback">{errors.rentalPrice.message}</div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
      
      <div className="row">
        {showRentSection && (
          <div className="short-term-rental">
            <h3>Short Term Rental (optional)</h3>

            <div className="row short-term-row">
              <div className="col-md-4">
                <div className="short-term-container">
                  <span className="short-term-label">3 M</span>
                  <input
                    type="number" 
                    id="shortTerm3Months"
                    className="short-term-input"
                    value={shortTerm3Months || ''}
                    {...register('shortTerm3Months')}
                  />
                  <span className="short-term-currency">THB/M</span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="short-term-container">
                  <span className="short-term-label">6 M</span>
                  <input
                    type="number"
                    id="shortTerm6Months"
                    className="short-term-input"
                    value={shortTerm6Months || ''}
                    {...register('shortTerm6Months')}
                  />
                  <span className="short-term-currency">THB/M</span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="short-term-container">
                  <span className="short-term-label">1 Y</span>
                  <input
                    type="number"
                    id="shortTerm1Year"
                    className="short-term-input"
                    value={shortTerm1Year || ''}
                    {...register('shortTerm1Year')}
                  />
                  <span className="short-term-currency">THB/Y</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {promotionEnabled && showSaleSection && (
        <div className="form-group">
          <label htmlFor="promotionalPrice">Promotional Price</label>
          <div className="price-input-wrapper">
            <input
              type="text"
              id="promotionalPrice"
              className={`form-control ${errors.promotionalPrice ? 'is-invalid' : ''}`}
              defaultValue={formData.promotionalPrice || ''}
              {...register('promotionalPrice')}
              onChange={handlePromotionalPriceChange}
              onBlur={() => promotionEnabled && trigger('promotionalPrice')}
              placeholder="e.g. 25,000,000"
            />
            <span className="unit-text">{priceUnit}</span>
          </div>
          {errors.promotionalPrice && (
            <div className="invalid-feedback">{errors.promotionalPrice.message}</div>
          )}
        </div>
      )}

      {/* เพิ่ม CSS สำหรับการจัดรูปแบบ */}
      <style jsx>{`
        .price-fields-container {
          margin-top: 20px;
        }
        .short-term-rental {
          margin-top: 30px;
          width: 100%;
        }
        .short-term-rental h3 {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .short-term-row {
          display: flex;
          flex-wrap: wrap;
          margin-top: 15px;
        }
        .short-term-container {
          display: flex;
          align-items: stretch;
          background-color: #ffffff;
          border-radius: 4px;
          border: 1px solid #e9ecef;
          padding: 0;
          height: 44px;
          position: relative;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .short-term-label {
          background-color: #f8f9fa;
          padding: 0 16px;
          font-weight: 500;
          color: #333;
          flex-shrink: 0;
          width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #e9ecef;
          font-size: 14px;
        }
        .short-term-currency {
          background-color: #f8f9fa;
          color: #666;
          flex-shrink: 0;
          padding: 0 3px;
          width: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 1px solid #e9ecef;
          font-size: 13px;
        }
        .short-term-input {
          flex: 1;
          border: none;
          background: transparent;
          text-align: center;
          font-size: 14px;
          color: #333;
          padding: 0 0px;
          outline: none;
          height: 100%;
          box-sizing: border-box;
        }
        .short-term-input::-webkit-outer-spin-button,
        .short-term-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .short-term-input[type=number] {
          -moz-appearance: textfield;
        }
        .price-input-wrapper {
          position: relative;
          margin-bottom: 25px;
        }
        .price-input-wrapper input {
          width: 100%;
          padding-right: 90px;
          height: 44px;
          border-radius: 4px;
          border: 1px solid #ddd;
          padding-left: 12px;
        }
        .unit-text {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-weight: 500;
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          margin-left: -15px;
          margin-right: -15px;
        }
        .col-md-4, .col-md-6, .col-md-12 {
          padding-left: 15px;
          padding-right: 15px;
          box-sizing: border-box;
        }
        .col-md-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
        }
        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }
        .col-md-12 {
          flex: 0 0 100%;
          max-width: 100%;
        }
        @media (max-width: 768px) {
          .col-md-4, .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default PricingSection;
