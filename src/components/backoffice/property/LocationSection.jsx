'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';
import usePropertyFormStore from '@/store/propertyFormStore';
import Script from 'next/script';

const LocationSection = () => {
  const t = useTranslations('backoffice.location');
  const { formData, showMap, toggleMap, setFormData, setShowMap } = usePropertyFormStore();
  const { register, formState: { errors }, setValue } = useFormContext();
  const [searchAddress, setSearchAddress] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const mapRef = useRef(null);

  // Google Maps API Key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // ซิงค์ข้อมูลจาก form ไปยัง store
  const { watch } = useFormContext();
  const watchedFields = watch();

  useEffect(() => {
    // อัพเดท store เมื่อมีการเปลี่ยนแปลงค่าใน form
    const fieldsToUpdate = [
      'address', 'city', 'district', 'subdistrict', 'postalCode',
      'latitude', 'longitude', 'country', 'province'
    ];

    const updates = {};
    fieldsToUpdate.forEach(field => {
      if (watchedFields[field] !== undefined && watchedFields[field] !== formData[field]) {
        updates[field] = watchedFields[field];
      }
    });

    if (Object.keys(updates).length > 0) {
      setFormData(updates);
    }
  }, [watchedFields, setFormData, formData]);

  // ตั้งค่าเริ่มต้นจาก store ไปยัง form
  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        setValue(key, value);
      }
    });
  }, [setValue]);

  // ใส่กลับไปที่เดิมหลังจาก useEffect ที่โหลดข้อมูลแรกสุด
  useEffect(() => {
    setShowMap(true);
  }, []);

  // เพิ่ม useEffect ใหม่เพื่อจัดการเมื่อพิกัดเปลี่ยน
  useEffect(() => {
    // ถ้าแผนที่และมาร์กเกอร์พร้อมแล้ว และมีพิกัดใน formData
    if (map && marker && (formData.latitude && formData.longitude)) {
      const newPosition = new window.google.maps.LatLng(
        parseFloat(formData.latitude),
        parseFloat(formData.longitude)
      );

      // อัพเดตตำแหน่งมาร์กเกอร์
      marker.setPosition(newPosition);

      // เลื่อนแผนที่ไปยังตำแหน่งใหม่
      map.panTo(newPosition);
    }
  }, [formData.latitude, formData.longitude, map, marker]);

  // Initialize map when component mounts and API is loaded
  useEffect(() => {
    if (showMap && mapLoaded && !map) {
      initMap();
    }
  }, [showMap, mapLoaded]);

  // Initialize the map
  const initMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.log('Map reference or Google Maps not available');
      return;
    }

    try {
      const defaultLat = formData.latitude || 13.7563;
      const defaultLng = formData.longitude || 100.5018;

      const mapOptions = {
        center: { lat: defaultLat, lng: defaultLng },
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      const newMarker = new window.google.maps.Marker({
        position: { lat: defaultLat, lng: defaultLng },
        map: newMap,
        draggable: true,
        title: t('propertyLocationMarker')
      });
      setMarker(newMarker);

      // Create geocoder
      const newGeocoder = new window.google.maps.Geocoder();
      setGeocoder(newGeocoder);

      // Add event listener for marker drag end
      newMarker.addListener('dragend', () => {
        const position = newMarker.getPosition();
        const lat = position.lat();
        const lng = position.lng();

        // Update form data
        updateCoordinates(lat, lng);

        // Reverse geocode to get address
        reverseGeocode(lat, lng);
      });

      // Add event listener for map click
      newMap.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Update marker position
        newMarker.setPosition(e.latLng);

        // Update form data
        updateCoordinates(lat, lng);

        // Reverse geocode to get address
        reverseGeocode(lat, lng);
      });

      // Setup autocomplete for search
      if (window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          document.getElementById('searchAddress'),
          {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: 'th' }
          }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (!place.geometry) {
            return;
          }

          // Update map center and marker
          newMap.setCenter(place.geometry.location);
          newMarker.setPosition(place.geometry.location);

          // Update coordinates
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          updateCoordinates(lat, lng);

          // Extract address components
          let address = place.formatted_address || '';
          let city = '';
          let district = '';
          let subdistrict = '';
          let postalCode = '';

          if (place.address_components) {
            place.address_components.forEach(component => {
              const types = component.types;

              if (types.includes('administrative_area_level_1')) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_2')) {
                district = component.long_name;
              } else if (types.includes('administrative_area_level_3') || types.includes('sublocality_level_1')) {
                subdistrict = component.long_name;
              } else if (types.includes('postal_code')) {
                postalCode = component.long_name;
              }
            });
          }

          // Update form fields with react-hook-form
          setValue('address', address, { shouldDirty: true, shouldValidate: true });
          setValue('province', city, { shouldDirty: true, shouldValidate: true });
          setValue('district', district, { shouldDirty: true, shouldValidate: true });
          setValue('subdistrict', subdistrict, { shouldDirty: true, shouldValidate: true });
          setValue('postalCode', postalCode, { shouldDirty: true, shouldValidate: true });

          // หมายเหตุ: ไม่ต้องใช้ setFormData โดยตรงแล้ว เพราะมี useEffect ที่คอยอัพเดท store เมื่อ form เปลี่ยนแปลง

          // Update search address state
          setSearchAddress(address);
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // Update coordinates in form data
  const updateCoordinates = (lat, lng) => {
    // ใช้ setValue จาก react-hook-form แทนการใช้ setFormData โดยตรง
    setValue('latitude', lat, { shouldDirty: true, shouldValidate: true });
    setValue('longitude', lng, { shouldDirty: true, shouldValidate: true });
    // หมายเหตุ: ไม่ต้องใช้ setFormData โดยตรงแล้ว เพราะมี useEffect ที่คอยอัพเดท store เมื่อ form เปลี่ยนแปลง
  };

  // Reverse geocode to get address from coordinates
  const reverseGeocode = (lat, lng) => {
    if (!geocoder) return;

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        setSearchAddress(address);

        // Extract address components
        let city = '';
        let district = '';
        let subdistrict = '';
        let postalCode = '';

        results[0].address_components.forEach(component => {
          const types = component.types;

          if (types.includes('administrative_area_level_1')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            district = component.long_name;
          } else if (types.includes('administrative_area_level_3') || types.includes('sublocality_level_1')) {
            subdistrict = component.long_name;
          } else if (types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });

        // Update form fields
        setValue('address', address);
        setValue('province', city);
        setValue('district', district);
        setValue('subdistrict', subdistrict);
        setValue('postalCode', postalCode);
      }
    });
  };

  // Search for address and update map
  const searchForAddress = () => {
    if (!geocoder || !searchAddress) return;

    geocoder.geocode({ address: searchAddress }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        // Update map center
        map.setCenter(location);

        // Update marker position
        marker.setPosition(location);

        // Update form data
        updateCoordinates(lat, lng);

        // Update address fields
        const address = results[0].formatted_address;
        setSearchAddress(address);

        // Extract address components
        let city = '';
        let district = '';
        let subdistrict = '';
        let postalCode = '';

        results[0].address_components.forEach(component => {
          const types = component.types;

          if (types.includes('administrative_area_level_1')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            district = component.long_name;
          } else if (types.includes('administrative_area_level_3') || types.includes('sublocality_level_1')) {
            subdistrict = component.long_name;
          } else if (types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });

        // Update form fields
        setValue('address', address);
        setValue('province', city);
        setValue('district', district);
        setValue('subdistrict', subdistrict);
        setValue('postalCode', postalCode);
      } else {
        alert(t('addressNotFound'));
      }
    });
  };

  // CSS class for error styling
  const getInputClassName = (fieldName) => {
    return `form-control ${errors[fieldName] ? 'is-invalid' : ''}`;
  };

  const renderInput = (name, type = 'text', options = {}) => (
    <div className="form-group">
      <label htmlFor={name}>{t(`${name}Label`)}</label>
      <input
        type={type}
        id={name}
        className={getInputClassName(name)}
        placeholder={t(`${name}Placeholder`)}
        defaultValue={formData[name] || ''}
        step={type === 'number' ? 'any' : undefined}
        {...register(name, { ...options })}
      />
      {errors[name] && (
        <div className="invalid-feedback">{errors[name].message}</div>
      )}
    </div>
  );

  return (
    <section className="form-section">
      <h2>{t('title')}</h2>

      <div className="form-group map-toggle">
        <label>{t('toggleMap')}</label>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="mapToggle"
            checked={showMap}
            onChange={toggleMap}
          />
          <label htmlFor="mapToggle"></label>
        </div>
      </div>

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        onLoad={() => setMapLoaded(true)}
      />

      {showMap && (
        <div className="map-section">
          <div className="search-box">
            <label htmlFor="searchAddress">{t('searchAddress')}</label>
            <div className="search-input-container">
              <input
                type="text"
                id="searchAddress"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="form-control"
                autoComplete="off"
              />
            </div>
            <style jsx global>{`
              .pac-container {
                z-index: 10000;
                width: auto !important;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                font-family: inherit;
                margin-top: 5px;
              }
              .pac-item {
                padding: 8px 10px;
                cursor: pointer;
              }
              .pac-item:hover {
                background-color: #f8f9fa;
              }
            `}</style>
          </div>

          <div
            ref={mapRef}
            style={{
              height: '400px',
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          ></div>
        </div>
      )}

      {renderInput('address')}

      <div className="form-row">
        {renderInput('country')}
        {renderInput('province')}
      </div>

      <div className="form-row">
        {renderInput('district')}
        {renderInput('subdistrict')}
      </div>

      <div className="form-row">
        {renderInput('postalCode')}
        {renderInput('latitude', 'number')}
      </div>
      <div className="form-row">
        {renderInput('longitude', 'number')}
        <div className="form-group"></div>
      </div>
    </section>
  );
};

export default LocationSection;
