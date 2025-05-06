'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';

const PropertyMap = ({ property }) => {
  const t = useTranslations('PropertyDetail');
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const [map, setMap] = useState(null);

  // โหลด Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  // ค่าเริ่มต้นเป็นกรุงเทพฯ ถ้าไม่มีข้อมูล
  const defaultCenter = {
    lat: 13.7563,
    lng: 100.5018
  };

  // ตรวจสอบว่ามีข้อมูล latitude และ longitude หรือไม่
  const latitude = property?.latitude ? parseFloat(property.latitude) : defaultCenter.lat;
  const longitude = property?.longitude ? parseFloat(property.longitude) : defaultCenter.lng;

  const center = {
    lat: latitude,
    lng: longitude
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true
  };

  // เมื่อแผนที่โหลดเสร็จ
  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // เมื่อ component unmount
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // เปิด/ปิด InfoWindow
  const toggleInfoWindow = () => {
    setIsInfoWindowOpen(!isInfoWindowOpen);
  };

  // ข้อมูลที่จะแสดงใน InfoWindow
  const getInfoWindowContent = () => {
    return (
      <div className="info-window">
        <h5>{property?.projectName || t('propertyLocation')}</h5>
        <p>{property?.address || t('addressNotAvailable')}</p>
      </div>
    );
  };

  // แสดงข้อความโหลดถ้า Google Maps API ยังไม่พร้อม
  if (!isLoaded) {
    return (
      <div className="property-map-container">
        <h3 className="section-title mb-4">{t('location')}</h3>
        <div style={mapContainerStyle} className="d-flex align-items-center justify-content-center bg-light">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">{t('loadingMap')}</p>
          </div>
        </div>

        {/* แสดงที่อยู่ด้านล่างแผนที่ */}
        <div className="property-address mt-3">
          <i className="fas fa-map-marker-alt me-2"></i>
          <span>{property?.address || t('addressNotAvailable')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="property-map-container">
      <h3 className="section-title mb-4">{t('location')}</h3>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={options}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
      >
        <Marker
          position={center}
          onClick={toggleInfoWindow}
        >
          {isInfoWindowOpen && (
            <InfoWindow
              position={center}
              onCloseClick={toggleInfoWindow}
            >
              <div>
                {getInfoWindowContent()}
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>

    </div>
  );
};

export default PropertyMap;
