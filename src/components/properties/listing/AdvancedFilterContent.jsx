import React, { useEffect, useState } from "react";


import { FiX } from "react-icons/fi";

import Slider, { Range } from "rc-slider";
import Select from "react-select";
import { customStyles } from "@/components/common/SelectWithInstanceId";

//store
import useZoneStore from '@/store/useZoneStore';
import usePropertyFilterStore from '@/store/usePropertyFilterStore';

//service
import getProperties from '@/utils/properties';

const PROPERTY_TYPES = [
  { value: 'CONDO', label: 'Condominium' },
  { value: 'HOUSE', label: 'House' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'LAND', label: 'Land' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'WAREHOUSE', label: 'Warehouse' },
  { value: 'FACTORY', label: 'Factory' },
  { value: 'HOTEL', label: 'Hotel' },
  { value: 'RESORT', label: 'Resort' },
];





export default function AdvancedFilterContent({ onClose ,type }) {
  const zones = useZoneStore((s) => s.zones);


  const setPropertyItems = usePropertyFilterStore((s) => s.setPropertyItems);
  const setPaginationItems = usePropertyFilterStore((s) => s.setPaginationItems);
  const [dataZone, setDataZone] = useState([{
    value: null,
    label: null,
  }])
  const {
    propertyType,
    minPrice,
    maxPrice,
    zoneId,
    bedrooms,
    bathrooms,
    setPropertyType,
    setMinPrice,
    setMaxPrice,
    setZoneId,
    setBedrooms,
    setBathrooms,
    resetFilters
  } = usePropertyFilterStore();

  // Helper for rendering options
  const bedroomOptions = ["", "1", "2", "3", "4", "5"];
  const bathroomOptions = ["", "1", "2", "3", "4", "5"];

  useEffect(() => {
    setDataZone(zones.map((zone) => {
      return {
        value: zone.id,
        label: zone.name,
      }
    }))
  }, [zones])

  const handleSearch = () => {
    // Build query params string
    const params = new URLSearchParams();
    if (propertyType) params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (zoneId) params.set('zoneId', zoneId);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (bathrooms) params.set('bathrooms', bathrooms);

    if(type) params.set('type', type);



    // Update URL params WITHOUT reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);

    // Call API as before
    const Request = {
      propertyType: propertyType,
      minPrice: minPrice,
      maxPrice: maxPrice,
      zoneId: zoneId,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
    }

    getProperties(Request).then((res) => {
      setPropertyItems(res.data);
      setPaginationItems(res.pagination);
      onClose();
    });
  };

  return (
    <div className="advanced-filter-content">
      <div className="filter-header">
        <span className="filter-title">More Filter</span>
        <button className="modal-close-btn" onClick={onClose}><FiX size={24} /></button>
      </div>
      <hr className="divider" />
      {/* Price Range */}
      <div className="filter-section">
        <label className="filter-label">Price Range</label>
        <div className="price-slider-row price-slider-single" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.98rem', color: '#222' }}>Min: {minPrice.toLocaleString()} THB</span>
            <span style={{ fontSize: '0.98rem', color: '#222' }}>Max: {maxPrice.toLocaleString()} THB</span>
          </div>
          <Slider
            range
            max={30000000}
            min={0}
            defaultValue={[minPrice, maxPrice]}
            onChange={(value) => {
              setMinPrice(value[0]);
              setMaxPrice(value[1]);
            }}
            id="slider"
          />
        </div>
      </div>
      {/* Type & Location */}
      <div className="filter-row">
        <div className="filter-col">
          <label className="filter-label">Type</label>

          <Select
            defaultValue={PROPERTY_TYPES[0]}
            name="colors"
            options={PROPERTY_TYPES}
            styles={customStyles}
            onChange={(option) => setPropertyType(option.value)}
            className="select-custom"
            classNamePrefix="select"
            required
          />
        </div>
        <div className="filter-col">
          <label className="filter-label">Location</label>
          <Select
            defaultValue={dataZone[1]}
            name="colors"
            options={dataZone}
            styles={customStyles}
            onChange={(option) => setZoneId(option.value)}
            className="select-custom"
            classNamePrefix="select"
            required
          />
        </div>
      </div>
      {/* Bedrooms & Bathrooms */}
      <div className="filter-row">
        <div className="filter-col">
          <label className="filter-label">Bedrooms</label>
          <div className="option-list option-list-wrap">
            {bedroomOptions.map((val, i) => (
              <div
                key={val || 'any'}
                className={"option" + (bedrooms === val ? " active" : "")}
                onClick={() => setBedrooms(val)}
              >{val ? `${val}+` : 'any'}</div>
            ))}
          </div>
        </div>
        <div className="filter-col">
          <label className="filter-label">Bathrooms</label>
          <div className="option-list option-list-wrap">
            {bathroomOptions.map((val, i) => (
              <div
                key={val || 'any'}
                className={"option" + (bathrooms === val ? " active" : "")}
                onClick={() => setBathrooms(val)}
              >{val ? `${val}+` : 'any'}</div>
            ))}

          </div>
        </div>
      </div>
      {/* Reset & Search */}
      <div className="filter-footer">
        <button className="reset-link" onClick={resetFilters}>Reset all filters</button>
        <button className="search-btn-modal" onClick={handleSearch}><span className="icon-search" /> Search</button>
      </div>
    </div>
  );
}
