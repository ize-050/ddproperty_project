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
      const descriptionObj = JSON.parse(property.translatedDescriptions || '{}');
      description = descriptionObj[locale];

    const baseUrl = 'https://ddproperty.com';
    const localizedUrl = locale === 'th' ? baseUrl : `${baseUrl}/${locale}`;
    const propertyUrl = `${localizedUrl}/property_detail/${id}`;
    
    // สร้าง title ตามภาษาที่เลือก
    const translatedTitles = JSON.parse(property.translatedTitles || '{}');
    const title = translatedTitles[locale] || translatedTitles['en'] || property.title || property.projectName;
    
    return {
      title,
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
        url: propertyUrl,
        siteName: 'DDProperty',
        images: [
          {
            url: property.featuredImage?.url || '/images/logo/logo.png',
            width: 800,
            height: 600,
            alt: property.title,
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
    const property = await serverApi.get(`/properties/${id}`);

    return property;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
}

// Component สำหรับดึงข้อมูลและแสดงผล
async function PropertyDetailContent({ params }) {
  const { id } = params;
  const t = await getTranslations('PropertyDetail');
  
  try {
    const property = await getPropertyById(id);
    const propertyDataWithTitle = {
      ...property.data, 
    };

    console.log("propertyDataWithTitle", propertyDataWithTitle);

    // ส่งข้อมูลไปให้ component
    return (
      <PropertyDetailPage property={propertyDataWithTitle} />
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
      <Suspense fallback={<LoadingAnimation type="property-detail" />}>
        <PropertyDetailContent params={params} />
      </Suspense>
    </main>
  );
}
