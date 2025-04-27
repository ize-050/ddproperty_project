"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Select from 'react-select';
import Slider from 'rc-slider';
import useZoneStore from '@/store/useZoneStore';

const PropertyFilter = ({ filters, onFilterChange }) => {
  const t = useTranslations('PropertyFilter');
  const { zones } = useZoneStore();

  // สร้าง state สำหรับเก็บค่าการกรอง
  const [localFilters, setLocalFilters] = useState({
    propertyType: filters.propertyType || '',
    price: [
      parseInt(filters.minPrice) || 500000,
      parseInt(filters.maxPrice) || 20000000
    ],
    zoneId: filters.zoneId || '',
    listingType: filters.listingType || 'SALE',
    bedrooms: filters.bedrooms || '',
    bathrooms: filters.bathrooms || ''
  });

  // สร้าง state สำหรับควบคุมการแสดง/ซ่อน dropdown
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);

  // อัปเดต localFilters เมื่อ filters เปลี่ยนแปลง
  useEffect(() => {
    setLocalFilters({
      propertyType: filters.propertyType || '',
      price: [
        parseInt(filters.minPrice) || 500000,
        parseInt(filters.maxPrice) || 20000000
      ],
      zoneId: filters.zoneId || '',
      listingType: filters.listingType || 'SALE',
      bedrooms: filters.bedrooms || '',
      bathrooms: filters.bathrooms || ''
    });
  }, [filters]);

  // ฟังก์ชันสำหรับแปลงราคาให้อยู่ในรูปแบบที่อ่านง่าย
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M ฿`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K ฿`;
    }
    return `${price} ฿`;
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ price range
  const handlePriceChange = (value) => {
    setLocalFilters({
      ...localFilters,
      price: value
    });
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ property type
  const handlePropertyTypeChange = (value) => {
    setLocalFilters({
      ...localFilters,
      propertyType: value
    });
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ zone
  const handleZoneChange = (value) => {
    setLocalFilters({
      ...localFilters,
      zoneId: value
    });
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ listing type
  const handleListingTypeChange = (value) => {
    setLocalFilters({
      ...localFilters,
      listingType: value
    });
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ bedrooms
  const handleBedroomsChange = (value) => {
    setLocalFilters({
      ...localFilters,
      bedrooms: value
    });
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ bathrooms
  const handleBathroomsChange = (value) => {
    setLocalFilters({
      ...localFilters,
      bathrooms: value
    });
  };

  // ฟังก์ชันสำหรับส่งการเปลี่ยนแปลงการกรองไปยัง parent component
  const handleApplyFilters = () => {
    onFilterChange({
      propertyType: localFilters.propertyType,
      minPrice: localFilters.price[0],
      maxPrice: localFilters.price[1],
      zoneId: localFilters.zoneId,
      listingType: localFilters.listingType,
      bedrooms: localFilters.bedrooms,
      bathrooms: localFilters.bathrooms
    });
  };

  // ฟังก์ชันสำหรับรีเซ็ตการกรอง
  const handleResetFilters = () => {
    setLocalFilters({
      propertyType: '',
      price: [500000, 20000000],
      zoneId: '',
      listingType: 'SALE',
      bedrooms: '',
      bathrooms: ''
    });

    onFilterChange({
      propertyType: '',
      minPrice: 500000,
      maxPrice: 20000000,
      zoneId: '',
      listingType: 'SALE',
      bedrooms: '',
      bathrooms: ''
    });
  };

  // ตัวเลือกสำหรับ property type
  const propertyTypeOptions = [
    { value: '', label: t('allPropertyTypes') },
    { value: 'CONDO', label: t('condominium') },
    { value: 'APARTMENT', label: t('apartment') },
    { value: 'VILLA', label: t('villa') },
    { value: 'TOWNHOUSE', label: t('townhouse') },
    { value: 'HOUSE', label: t('house') }
  ];

  // ตัวเลือกสำหรับ listing type
  const listingTypeOptions = [
    { value: 'SALE', label: t('buy') },
    { value: 'RENT', label: t('rent') }
  ];

  // ตัวเลือกสำหรับ bedrooms
  const bedroomsOptions = [
    { value: '', label: t('anyBedrooms') },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5+' }
  ];

  // ตัวเลือกสำหรับ bathrooms
  const bathroomsOptions = [
    { value: '', label: t('anyBathrooms') },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4+' }
  ];

  // ตัวเลือกสำหรับ zone
  const zoneOptions = [
    { value: '', label: t('anyZone') },
    ...zones.map((zone) => ({
      value: zone.id.toString(),
      label: zone.nameEn
    }))
  ];

  // สไตล์สำหรับ Select component
  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isHovered
            ? "#eb675312"
            : isFocused
              ? "#eb675312"
              : undefined,
      };
    },
  };

  return (
    <div className="sidebar_listing_list">
      <div className="sidebar_advanced_search_widget">
        <h4 className="mb25">{t('advancedSearch')}</h4>

        {/* Listing Type */}
        <div className="form-group">
          <label>{t('listingType')}</label>
          <div className="ui_kit_radiobox">
            {listingTypeOptions.map((option) => (
              <div className="radio" key={option.value}>
                <input
                  id={`listingType-${option.value}`}
                  name="listingType"
                  type="radio"
                  checked={localFilters.listingType === option.value}
                  onChange={() => handleListingTypeChange(option.value)}
                />
                <label htmlFor={`listingType-${option.value}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="form-group">
          <label>{t('propertyType')}</label>
          <Select
            value={propertyTypeOptions.find(option => option.value === localFilters.propertyType)}
            options={propertyTypeOptions}
            styles={customStyles}
            className="text-start with_border"
            classNamePrefix="select"
            onChange={(option) => handlePropertyTypeChange(option.value)}
            isSearchable={false}
          />
        </div>

        {/* Zone */}
        <div className="form-group">
          <label>{t('zone')}</label>
          <Select
            value={zoneOptions.find(option => option.value === localFilters.zoneId)}
            options={zoneOptions}
            styles={customStyles}
            className="text-start with_border"
            classNamePrefix="select"
            onChange={(option) => handleZoneChange(option.value)}
            isSearchable={true}
          />
        </div>

        {/* Price Range */}
        <div className="form-group">
          <label>{t('priceRange')}</label>
          <div className="price-range-wrapper">
            <div
              className="price-display d-flex justify-content-between mb-3"
              onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
              style={{ cursor: 'pointer' }}
            >
              <span>{formatPrice(localFilters.price[0])}</span>
              <span>-</span>
              <span>{formatPrice(localFilters.price[1])}</span>
            </div>

            {isPriceDropdownOpen && (
              <div className="price-slider-container p-3 mb-3 border rounded">
                <Slider
                  range
                  min={0}
                  max={50000000}
                  value={localFilters.price}
                  onChange={handlePriceChange}
                  step={100000}
                />
                <div className="d-flex justify-content-between mt-2">
                  <span>{formatPrice(localFilters.price[0])}</span>
                  <span>{formatPrice(localFilters.price[1])}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bedrooms */}
        <div className="form-group">
          <label>{t('bedrooms')}</label>
          <Select
            value={bedroomsOptions.find(option => option.value === localFilters.bedrooms)}
            options={bedroomsOptions}
            styles={customStyles}
            className="text-start with_border"
            classNamePrefix="select"
            onChange={(option) => handleBedroomsChange(option.value)}
            isSearchable={false}
          />
        </div>

        {/* Bathrooms */}
        <div className="form-group">
          <label>{t('bathrooms')}</label>
          <Select
            value={bathroomsOptions.find(option => option.value === localFilters.bathrooms)}
            options={bathroomsOptions}
            styles={customStyles}
            className="text-start with_border"
            classNamePrefix="select"
            onChange={(option) => handleBathroomsChange(option.value)}
            isSearchable={false}
          />
        </div>

        {/* Filter Buttons */}
        <div className="form-group d-flex justify-content-between">
          <button
            className="btn btn-thm btn-block"
            onClick={handleApplyFilters}
          >
            {t('applyFilters')}
          </button>
          <button
            className="btn btn-outline-secondary btn-block ml-2"
            onClick={handleResetFilters}
          >
            {t('resetFilters')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
