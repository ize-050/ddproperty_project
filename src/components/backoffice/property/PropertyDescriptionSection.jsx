'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';
import { FaGlobe, FaSpinner } from 'react-icons/fa';

const PropertyDescriptionSection = () => {
  const { formData, setDescription, setTranslatedDescriptions } = usePropertyFormStore();
  const { register, formState: { errors }, setValue, watch, getValues } = useFormContext();
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // State to track input values for all languages
  const [inputValues, setInputValues] = useState({
    propertyTitle: {
      en: formData.propertyTitle || '',
      th: formData.translatedTitles?.th || '',
      zh: formData.translatedTitles?.zh || '  ',
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

  // CSS class for error styling
  const getInputClassName = (fieldName) => {
    return 'form-control';
  };

  // Inline style for error styling
  const getErrorStyle = (fieldName) => {
    return errors[fieldName] ? {border: '1px solid #dc3545', boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'} : {};
  };

  const languages = [
    { code: 'en', name: 'ENGLISH (Main)', flag: '🇬🇧' },
    { code: 'th', name: 'THAI', flag: '🇹🇭' },
    { code: 'zh', name: 'CHINESE', flag: '🇨🇳' },
    { code: 'ru', name: 'RUSSIAN', flag: '🇷🇺' },
  ];

  // Sync formData with local state when component mounts or formData changes
  useEffect(() => {
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

  // Handle description change for the active language
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    const fieldId = e.target.id;

    // Update local state first
    setInputValues(prev => {
      const newValues = { ...prev };
      if (fieldId === 'propertyTitle') {
        newValues.propertyTitle[activeLanguage] = value;
      } else if (fieldId === 'paymentPlan') {
        newValues.paymentPlan[activeLanguage] = value;
      } else {
        newValues.description[activeLanguage] = value;
      }
      return newValues;
    });

    // Then update form and store
    if (activeLanguage === 'en') {
      // Update main description in English
      if (fieldId === 'propertyTitle') {
        setValue('propertyTitle', value);
        setDescription('propertyTitle', value);
      } else if (fieldId === 'paymentPlan') {
        setValue('paymentPlan', value);
        setDescription('paymentPlan', value);
      } else {
        setValue('description', value);
        setDescription('description', value);
      }
    } else {
      // Update translated description
      if (fieldId === 'propertyTitle') {
        // Update the nested object structure for React Hook Form
        const currentTranslatedTitles = getValues('translatedTitles') || {};
        setValue('translatedTitles', {
          ...currentTranslatedTitles,
          [activeLanguage]: value
        });
        // Also update the store
        setTranslatedDescriptions('titles', activeLanguage, value);
      } else if (fieldId === 'paymentPlan') {
        // Update the nested object structure for React Hook Form
        const currentTranslatedPaymentPlans = getValues('translatedPaymentPlans') || {};
        setValue('translatedPaymentPlans', {
          ...currentTranslatedPaymentPlans,
          [activeLanguage]: value
        });
        // Also update the store
        setTranslatedDescriptions('paymentPlans', activeLanguage, value);
      } else {
        // Update the nested object structure for React Hook Form
        const currentTranslatedDescriptions = getValues('translatedDescriptions') || {};
        setValue('translatedDescriptions', {
          ...currentTranslatedDescriptions,
          [activeLanguage]: value
        });
        // Also update the store
        setTranslatedDescriptions('descriptions', activeLanguage, value);
      }
    }
  };

  // Auto translate to a specific language
  const handleAutoTranslate = async (targetLang) => {
    // ตรวจสอบว่ามีข้อความที่จะแปลหรือไม่ ขึ้นอยู่กับฟิลด์ที่กำลังแปล
    const fieldToCheck = document.activeElement.id;

    let sourceText = '';
    let fieldType = '';

    if (fieldToCheck === 'propertyTitle' || fieldToCheck.includes('title')) {
      sourceText = getValues('propertyTitle');
      fieldType = 'titles';
    } else if (fieldToCheck === 'paymentPlan' || fieldToCheck.includes('payment')) {
      sourceText = getValues('paymentPlan');
      fieldType = 'paymentPlans';
    } else {
      sourceText = getValues('description');
      fieldType = 'descriptions';
    }

    if (!sourceText) {
      alert('Please enter content in English first');
      return;
    }

    setIsTranslating(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const text = encodeURIComponent(sourceText);

      const response = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: sourceText,
              target: targetLang,
              format: 'text'
            }),
          }
      );

      const data = await response.json();

      if (data.data && data.data.translations && data.data.translations.length > 0) {
        const translatedText = data.data.translations[0].translatedText;
        setTranslatedDescriptions(fieldType, targetLang, translatedText);
      } else {
        console.error('Translation failed:', data);
        alert('Translation failed. Please try again later.');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation service is currently unavailable. Please try again later.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Auto translate to all languages
  const handleTranslateAll = async () => {
    // ตรวจสอบว่ามีข้อมูลในภาษาที่กำลังใช้งานหรือไม่
    let hasContent = false;
    let sourceLanguage = activeLanguage;

    // ตรวจสอบว่ามีข้อมูลในฟิลด์ใดบ้าง
    let sourceTitle = '';
    let sourceDescription = '';
    let sourcePaymentPlan = '';

    if (sourceLanguage === 'en') {
      sourceTitle = formData.propertyTitle || '';
      sourceDescription = formData.description || '';
      sourcePaymentPlan = formData.paymentPlan || '';
    } else {
      sourceTitle = formData.translatedTitles?.[sourceLanguage] || '';
      sourceDescription = formData.translatedDescriptions?.[sourceLanguage] || '';
      sourcePaymentPlan = formData.translatedPaymentPlans?.[sourceLanguage] || '';
    }

    hasContent = sourceTitle || sourceDescription || sourcePaymentPlan;

    if (!hasContent) {
      alert(`Please enter content in ${languages.find(l => l.code === sourceLanguage)?.name} first`);
      return;
    }

    setIsTranslating(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      // กรองภาษาที่ต้องการแปลไป (ทุกภาษายกเว้นภาษาที่กำลังใช้งาน)
      const languagesToTranslate = languages.filter(lang => lang.code !== sourceLanguage);

      // แปลชื่อโครงการ
      if (sourceTitle) {
        const titlePromises = languagesToTranslate.map(async (lang) => {
          const response = await fetch(
              `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  q: sourceTitle,
                  source: sourceLanguage,
                  target: lang.code,
                  format: 'text'
                }),
              }
          );

          const data = await response.json();

          console.log("translate title", data);

          if (data.data && data.data.translations && data.data.translations.length > 0) {
            const translatedText = data.data.translations[0].translatedText;

            // Update local state
            setInputValues(prev => ({
              ...prev,
              propertyTitle: {
                ...prev.propertyTitle,
                [lang.code]: translatedText
              }
            }));

            // Update store
            setTranslatedDescriptions('titles', lang.code, translatedText);

            // Update React Hook Form
            const currentTranslatedTitles = getValues('translatedTitles') || {};
            setValue('translatedTitles', {
              ...currentTranslatedTitles,
              [lang.code]: translatedText
            });
          } else {
            console.error(`Title translation to ${lang.name} failed:`, data);
          }
        });

        await Promise.all(titlePromises);
      }

      // แปลรายละเอียดโครงการ
      if (sourceDescription) {
        const descPromises = languagesToTranslate.map(async (lang) => {
          const response = await fetch(
              `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  q: sourceDescription,
                  source: sourceLanguage,
                  target: lang.code,
                  format: 'text'
                }),
              }
          );

          const data = await response.json();

          if (data.data && data.data.translations && data.data.translations.length > 0) {
            const translatedText = data.data.translations[0].translatedText;

            // Update local state
            setInputValues(prev => ({
              ...prev,
              description: {
                ...prev.description,
                [lang.code]: translatedText
              }
            }));

            // Update store
            setTranslatedDescriptions('descriptions', lang.code, translatedText);

            // Update React Hook Form
            const currentTranslatedDescriptions = getValues('translatedDescriptions') || {};
            setValue('translatedDescriptions', {
              ...currentTranslatedDescriptions,
              [lang.code]: translatedText
            });
          } else {
            console.error(`Description translation to ${lang.name} failed:`, data);
          }
        });

        await Promise.all(descPromises);
      }

      // แปลแผนการชำระเงิน
      if (sourcePaymentPlan) {
        const paymentPromises = languagesToTranslate.map(async (lang) => {
          const response = await fetch(
              `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  q: sourcePaymentPlan,
                  source: sourceLanguage,
                  target: lang.code,
                  format: 'text'
                }),
              }
          );

          const data = await response.json();

          if (data.data && data.data.translations && data.data.translations.length > 0) {
            const translatedText = data.data.translations[0].translatedText;

            // Update local state
            setInputValues(prev => ({
              ...prev,
              paymentPlan: {
                ...prev.paymentPlan,
                [lang.code]: translatedText
              }
            }));

            // Update store
            setTranslatedDescriptions('paymentPlans', lang.code, translatedText);

            // Update React Hook Form
            const currentTranslatedPaymentPlans = getValues('translatedPaymentPlans') || {};
            setValue('translatedPaymentPlans', {
              ...currentTranslatedPaymentPlans,
              [lang.code]: translatedText
            });
          } else {
            console.error(`Payment plan translation to ${lang.name} failed:`, data);
          }
        });

        await Promise.all(paymentPromises);
      }

      // แปลกลับไปภาษาอังกฤษด้วยถ้าภาษาต้นทางไม่ใช่ภาษาอังกฤษ
      if (sourceLanguage !== 'en') {
        // แปลชื่อโครงการ
        if (sourceTitle) {
          try {
            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    q: sourceTitle,
                    source: sourceLanguage,
                    target: 'en',
                    format: 'text'
                  }),
                }
            );

            const data = await response.json();

            if (data.data && data.data.translations && data.data.translations.length > 0) {
              const translatedText = data.data.translations[0].translatedText;

              // Update local state
              setInputValues(prev => ({
                ...prev,
                propertyTitle: {
                  ...prev.propertyTitle,
                  en: translatedText
                }
              }));

              // Update store
              setDescription('propertyTitle', translatedText);
            }
          } catch (error) {
            console.error('Error translating title to English:', error);
          }
        }

        // แปลรายละเอียด
        if (sourceDescription) {
          try {
            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    q: sourceDescription,
                    source: sourceLanguage,
                    target: 'en',
                    format: 'text'
                  }),
                }
            );

            const data = await response.json();

            if (data.data && data.data.translations && data.data.translations.length > 0) {
              const translatedText = data.data.translations[0].translatedText;

              // Update local state
              setInputValues(prev => ({
                ...prev,
                description: {
                  ...prev.description,
                  en: translatedText
                }
              }));

              // Update store
              setDescription('description', translatedText);
            }
          } catch (error) {
            console.error('Error translating description to English:', error);
          }
        }

        // แปลแผนการชำระเงิน
        if (sourcePaymentPlan) {
          try {
            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    q: sourcePaymentPlan,
                    source: sourceLanguage,
                    target: 'en',
                    format: 'text'
                  }),
                }
            );

            const data = await response.json();

            if (data.data && data.data.translations && data.data.translations.length > 0) {
              const translatedText = data.data.translations[0].translatedText;

              // Update local state
              setInputValues(prev => ({
                ...prev,
                paymentPlan: {
                  ...prev.paymentPlan,
                  en: translatedText
                }
              }));

              // Update store
              setDescription('paymentPlan', translatedText);
            }
          } catch (error) {
            console.error('Error translating payment plan to English:', error);
          }
        }
      }

    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation service is currently unavailable. Please try again later.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
      <section className="form-section">
        <h2>Property Description</h2>

        <div className="language-tabs">
          {languages.map((lang) => (
              <button
                  key={lang.code}
                  type="button"
                  className={`language-tab ${activeLanguage === lang.code ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault(); // ป้องกันการเด้งไปบนสุด
                    setActiveLanguage(lang.code);
                  }}
              >
                <span className="language-flag">{lang.flag}</span>
                <span className="language-name">{lang.name}</span>
              </button>
          ))}
        </div>

        <div className="translate-all-container" style={{
          justifyContent: 'end',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <button
              type="button"
              className="translate-all-btn"
              onClick={(e) => {
                e.preventDefault(); // ป้องกันการเด้งไปบนสุด
                handleTranslateAll();
              }}
              disabled={isTranslating}
          >
            {isTranslating ? <FaSpinner className="spinner" /> : <FaGlobe />}
            Auto translate to all languages
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="propertyTitle">Property Title*</label>
          <input
              type="text"
              id="propertyTitle"
              className="form-control"
              style={activeLanguage === 'en' && errors.propertyTitle ? {border: '1px solid #dc3545', boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'} : {}}
              value={inputValues.propertyTitle[activeLanguage]}
              onChange={handleDescriptionChange}
              placeholder={`Enter property title in ${languages.find(l => l.code === activeLanguage)?.name}`}
              {...(activeLanguage === 'en' ? register('propertyTitle', { required: 'Property title is required', value: inputValues.propertyTitle.en }) : {})}
          />
          {activeLanguage === 'en' && errors.propertyTitle && (
              <div className="error-message">{errors.propertyTitle.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Property Description*</label>
          <textarea
              id="description"
              className="form-control"
              style={activeLanguage === 'en' && errors.description ? {border: '1px solid #dc3545', boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'} : {}}
              value={inputValues.description[activeLanguage]}
              onChange={handleDescriptionChange}
              placeholder={`Enter property description in ${languages.find(l => l.code === activeLanguage)?.name}`}
              rows={6}
              {...(activeLanguage === 'en' ? register('description', { required: 'Property description is required', value: inputValues.description.en }) : {})}
          />
          {activeLanguage === 'en' && errors.description && (
              <div className="error-message">{errors.description.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="paymentPlan">Payment Plan (Optional)</label>
          <textarea
              id="paymentPlan"
              className="form-control"
              value={inputValues.paymentPlan[activeLanguage]}
              onChange={handleDescriptionChange}
              placeholder={`Enter payment plan in ${languages.find(l => l.code === activeLanguage)?.name} (Optional)`}
              rows={4}
              {...(activeLanguage === 'en' ? register('paymentPlan', { value: inputValues.paymentPlan.en }) : {})}
          />
        </div>


      </section>
  );
};

export default PropertyDescriptionSection;
