'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { convertAndFormatPrice } from '@/utils/currencyUtils';
import useDynamicTranslations from '@/hooks/useDynamicTranslations';

// Import components
import PropertyBreadcrumb from './components/PropertyBreadcrumb';
import PropertyHeader from './components/PropertyHeader';
import PropertyGalleryWithSuspense from './components/PropertyGalleryWithSuspense';
import PropertyContent from './components/PropertyContent';
import PropertySidebar from './components/PropertySidebar';
import PropertyUnitPlan from './components/PropertyUnitPlan';
import PropertyFloorPlan from './components/PropertyFloorPlan';
import FooterBanner from './components/FooterBanner';
import RelatedListings from './components/RelatedListings'
// Import styles
import '@/styles/property-detail.scss';
import '@/styles/property-detail-sections.scss';

const PropertyDetailPage = ({ property }) => {
  const t = useTranslations('PropertyDetail');
  const router = useRouter();
  const locale = useLocale();
  
  // Use dynamic translations hook for listing section
  const { 
    t: dynamicT, 
    getPropertyTypeText, 
    getListingTypeText, 
    loading: translationsLoading 
  } = useDynamicTranslations('listing');

  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyDescription, setPropertyDescription] = useState('');
  const [youtubeVideo, setYoutubeVideo] = useState('');
  const [paymentPlan, setPaymentPlan] = useState('');
  
  // Ref to track if view has been tracked for this property
  const viewTrackedRef = useRef(new Set());

  // Function to track property view (with persistent duplicate prevention)
  const trackPropertyView = async (propertyId) => {
    const sessionKey = `property_view_tracked_${propertyId}`;
    
    // Check if view has already been tracked for this property in this session
    if (sessionStorage.getItem(sessionKey)) {
      console.log('View already tracked for property in this session:', propertyId);
      return;
    }
    
    // Also check ref for immediate duplicate prevention
    if (viewTrackedRef.current.has(propertyId)) {
      console.log('View already tracked for property (ref check):', propertyId);
      return;
    }
    
    try {
      console.log('Tracking view for property:', propertyId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('View tracked successfully:', result);
        // Mark this property as tracked in both ref and sessionStorage
        viewTrackedRef.current.add(propertyId);
        sessionStorage.setItem(sessionKey, 'true');
      }
    } catch (error) {
      console.error('Error tracking view:', error);
      // Don't throw error - view tracking shouldn't break the page
    }
  };

  useEffect(() => {
    if (property) {
      // Track property view when component mounts (only once per property)
      trackPropertyView(property.id);

      let desc = '';
      if (locale !== 'en') {
        const descriptionObj = property.translatedDescriptions?.[locale];
        desc = descriptionObj || property.description || '';
      } else {
        desc = property.description || '';
      }

      if (locale !== 'en') {
        const paymentPlan = property.translatedPaymentPlans?.[locale] || property.paymentPlan || '';
        setPaymentPlan(paymentPlan);
      } else {
        const paymentPlan = property.paymentPlan || '';
        setPaymentPlan(paymentPlan);
      }




      // รูปภาพทั้งหมดของ property (เรียงลำดับตาม sortOrder)
      const imgs = property.images && property.images.length > 0
        ? property.images
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map(img => `${process.env.NEXT_PUBLIC_IMAGE_URL}${img.url}`)
        : ['/images/property/fp1.jpg'];

      console.log("images", imgs);
      setCurrentImageIndex(0);
      setPropertyImages(imgs);
      setPropertyDescription(desc);
      let youtubeUrl = property.socialMedia.youtubeUrl;

      // แปลง YouTube URL เป็น embed URL
      if (youtubeUrl) {
        // กรณีเป็น URL ปกติ เช่น https://www.youtube.com/watch?v=VIDEO_ID
        if (youtubeUrl.includes('watch?v=')) {
          const videoId = new URL(youtubeUrl).searchParams.get('v');
          youtubeUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        // กรณีเป็น youtu.be/VIDEO_ID
        else if (youtubeUrl.includes('youtu.be/')) {
          const videoId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0];
          if (videoId) {
            youtubeUrl = `https://www.youtube.com/embed/${videoId}`;
          }
        }
        // กรณีที่ไม่ได้เป็น embed URL
        else if (!youtubeUrl.includes('/embed/')) {
          youtubeUrl = '';
        }
      }

      console.log("youtubeUrl (embed)", youtubeUrl);
      setYoutubeVideo(youtubeUrl);
    }
  }, [property]);



  // ถ้าไม่มีข้อมูล property
  if (!property) {
    return (
      <div className="container mt100 mb100">
        <div className="row">
          <div className="col-lg-12">
            <div className="alert alert-danger">
              <h3>{t('propertyNotFound')}</h3>
              <p>{t('propertyNotFoundDescription')}</p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => router.back()}
              >
                {t('goBack')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }





  // แปลงข้อมูลการตกแต่งเป็นข้อความ
  const getFurnishingText = (furnishing) => {
    const types = {
      FULLY_FURNISHED: {
        th: 'เฟอร์นิเจอร์ครบ',
        en: 'Fully Furnished',
        zh: '全装修',
        ru: 'Полностью меблирована'
      },
      PARTIALLY_FURNISHED: {
        th: 'เฟอร์นิเจอร์บางส่วน',
        en: 'Partially Furnished',
        zh: '部分装修',
        ru: 'Частично меблирована'
      },
      UNFURNISHED: {
        th: 'ไม่มีเฟอร์นิเจอร์',
        en: 'Unfurnished',
        zh: '无装修',
        ru: 'Без мебели'
      }
    };

    return types[furnishing]?.[locale] || types[furnishing]?.en || furnishing;
  };

  // ฟอร์แมตราคา
  const formatPrice = (price) => {
    // ใช้ utility function ที่สร้างไว้สำหรับการแปลงราคาตามภาษา
    return convertAndFormatPrice(price, locale, false); // ไม่แสดงสัญลักษณ์สกุลเงินเพราะจะใส่แยก
  };

  const primaryListing = property?.listings || null;



  return (
    <>
      {/* Breadcrumb */}
      <PropertyBreadcrumb property={property} />

      {/* Property Header Section */}
      <PropertyHeader
        property={property}
        primaryListing={primaryListing}
        getListingTypeText={getListingTypeText}
        getPropertyTypeText={getPropertyTypeText}
        formatPrice={formatPrice}
      />

      {/* Property Gallery Section */}
      <PropertyGalleryWithSuspense
        images={propertyImages}
        property={property}
      />

      {/* Main Content Section */}
      <section className="property-details-section bg-white py-5">
        <div className="container">
          <div className="row">
            {/* Left Content */}
            <div className="col-lg-8">
              <PropertyContent
                property={property}
                description={propertyDescription}
                getPropertyTypeText={getPropertyTypeText}
                getFurnishingText={getFurnishingText}
              />

              <hr></hr>

              {property?.floorPlans?.length > 0 && (
                <>
                  <PropertyFloorPlan property={property} />
                  <hr></hr>
                </>
              )}

              {property?.unitPlans?.length > 0 && (
                <>
                  <PropertyUnitPlan property={property} />
                  <hr></hr>
                </>
              )}

              {youtubeVideo != '' && (
                <>
                  <div className="property-section mb-5">
                    <h3 className="section-title mb-3">{dynamicT('video', 'Video')}</h3>
                    <div className="video-container" style={{
                      position: 'relative',
                      paddingBottom: '56.25%', // 16:9 aspect ratio
                      height: 0,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                      <iframe
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        src={youtubeVideo}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  <hr></hr>
                </>
              )}
              {paymentPlan && (
                <>
                  <div className="property-section mb-5">
                    <h3 className="section-title mb-3">{dynamicT('payment-plan', 'Payment Plan')}</h3>
                    <div className="payment-plan-container">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: paymentPlan.replace(/\n/g, '<br>') 
                        }}
                      />
                    </div>
                  </div>

                  <hr></hr>
                </>

              )}
            </div>
            {/* Right Sidebar */}
            <div className="col-lg-4">
              <PropertySidebar
                property={property}
                primaryListing={primaryListing}
                formatPrice={formatPrice}
              />
            </div>

            <div className="col-lg-12">
              <RelatedListings property={property} />
            </div>
          </div>
        </div>
      </section>
      <FooterBanner />
    </>
  );
};

export default PropertyDetailPage;
