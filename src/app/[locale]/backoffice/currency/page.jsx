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
  GBP: '🇬🇧',
  EUR: '🇪🇺',
};

// Currency names
const currencyNames = {
  THB: 'BATH',
  USD: 'US DOLLAR',
  CNY: 'YUAN',
  RUB: 'RUBLE',
  GBP: 'POUND',
  EUR: 'EURO',
};

const CurrencyPage = () => {
  const t = useTranslations('Currency');
  
  // State for currency rates
  const [currencyRates, setCurrencyRates] = useState({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch currency rates on component mount
  useEffect(() => {
    fetchCurrencyRates();
  }, []);
  
  // Fetch currency rates from API
  const fetchCurrencyRates = async () => {
    try {
      setIsLoading(true);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/currencies`;
      
      const response = await fetch(apiUrl,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        cache: 'no-store', // Disable caching to always get the latest rates
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching currency rates: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        // Convert array of currency objects to object format
        const ratesObject = {};
        data.data.forEach(currency => {
          ratesObject[currency.currency] = parseFloat(currency.rate);
        });
        
        setCurrencyRates(ratesObject);
      }
    } catch (error) {
      console.error('Failed to fetch currency rates:', error);
      toast.error(t('errorFetching'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle currency rate change
  const handleRateChange = (currency, value) => {
    setCurrencyRates({
      ...currencyRates,
      [currency]: value,
    });
  };
  
  // Handle update button click
  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error(t('notAuthenticated'));
        return;
      }
      
      // Prepare data for API
      const currenciesArray = Object.keys(currencyRates).map(code => ({
        currency: code,
        rate: parseFloat(currencyRates[code]),
        name: currencyNames[code],
        isBase: code === 'THB'
      }));
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/currencies`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ currencies: currenciesArray }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        toast.success(t('ratesUpdated'));
        // Refresh rates to get the latest from server
        fetchCurrencyRates();
      } else {
        throw new Error(data.message || t('updateFailed'));
      }
    } catch (error) {
      console.error('Error updating currency rates:', error);
      toast.error(error.message || t('updateFailed'));
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
      <div className="currency-page">
        <div className="page-header">
          <h1>Currency</h1>
          <p>We are glad to see you again</p>
        </div>
        
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        ) : (
          <div className="currenct-card">
          <div className="currency-rates-container">
            {Object.keys(currencyRates).map((currency) => (
              <div className="currency-rate-item" key={currency}>
                <div className="currency-flag-code">
                  <span className="flag">{currencyFlags[currency]}</span>
                  <span className="currency-code">{currency}</span>
                  <span className="equals">=</span>
                </div>
                
                <div className="currency-value-name">
                  <input
                    type="number"
                    value={currencyRates[currency]}
                    onChange={(e) => handleRateChange(currency, parseFloat(e.target.value))}
                    className="currency-input"
                    disabled={currency === 'THB'} // THB is fixed
                    step="0.01"
                    min="0"
                  />
                  <span className="currency-name">{currencyNames[currency]}</span>
                </div>
              </div>
            ))}
            
           
          </div>
          <button 
              className="update-button"
              style={{  
                margin: '10px auto 20px auto',
                display: 'block',
                width: '200px',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
        )}
      </div>
  );
};

export default CurrencyPage;
