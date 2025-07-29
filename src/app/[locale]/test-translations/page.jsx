// src/app/test-translations/page.jsx
'use client'

import React from 'react';
import { useLocale } from 'next-intl';
import DynamicPropertyTypes from '@/components/common/DynamicPropertyTypes';
import useDynamicTranslations from '@/hooks/useDynamicTranslations';
import '@/styles/dynamic-translations.scss';

/**
 * Test page for dynamic translation system
 * This page demonstrates how the dynamic translation system works
 * and shows the difference between static and dynamic translations
 */
const TestTranslationsPage = () => {
  const locale = useLocale();
  const { 
    translations, 
    loading, 
    error, 
    t, 
    getPropertyTypeText, 
    getListingTypeText 
  } = useDynamicTranslations('listing');

  return (
    <div className="test-translations-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>Dynamic Translation System Test</h1>
        <p>Current Locale: <strong>{locale}</strong></p>
        <p>Translation Status: {loading ? 'Loading...' : error ? `Error: ${error}` : 'Loaded'}</p>
      </div>

      {/* Translation Status */}
      <div className="translation-status" style={{ 
        background: loading ? '#fff3cd' : error ? '#f8d7da' : '#d4edda', 
        padding: '15px', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h3>Translation System Status</h3>
        <ul>
          <li>Loading: {loading ? 'Yes' : 'No'}</li>
          <li>Error: {error || 'None'}</li>
          <li>Translations Loaded: {Object.keys(translations).length}</li>
          <li>Current Locale: {locale}</li>
        </ul>
      </div>

      {/* Raw Translation Data */}
      <div className="raw-translations" style={{ marginBottom: '30px' }}>
        <h2>Raw Translation Data from Database</h2>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <pre>{JSON.stringify(translations, null, 2)}</pre>
        </div>
      </div>

      {/* Property Type Translations */}
      <div className="property-type-translations" style={{ marginBottom: '30px' }}>
        <h2>Property Type Translations</h2>
        <div className="translation-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          {['CONDO', 'HOUSE', 'TOWNHOUSE', 'LAND', 'APARTMENT', 'COMMERCIAL', 'VILLA'].map(type => (
            <div key={type} style={{ 
              background: '#fff', 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '5px' 
            }}>
              <h4>{type}</h4>
              <p><strong>Dynamic:</strong> {getPropertyTypeText(type)}</p>
              <p><strong>Key:</strong> property-type-{type.toLowerCase()}</p>
              <p><strong>Direct:</strong> {t(`property-type-${type.toLowerCase()}`, type)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Type Translations */}
      <div className="listing-type-translations" style={{ marginBottom: '30px' }}>
        <h2>Listing Type Translations</h2>
        <div className="translation-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          {['SALE', 'RENT'].map(type => (
            <div key={type} style={{ 
              background: '#fff', 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '5px' 
            }}>
              <h4>{type}</h4>
              <p><strong>Dynamic:</strong> {getListingTypeText(type)}</p>
              <p><strong>Key:</strong> listing-type-{type.toLowerCase()}</p>
              <p><strong>Direct:</strong> {t(`listing-type-${type.toLowerCase()}`, type)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Translations from Database */}
      <div className="sample-translations" style={{ marginBottom: '30px' }}>
        <h2>Sample Translations from Database</h2>
        <div className="translation-samples">
          {Object.keys(translations).slice(0, 10).map(key => (
            <div key={key} style={{ 
              background: '#fff', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              marginBottom: '10px'
            }}>
              <h5>{key}</h5>
              <p><strong>Current Locale ({locale}):</strong> {t(key)}</p>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <span>EN: {translations[key]?.en || 'N/A'}</span> | 
                <span>TH: {translations[key]?.th || 'N/A'}</span> | 
                <span>ZH: {translations[key]?.zhCN || 'N/A'}</span> | 
                <span>RU: {translations[key]?.ru || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Property Types Component */}
      <div className="dynamic-components" style={{ marginBottom: '30px' }}>
        <h2>Dynamic Property Types Components</h2>
        <DynamicPropertyTypes variant="examples" />
      </div>

      {/* Language Switcher for Testing */}
      <div className="language-switcher" style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px',
        background: '#fff',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px'
      }}>
        <h4>Test Language Switch</h4>
        <p>Current: {locale}</p>
        <small>Use browser language settings or URL params to test different locales</small>
      </div>
    </div>
  );
};

export default TestTranslationsPage;
