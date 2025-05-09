'use client'

import React, { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

// Import components
import PropertyBreadcrumb from './components/PropertyBreadcrumb';
import PropertyHeader from './components/PropertyHeader';
import PropertyGallery from './components/PropertyGallery';
import PropertyContent from './components/PropertyContent';
import PropertySidebar from './components/PropertySidebar';
import FooterBanner from './components/FooterBanner';

// Import styles
import '@/styles/property-detail.scss';
import '@/styles/property-detail-sections.scss';

const PropertyDetailPage = ({ property }) => {
  const t = useTranslations('PropertyDetail');
  const router = useRouter();
  const locale = useLocale();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyDescription, setPropertyDescription] = useState('');

  useEffect(() => {
    if (property) {
      console.log('PropertyDetail:', property);
      console.log('PropertyDetail Structure:', JSON.stringify(property, null, 2));
      
      // แปลง description จาก JSON string เป็น object
     
      let desc = '';
      try {
        const descriptionObj = JSON.parse(property.description);
        desc = descriptionObj[locale] || descriptionObj.en || '';
        console.log('Parsed description:', desc);
      } catch (e) {
        desc = property.description || '';
      }
      
      // รูปภาพทั้งหมดของ property
      const imgs = property.images && property.images.length > 0 
        ? property.images.map(img => `${process.env.NEXT_PUBLIC_IMAGE_URL}${img.url}`) 
        : ['/images/property/fp1.jpg'];

      console.log("images", imgs);
      setCurrentImageIndex(0);
      setPropertyImages(imgs);
      setPropertyDescription(desc);
    }
  }, [property, locale]);
  
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

    
  
  // ฟังก์ชันสำหรับเลื่อนไปรูปถัดไป
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % propertyImages.length);
  };
  
  // ฟังก์ชันสำหรับเลื่อนไปรูปก่อนหน้า
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + propertyImages.length) % propertyImages.length);
  };
  
  // ฟังก์ชันสำหรับเลือกรูปโดยตรง
  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };
  
  // แปลงประเภท listing เป็นข้อความ
  const getListingTypeText = (listingType) => {
    const types = {
      SALE: {
        th: 'ขาย',
        en: 'For Sale',
        zh: '出售',
        ru: 'Продажа'
      },
      RENT: {
        th: 'เช่า',
        en: 'For Rent',
        zh: '出租',
        ru: 'Аренда'
      }
    };
    
    return types[listingType]?.[locale] || types[listingType]?.en || listingType;
  };
  
  // แปลงประเภท property เป็นข้อความ
  const getPropertyTypeText = (propertyType) => {
    const types = {
      CONDO: {
        th: 'คอนโดมิเนียม',
        en: 'Condominium',
        zh: '公寓',
        ru: 'Кондоминиум'
      },
      HOUSE: {
        th: 'บ้านเดี่ยว',
        en: 'House',
        zh: '独立屋',
        ru: 'Дом'
      },
      TOWNHOUSE: {
        th: 'ทาวน์เฮาส์',
        en: 'Townhouse',
        zh: '联排别墅',
        ru: 'Таунхаус'
      },
      LAND: {
        th: 'ที่ดิน',
        en: 'Land',
        zh: '土地',
        ru: 'Земля'
      },
      APARTMENT: {
        th: 'อพาร์ทเมนท์',
        en: 'Apartment',
        zh: '公寓',
        ru: 'Апартаменты'
      },
      COMMERCIAL: {
        th: 'อาคารพาณิชย์',
        en: 'Commercial Building',
        zh: '商业建筑',
        ru: 'Коммерческое здание'
      }
    };
    
    return types[propertyType]?.[locale] || types[propertyType]?.en || propertyType;
  };
  
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
    return new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US').format(price);
  };
  
  // ดึงข้อมูล listing แรก (ถ้ามี)
  const primaryListing = property?.listings || null;

  console.log("primaryListingprimaryListing",primaryListing)
  
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
      <PropertyGallery 
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
            </div>
            
            {/* Right Sidebar */}
            <div className="col-lg-4">
              <PropertySidebar 
                property={property} 
                primaryListing={primaryListing} 
                formatPrice={formatPrice} 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Banner */}
      <FooterBanner />
    </>
  );
};

export default PropertyDetailPage;
