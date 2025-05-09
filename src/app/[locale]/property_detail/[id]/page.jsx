import { Suspense } from 'react';
import { lazy } from 'react';
import serverApi from '@/utils/serverApi';
import { getTranslations } from 'next-intl/server';
import { enhancePropertyData } from '@/utils/propertyDetailHelper';

// บังคับให้โหลดข้อมูลใหม่ทุกครั้งที่เข้าหน้า รวมถึงตอนกดปุ่ม Back
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// ใช้ lazy import แบบมี suspense เพื่อแก้ไขปัญหา hydration error
const PropertyDetailPage = lazy(() => import("@/components/properties/detail/PropertyDetailPage"));
const LoadingAnimation = lazy(() => import("@/components/common/LoadingAnimation"));

// สร้าง metadata แบบ dynamic ตามภาษาและข้อมูล property
export async function generateMetadata({ params }) {
  const { id, locale } = params;
  
  try {
    // ดึงข้อมูล property จาก API
    const property = await getPropertyById(id);

    
    // ดึงข้อความจาก description ตามภาษา
    let description = '';
    try {
      const descriptionObj = JSON.parse(property.description);
      description = descriptionObj[locale] || descriptionObj.en || '';
    } catch (e) {
      description = property.description || '';
    }
    
    const baseUrl = 'https://ddproperty.com';
    const localizedUrl = locale === 'th' ? baseUrl : `${baseUrl}/${locale}`;
    const propertyUrl = `${localizedUrl}/property_detail/${id}`;
    
    // สร้าง title ตามชื่อโครงการและประเภท property
    const propertyType = getPropertyTypeText(property.propertyType, locale);
    const title = `${property.projectName} - ${propertyType} | DDProperty`;
    
    return {
      title,
      description: description.substring(0, 160),
      alternates: {
        canonical: propertyUrl,
        languages: {
          'th': `${baseUrl}/property_detail/${id}`,
          'en': `${baseUrl}/en/property_detail/${id}`,
          'zh': `${baseUrl}/zh/property_detail/${id}`,
          'ru': `${baseUrl}/ru/property_detail/${id}`,
        },
      },
      openGraph: {
        title,
        description: description.substring(0, 160),
        url: propertyUrl,
        siteName: 'DDProperty',
        images: [
          {
            url: property.featuredImage?.url || '/images/logo/logo.png',
            width: 800,
            height: 600,
            alt: property.projectName,
          },
        ],
        locale,
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Default metadata if property not found
    return {
      title: 'Property Detail | DDProperty',
      description: 'View property details on DDProperty',
    };
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล property จาก API ตาม ID
async function getPropertyById(id) {
  try {
    console.log(`Fetching property details for ID: ${id}`);
    const property = await serverApi.get(`/properties/${id}`);
    
    // เพิ่มข้อมูลที่จำเป็นสำหรับหน้า property detail
    const enhancedProperty = enhancePropertyData(property);
    console.log('Enhanced property data with missing fields');
    
    return enhancedProperty;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
}

// ฟังก์ชันแปลประเภท property ตามภาษา
function getPropertyTypeText(propertyType, locale) {
  const propertyTypes = {
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
  
  return propertyTypes[propertyType]?.[locale] || propertyTypes[propertyType]?.en || propertyType;
}

// Component สำหรับดึงข้อมูลและแสดงผล
async function PropertyDetailContent({ params }) {
  const { id } = params;
  const t = await getTranslations('PropertyDetail');
  
  try {
    // ดึงข้อมูล property จาก API
    const property = await getPropertyById(id);
    
    // ส่งข้อมูลไปให้ component
    return (
      <PropertyDetailPage property={property.data} />
    );
  } catch (error) {
    // แสดงข้อความ error ถ้าดึงข้อมูลไม่สำเร็จ
    return (
      <div className="container mt100 mb100">
        <div className="row">
          <div className="col-lg-12">
            <div className="alert alert-danger">
              <h3>{t('errorLoadingProperty')}</h3>
              <p>{t('propertyNotFound')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// หน้าหลักที่ใช้ Suspense และ dynamic content
export default function PropertyDetail({ params }) {
  return (
    <main>
      <Suspense fallback={<LoadingAnimation />}>
        <PropertyDetailContent params={params} />

      </Suspense>
    </main>
  );
}
