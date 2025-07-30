import { Suspense } from 'react';
import serverApi from '@/utils/serverApi';
import { getTranslations } from 'next-intl/server';
import { enhancePropertyData } from '@/utils/propertyDetailHelper';
import PropertyDetailPage from '@/components/properties/detail/PropertyDetailPage';
import LoadingAnimation from '@/components/common/LoadingAnimation';

// บังคับให้โหลดข้อมูลใหม่ทุกครั้งที่เข้าหน้า รวมถึงตอนกดปุ่ม Back
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// สร้าง metadata แบบ dynamic ตามภาษาและข้อมูล property
export async function generateMetadata({ params }) {
  const { slug, locale } = params;
  const id = slug[0]; // The ID is the first part of the slug array

  try {
    // ดึงข้อมูล property จาก API
    const property = await getPropertyById(id);

    if (!property) {
      throw new Error(`Property with ID ${id} not found`);
    }

    // ดึงข้อความจาก description ตามภาษา
    let description = '';
    try {
      const descriptionObj = JSON.parse(property.translatedDescriptions || '{}');
      description = descriptionObj[locale] || descriptionObj['en'] || property.description || '';
    } catch (e) {
      console.warn('Error parsing translatedDescriptions:', e);
      description = property.description || '';
    }

    const baseUrl = 'https://ddproperty.com';
    const localizedUrl = locale === 'th' ? baseUrl : `${baseUrl}/${locale}`;
    const propertyUrl = `${localizedUrl}/property_detail/${slug.join('/')}`;

    // สร้าง title ตามภาษาที่เลือก
    let propertyTitle = property?.data?.title || '';
    try {
      const translatedTitles = property?.data?.translatedTitles;
      propertyTitle = translatedTitles[locale] || translatedTitles['en'] || property?.data?.title || '';
    } catch (e) {
      propertyTitle = property?.data?.title || '';
    }
    
    // ตรวจสอบให้แน่ใจว่า propertyTitle เป็น string
    propertyTitle = String(propertyTitle || '');

    // ตัด title ให้สั้นลงถ้ายาวเกิน 50 ตัวอักษร
    const shortTitle = propertyTitle.length > 50 ? propertyTitle.substring(0, 50) + '...' : propertyTitle;
    const title = `${shortTitle}`;


    return {
      title,
      alternates: {
        canonical: propertyUrl,
        languages: {
          'th': `${baseUrl}/property_detail/${slug.join('/')}`,
          'en': `${baseUrl}/en/property_detail/${slug.join('/')}`,
          'zh': `${baseUrl}/zh/property_detail/${slug.join('/')}`,
          'ru': `${baseUrl}/ru/property_detail/${slug.join('/')}`,
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
      title: 'Property Detail - D-Luck Property',
      description: 'View property details on D-Luck Property',
    };
  }
}

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
  const { slug, locale } = params; // ดึง locale มาจาก params
  const id = slug[0];
  const t = await getTranslations('PropertyDetail');

  try {
    const property = await getPropertyById(id);

    const propertyData = property.data;

    const translatedTitles = propertyData.translatedTitles || {};
    propertyData.displayTitle = translatedTitles[locale] || translatedTitles['en'] || propertyData.title;

    // ส่งข้อมูลไปให้ component
    return <PropertyDetailPage property={propertyData} locale={locale} />;

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
