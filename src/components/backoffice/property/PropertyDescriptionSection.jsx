'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';
import { FaGlobe, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
const PropertyDescriptionSection = () => {
  const t = useTranslations('backoffice.propertyDescription');
  const { formData, setDescription, setTranslatedDescriptions } = usePropertyFormStore();
  const { register, formState: { errors }, setValue, watch, getValues } = useFormContext();
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'error' });

  const [inputValues, setInputValues] = useState({
    propertyTitle: { en: '', th: '', zh: '', ru: '' },
    description: { en: '', th: '', zh: '', ru: '' },
    paymentPlan: { en: '', th: '', zh: '', ru: '' }
  });

  const languages = [
    { code: 'en', flag: '🇬🇧' },
    { code: 'th', flag: '🇹🇭' },
    { code: 'zh', flag: '🇨🇳' },
    { code: 'ru', flag: '🇷🇺' },
  ];

  useEffect(() => {
    setValue('propertyTitle', formData.propertyTitle || '');
    setValue('description', formData.description || '');
    setValue('paymentPlan', formData.paymentPlan || '');
    setValue('translatedTitles', formData.translatedTitles || {});
    setValue('translatedDescriptions', formData.translatedDescriptions || {});
    setValue('translatedPaymentPlans', formData.translatedPaymentPlans || {});
    
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
  }, [formData, setValue]);

  useEffect(() => {
    if (alertInfo.open) {
      const timer = setTimeout(() => setAlertInfo({ open: false, message: '', severity: 'error' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const handleDescriptionChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.startsWith('propertyTitle') ? 'propertyTitle' : id.startsWith('description') ? 'description' : 'paymentPlan';

    setInputValues(prev => ({ ...prev, [fieldName]: { ...prev[fieldName], [activeLanguage]: value } }));

    if (activeLanguage === 'en') {
      setValue(fieldName, value);
      setDescription(fieldName, value);
    } else {
      const storeKey = fieldName === 'propertyTitle' ? 'titles' : fieldName === 'description' ? 'descriptions' : 'paymentPlans';
      const formKey = fieldName === 'propertyTitle' ? 'translatedTitles' : fieldName === 'description' ? 'translatedDescriptions' : 'translatedPaymentPlans';
      const currentTranslations = getValues(formKey) || {};
      setValue(formKey, { ...currentTranslations, [activeLanguage]: value });
      setTranslatedDescriptions(storeKey, activeLanguage, value);
    }
  };

  const handleTranslateAll = async () => {
    const sourceLanguage = 'en';
    const sourceTitle = getValues('propertyTitle');
    const sourceDescription = getValues('description');

    if (!sourceTitle || !sourceDescription) {
      setAlertInfo({ open: true, message: t('alerts.enterEnglishFirst'), severity: 'warning' });
      return;
    }

    setIsTranslating(true);
    const sourcePaymentPlan = getValues('paymentPlan');
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
              const currentTranslations = getValues(formKey) || {};
              setValue(formKey, { ...currentTranslations, [lang.code]: translatedText });
              setTranslatedDescriptions(storeKey, lang.code, translatedText);
            } else {
              throw new Error(`Translation to ${lang.code} failed`);
            }
          });
          translatePromises.push(promise);
        });
      }
    });

    try {
      await Promise.all(translatePromises);
    } catch (error) {
      console.error('Translation error:', error);
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
            <span className="language-flag">{lang.flag}</span>
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

      <div className="form-group">
        <label htmlFor="propertyTitle">{t('form.titleLabel')}</label>
        <input
          type="text"
          id="propertyTitle"
          className="form-control"
          style={activeLanguage === 'en' && errors.propertyTitle ? { border: '1px solid #dc3545' } : {}}
          value={inputValues.propertyTitle[activeLanguage]}
          onChange={handleDescriptionChange}
          placeholder={t('form.titlePlaceholder', { languageName: t(`languages.${activeLanguage}`) })}
          {...(activeLanguage === 'en' && register('propertyTitle', { required: t('form.titleRequiredError') }))}
        />
        {activeLanguage === 'en' && errors.propertyTitle && (
          <div className="error-message">{errors.propertyTitle.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">{t('form.descriptionLabel')}</label>
        <textarea
          id="description"
          className="form-control"
          style={activeLanguage === 'en' && errors.description ? { border: '1px solid #dc3545' } : {}}
          value={inputValues.description[activeLanguage]}
          onChange={handleDescriptionChange}
          placeholder={t('form.descriptionPlaceholder', { languageName: t(`languages.${activeLanguage}`) })}
          rows={6}
          {...(activeLanguage === 'en' && register('description', { required: t('form.descriptionRequiredError') }))}
        />
        {activeLanguage === 'en' && errors.description && (
          <div className="error-message">{errors.description.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="paymentPlan">{t('form.paymentPlanLabel')}</label>
        <textarea
          id="paymentPlan"
          className="form-control"
          value={inputValues.paymentPlan[activeLanguage]}
          onChange={handleDescriptionChange}
          placeholder={t('form.paymentPlanPlaceholder', { languageName: t(`languages.${activeLanguage}`) })}
          rows={4}
        />
      </div>
    </section>
  );
};

export default PropertyDescriptionSection;
