import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import ListingPropertiesPage from '@/components/properties/listing/ListingPropertiesPage';
import serverApi from '@/utils/serverApi';

// บังคับให้โหลดข้อมูลใหม่ทุกครั้งที่เข้าหน้า
export const dynamic = 'force-dynamic';

// ฟังก์ชันสำหรับดึงข้อมูลอสังหาริมทรัพย์ตามเงื่อนไขการค้นหา
async function searchProperties(searchParams) {
  try {

    
    // สร้าง query parameters จาก searchParams
    const queryParams = new URLSearchParams();

    // เพิ่มพารามิเตอร์ต่างๆ
    if (searchParams.propertyType) {
      queryParams.append('propertyType', searchParams.propertyType);
    }

    if (searchParams.minPrice) {
      queryParams.append('minPrice', searchParams.minPrice);
    }

    if (searchParams.maxPrice) {
      queryParams.append('maxPrice', searchParams.maxPrice);
    }

    if (searchParams.zoneId) {
      queryParams.append('zoneId', searchParams.zoneId);
    }

    if (searchParams.listingType) {
      queryParams.append('listingType', searchParams.listingType);
    }

    // เพิ่มพารามิเตอร์อื่นๆ ที่อาจมีในอนาคต
    if (searchParams.bedrooms) {
      queryParams.append('bedrooms', searchParams.bedrooms);
    }

    if (searchParams.bathrooms) {
      queryParams.append('bathrooms', searchParams.bathrooms);
    }

    if (searchParams.page) {
      queryParams.append('page', searchParams.page);
    } else {
      queryParams.append('page', '1'); // ค่าเริ่มต้น
    }

    if (searchParams.limit) {
      queryParams.append('limit', searchParams.limit);
    } else {
      queryParams.append('limit', '9'); // ค่าเริ่มต้น
    }

    // เรียกใช้ API เพื่อค้นหาอสังหาริมทรัพย์
    const response = await serverApi.get(`/search/properties?${queryParams.toString()}`, {
      headers: { 'x-api-key': 'dd-property-api-key-2025' }
    });


    // ตรวจสอบข้อมูลที่ได้รับจาก API
    if (response && response.data) {
      console.log('Search Resultspagination:', response.data);
      return { data: response.data, pagination: response.pagination };
    }

    return { data: [], pagination: { total: 0, page: 1, limit: 9, pages: 0 } };
  } catch (error) {
    console.error('Error searching properties (SSR):', error);
    // ส่งค่า fallback data ในกรณีที่เกิดข้อผิดพลาด
    return { data: [], pagination: { total: 0, page: 1, limit: 9, pages: 0 } };
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล Zone ทั้งหมด
async function getAllZones() {
  try {
    const response = await serverApi.get('/zones', {
      headers: { 'x-api-key': 'dd-property-api-key-2025' }
    });

    if (response && response.data) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching zones (SSR):', error);
    return [];
  }
}

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'PropertyList' });

  console.log('Generating metadata for PropertyListPage');

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

// Loading component สำหรับแสดงระหว่างรอข้อมูล
function PropertyListingLoading() {
  return (
    <div className="property-listing-loading">
      <div className="loading-content">
        <div className="loading-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25"/>
            <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" className="spinner"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// Component สำหรับแสดงรายการอสังหาริมทรัพย์
async function PropertyListContent({ searchParams }) {
  // ดึงข้อมูลอสังหาริมทรัพย์ตามเงื่อนไขการค้นหา
  const searchResults = await searchProperties(searchParams);

  // ดึงข้อมูล Zone ทั้งหมด  
  const zones = await getAllZones();
  
  return (
    <ListingPropertiesPage
      properties={searchResults.data || []}
      pagination={searchResults.pagination || {}}
      zones={zones || []}
      searchParams={searchParams || {}}
    />
  );
}

export default function PropertyListPage({ params, searchParams }) {
  return (
    <div className="main-wrapper">
      <Suspense fallback={<PropertyListingLoading />}>
        <PropertyListContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
