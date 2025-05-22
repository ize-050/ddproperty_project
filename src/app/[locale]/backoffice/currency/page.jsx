'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { toast } from 'react-toastify';

// Import SCSS
import '@/styles/backoffice/currency.scss';

// Flag icons for currencies
const currencyFlags = {
  THB: '🇹🇭',
  USD: '🇺🇸',
  CNY: '🇨🇳',
  RUB: '🇷🇺',
};

// Currency names
const currencyNames = {
  THB: 'BATH',
  USD: 'US DOLLAR',
  CNY: 'YUAN',
  RUB: 'RUBLE',
};

const CurrencyPage = () => {
  const t = useTranslations('Currency');
  
  // State for currency rates
  const [currencyRates, setCurrencyRates] = useState({
    THB: 100.00,
    USD: 2.99,
    CNY: 21.76,
    RUB: 244.39,

  });
  
  // Handle currency rate change
  const handleRateChange = (currency, value) => {
    setCurrencyRates({
      ...currencyRates,
      [currency]: value,
    });
  };
  
  // Handle update button click
  const handleUpdate = () => {
    // In a real app, this would be an API call to update currency rates
    toast.success(t('ratesUpdated'));
  };
  
  return (
    <BackofficeLayout>
      <div className="currency-page">
        <div className="page-header">
          <h1>{t('currency')}</h1>
          <p>{t('currencySubtitle')}</p>
        </div>
        
        <div className="currency-rates-container">
          {Object.keys(currencyRates).map((currency) => (
            <div className="currency-rate-item" key={currency}>
              <div className="currency-flag-code">
                <span className="currency-flag">{currencyFlags[currency]}</span>
                <span className="currency-code">{currency}</span>
              </div>
              
              <div className="equals-sign">=</div>
              
              <div className="currency-input-container">
                <input
                  type="number"
                  value={currencyRates[currency]}
                  onChange={(e) => handleRateChange(currency, parseFloat(e.target.value))}
                  className="currency-input"
                  disabled={currency === 'THB'} // THB is fixed
                />
                <span className="currency-name">{currencyNames[currency]}</span>
              </div>
            </div>
          ))}
          
          <div className="update-button-container">
            <button 
              className="update-button"
              onClick={handleUpdate}
            >
              {t('update')}
            </button>
          </div>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default CurrencyPage;
