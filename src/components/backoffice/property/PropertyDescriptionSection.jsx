'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';
import { FaGlobe, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import 'flag-icons/css/flag-icons.min.css';
const PropertyDescriptionSection = () => {
  const t = useTranslations('backoffice.propertyDescription');
  const { formData, setDescription, setTranslatedDescriptions } = usePropertyFormStore();
  const { register, formState: { errors }, setValue, watch, getValues, control } = useFormContext();
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'error' });
  const [inputValues, setInputValues] = useState({
    propertyTitle: { en: '', th: '', zh: '', ru: '' },
    description: { en: '', th: '', zh: '', ru: '' },
    paymentPlan: { en: '', th: '', zh: '', ru: '' },
  });

  const languages = [
    { code: 'en', flagCode: 'gb' },
    { code: 'th', flagCode: 'th' },
    { code: 'zh', flagCode: 'cn' },
    { code: 'ru', flagCode: 'ru' },
  ];

  useEffect(() => {
    // Set initial values from the store when the component loads.
    setInputValues({
      propertyTitle: {
        en: formData.propertyTitle || '',
        th: formData.translatedTitles?.th || '',
        zh: formData.translatedTitles?.zh || '',
        ru: formData.translatedTitles?.ru || ''
      },
      description: {
        en: formData.description || '',
        th: formData.translatedDescriptions?.th || '',
        zh: formData.translatedDescriptions?.zh || '',
        ru: formData.translatedDescriptions?.ru || ''
      },
      paymentPlan: {
        en: formData.paymentPlan || '',
        th: formData.translatedPaymentPlans?.th || '',
        zh: formData.translatedPaymentPlans?.zh || '',
        ru: formData.translatedPaymentPlans?.ru || ''
      }
    });
  }, [formData]);

  useEffect(() => {
    if (alertInfo.open) {
      const timer = setTimeout(() => setAlertInfo({ open: false, message: '', severity: 'error' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const handleDescriptionChange = (e, field) => {
    const { name, value } = e.target;
    const fieldName = name.split('-')[0];

    // Update local state for UI
    setInputValues(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], [activeLanguage]: value }
    }));

    // If it's a react-hook-form controlled field, call its onChange
    if (field) {
        field.onChange(value);
    }

    // For non-English, update zustand
    if (activeLanguage !== 'en') {
        const storeKey = fieldName === 'propertyTitle' ? 'titles' : fieldName === 'description' ? 'descriptions' : 'paymentPlans';
        const formKey = fieldName === 'propertyTitle' ? 'translatedTitles' : fieldName === 'description' ? 'translatedDescriptions' : 'translatedPaymentPlans';
        const currentTranslations = getValues(formKey) || {};
        setValue(formKey, { ...currentTranslations, [activeLanguage]: value });
        setTranslatedDescriptions(storeKey, activeLanguage, value);
    }
  };

  const handleTranslateAll = async () => {
    const sourceLanguage = activeLanguage;

    let sourceTitle, sourceDescription, sourcePaymentPlan;

    if (sourceLanguage === 'en') {
      // For English, get the latest values directly from react-hook-form
      sourceTitle = getValues('propertyTitle');
      sourceDescription = getValues('description');
      sourcePaymentPlan = getValues('paymentPlan');
    } else {
      // For other languages, use the local state
      sourceTitle = inputValues.propertyTitle[sourceLanguage];
      sourceDescription = inputValues.description[sourceLanguage];
      sourcePaymentPlan = inputValues.paymentPlan[sourceLanguage];
    }

    if (!sourceTitle || !sourceDescription) {
      setAlertInfo({ open: true, message: t('alerts.fillSourceLanguageFields', { languageName: t(`languages.${sourceLanguage}`) }), severity: 'warning' });
      return;
    }

    setIsTranslating(true);
    const languagesToTranslate = languages.filter(lang => lang.code !== sourceLanguage);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const translatePromises = [];

    const fieldsToTranslate = [
      { name: 'propertyTitle', text: sourceTitle, storeKey: 'titles', formKey: 'translatedTitles' },
      { name: 'description', text: sourceDescription, storeKey: 'descriptions', formKey: 'translatedDescriptions' },
      { name: 'paymentPlan', text: sourcePaymentPlan, storeKey: 'paymentPlans', formKey: 'translatedPaymentPlans' },
    ];

    fieldsToTranslate.forEach(({ name, text, storeKey, formKey }) => {
      if (text) {
        languagesToTranslate.forEach(lang => {
          const promise = fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, source: sourceLanguage, target: lang.code, format: 'text' }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.data?.translations?.[0]?.translatedText) {
              const translatedText = data.data.translations[0].translatedText;

              setInputValues(prev => ({ ...prev, [name]: { ...prev[name], [lang.code]: translatedText } }));

              if (lang.code === 'en') {
                setValue(name, translatedText);
                setDescription(name, translatedText);
              } else {
                const currentTranslations = getValues(formKey) || {};
                setValue(formKey, { ...currentTranslations, [lang.code]: translatedText });
                setTranslatedDescriptions(storeKey, lang.code, translatedText);
              }
            } else {
              console.error(`Translation to ${lang.code} for ${name} failed. Response:`, data);
            }
          });
          translatePromises.push(promise);
        });
      }
    });

    try {
      await Promise.all(translatePromises);
    } catch (error) {
      console.error('An unexpected error occurred during translation:', error);
      setAlertInfo({ open: true, message: t('alerts.translationFailed'), severity: 'error' });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <Image
          src="/images/icons/iconproperty/property_description.svg"
          alt={t('alt')}
          width={24}
          height={24}
          className="section-icon"
        />
        <h2 className="section-title">{t('title')}</h2>
      </div>

      <div className="language-tabs">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`language-tab ${activeLanguage === lang.code ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveLanguage(lang.code); }}
          >
            <span 
              className={`fi fi-${lang.flagCode}`}
              style={{
                width: '20px',
                height: '15px',
                borderRadius: '2px',
                display: 'inline-block',
                marginRight: '8px'
              }}
            ></span>
            <span className="language-name">{t(`languages.${lang.code}`)}</span>
          </button>
        ))}
      </div>

      <div className="translate-all-container" style={{ justifyContent: 'end', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <button
          type="button"
          className="translate-all-btn"
          onClick={(e) => { e.preventDefault(); handleTranslateAll(); }}
          disabled={isTranslating}
        >
          {isTranslating ? <FaSpinner className="spinner" /> : <FaGlobe />}
          {t('translateAllButton')}
        </button>
      </div>

      {/* Title Field */}
      <div className="form-group">
        <label htmlFor="propertyTitle">{t('form.titleLabel')}</label>
        {activeLanguage === 'en' ? (
          <Controller
            name="propertyTitle"
            control={control}
            defaultValue={inputValues.propertyTitle.en}
            rules={{ required: t('form.titleRequiredError') }}
            render={({ field }) => (
              <input
                {...field}
                id="propertyTitle-en"
                className="form-control"
                style={errors.propertyTitle ? { border: '1px solid #dc3545' } : {}}
                placeholder={t('form.titlePlaceholder', { languageName: t('languages.en') })}
              />
            )}
          />
        ) : (
          <input
            type="text"
            id={`propertyTitle-${activeLanguage}`}
            name={`propertyTitle-${activeLanguage}`}
            className="form-control"
            value={inputValues.propertyTitle[activeLanguage]}
            onChange={handleDescriptionChange}
            placeholder={t('form.titlePlaceholder', { languageName: t(`languages.${activeLanguage}`) })}
          />
        )}
        {activeLanguage === 'en' && errors.propertyTitle && (
          <div className="error-message">{errors.propertyTitle.message}</div>
        )}
      </div>

      {/* Description Field */}
      <div className="form-group">
        <label htmlFor="description">{t('form.descriptionLabel')}</label>
        {activeLanguage === 'en' ? (
          <Controller
            name="description"
            control={control}
            defaultValue={inputValues.description.en}
            rules={{ required: t('form.descriptionRequiredError') }}
            render={({ field }) => (
              <textarea
                {...field}
                id="description-en"
                className="form-control"
                rows="4"
                style={errors.description ? { border: '1px solid #dc3545' } : {}}
                placeholder={t('form.descriptionPlaceholder', { languageName: t('languages.en') })}
              ></textarea>
            )}
          />
        ) : (
          <textarea
            id={`description-${activeLanguage}`}
            name={`description-${activeLanguage}`}
            className="form-control"
            rows="4"
            value={inputValues.description[activeLanguage]}
            onChange={handleDescriptionChange}
            placeholder={t('form.descriptionPlaceholder', { languageName: t(`languages.${activeLanguage}`) })}
          ></textarea>
        )}
        {activeLanguage === 'en' && errors.description && (
          <div className="error-message">{errors.description.message}</div>
        )}
      </div>

      {/* Payment Plan Field */}
      <div className="form-group">
        <label htmlFor="paymentPlan">{t('form.paymentPlanLabel')}</label>
        {activeLanguage === 'en' ? (
          <Controller
            name="paymentPlan"
            control={control}
            defaultValue={inputValues.paymentPlan.en}
            render={({ field }) => (
              <textarea
                {...field}
                id="paymentPlan-en"
                className="form-control"
                rows="2"
                placeholder={t('form.paymentPlanPlaceholder', { languageName: t('languages.en') })}
              ></textarea>
            )}
          />
        ) : (
          <textarea
            id={`paymentPlan-${activeLanguage}`}
            name={`paymentPlan-${activeLanguage}`}
            className="form-control"
            rows="2"
            value={inputValues.paymentPlan[activeLanguage]}
            onChange={handleDescriptionChange}
            placeholder={t('form.paymentPlanPlaceholder', { languageName: t(`languages.${activeLanguage}`) })}
          ></textarea>
        )}
      </div>
    </section>
  );
}

export default PropertyDescriptionSection;
