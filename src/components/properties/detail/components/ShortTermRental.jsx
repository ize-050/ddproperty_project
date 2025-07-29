'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import useSimpleTranslations from '@/hooks/useSimpleTranslations';
import { convertAndFormatPrice, getSelectedCurrency, currencySymbols } from '@/utils/currencyUtils';

const ShortTermRental = ({ property }) => {
  const locale = useLocale();
  const t = useTranslations('PropertyDetail');
  const { t: dynamicT } = useSimpleTranslations('listing');

  // ตรวจสอบว่า property มี listing type เป็น SALE หรือ SALE_RENT หรือไม่
  const hasShortTermRental = property?.listings?.some(listing => 
    listing.listingType === 'RENT'
  );

  // ถ้าไม่มี SALE หรือ SALE_RENT ให้ไม่แสดงส่วนนี้
  if (!hasShortTermRental) {
    return null;
  }

  // ดึงข้อมูล rental rates จาก listings
  const rentalData = property?.listings?.find(listing => 
    listing.listingType === 'RENT'
  );

  // ฟอร์แมตราคา
  const formatPrice = (price) => {
    return convertAndFormatPrice(price, locale, false);
  };

  // ฟอร์แมตสกุลเงินตาม currency selector ใน header
  const getCurrencyUnit = () => {
    const selectedCurrency = getSelectedCurrency(locale);
    const currencySymbol = currencySymbols[selectedCurrency] || '฿';
    return `${currencySymbol}/Month`;
  };

  // ข้อมูล rental rates จาก database
  const rentalRates = [];
  
  // เพิ่มข้อมูล rental rates ถ้ามีข้อมูลใน database
  if (rentalData?.shortTerm3Months) {
    rentalRates.push({
      period: `3 ${dynamicT('months-contract', 'Months Contract')}`,
      price: rentalData.shortTerm3Months,
      unit: getCurrencyUnit()
    });
  }
  
  if (rentalData?.shortTerm6Months) {
    rentalRates.push({
      period: `6 ${dynamicT('months-contract', 'Months Contract')}`,
      price: rentalData.shortTerm6Months,
      unit: getCurrencyUnit()
    });
  }
  
  if (rentalData?.shortTerm1Year) {
    rentalRates.push({
      period: `1 ${dynamicT('year-contract', 'Year Contract')}`,
      price: rentalData.shortTerm1Year,
      unit: getCurrencyUnit()
    });
  }

  return (
    <div className="property-section mb-5">
      <h3 className="section-title mb-4">
        {dynamicT('short-term-rental', 'Short Term Rental')} {dynamicT('optional', '(optional)')}
      </h3>
      
      <div className="short-term-rental-container">
        {rentalRates.map((rate, index) => (
          <div key={index} className="rental-rate-item">
            <div className="rental-period">
              {rate.period}
            </div>
            <div className="rental-price">
              {formatPrice(rate.price)} {dynamicT('month', '/Month')}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .short-term-rental-container {
          padding: 0;
          border: none;
          background: transparent;
        }

        .rental-rate-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #dee2e6;
        }

        .rental-rate-item:last-child {
          border-bottom: 1px solid #dee2e6;
        }

        .rental-period {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .rental-price {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .section-title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .rental-rate-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          
          .rental-price {
            font-size: 14px;
          }
          
          .rental-period {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ShortTermRental;
