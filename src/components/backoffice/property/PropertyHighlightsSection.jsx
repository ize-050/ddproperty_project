'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getIconsByPrefix } from '@/services/iconService';
import usePropertyFormStore from '@/store/propertyFormStore';
import { useFormContext } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

const PropertyHighlightsSection = () => {
  const t = useTranslations('backoffice.propertyHighlights');
  const { formData, setHighlight, initializeHighlights, setPropertyLabel, initializePropertyLabels } = usePropertyFormStore();
  const [highlightIcons, setHighlightIcons] = useState({});
  const [labelIcons, setLabelIcons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register } = useFormContext();

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        setLoading(true);
        const [highlightResponse, labelResponse] = await Promise.all([
          getIconsByPrefix('highlight'),
          getIconsByPrefix('property-label'),
        ]);

        if (highlightResponse && labelResponse) {
          setHighlightIcons(highlightResponse.data || {});
          setLabelIcons(labelResponse.data || {});
          initializeHighlights(highlightResponse.data || {});
          initializePropertyLabels(labelResponse.data || {});
        } else {
          throw new Error(t('fetchError'));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, [initializeHighlights, initializePropertyLabels, t]);

  const handleItemClick = (type, key, active, id) => {
    const newValue = !active;
    if (type === 'highlight') {
      setHighlight(key, newValue, id);
    } else if (type === 'label') {
      setPropertyLabel(key, newValue, id);
    }
  };

  const renderIcons = (type, title, icons, data, noDataMessage) => {
    const activeStyle = {
      backgroundColor: '#E8F5E9',
      borderColor: '#A5D6A7',
      color: '#000',
    };

    return (
      <section className="form-section">
        <h2>{title}</h2>
        {icons.length > 0 ? (
          <div className="amenities-grid">
            {icons.map((icon) => {
              const fieldName = `${type}s.${icon.key}`;
              const isActive = Boolean(data?.[icon.key]?.active);
              return (
                <div
                  key={icon.id}
                  className="amenity-item"
                  style={isActive ? activeStyle : {}}
                  onClick={() => handleItemClick(type, icon.key, isActive, icon.id)}
                >
                  <input type="hidden" {...register(fieldName)} value={isActive.toString()} />
                  <span className="amenity-label">{icon.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p>{noDataMessage}</p>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <section className="form-section">
        <h2>{t('title')}</h2>
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" /> {t('loading')}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="form-section">
        <h2>{t('title')}</h2>
        <div className="error-message">{t('error', { error })}</div>
      </section>
    );
  }

  return (
    <>
      {renderIcons('highlight', t('title'), highlightIcons.highlight || [], formData.highlights, t('noHighlights'))}
      {renderIcons('label', t('labelTitle'), labelIcons.label || [], formData.propertyLabels, t('noLabels'))}
    </>
  );
};

export default PropertyHighlightsSection;
