import { getTranslations } from 'next-intl/server';
import ListingPropertiesPage from '@/components/properties/listing/ListingPropertiesPage';
import serverApi from '@/utils/serverApi';

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

    console.log('Search Results:', response.data);

    // ตรวจสอบข้อมูลที่ได้รับจาก API
    if (response && response.data) {
      console.log('Search Results:', response.data);
      return response.data;
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

export default async function PropertyListPage({ params, searchParams }) {
  // ดึงข้อมูลอสังหาริมทรัพย์ตามเงื่อนไขการค้นหา
  const searchResults = await searchProperties(searchParams);

  // ดึงข้อมูล Zone ทั้งหมด  
  const zones = await getAllZones();

  return (
    <div className="main-wrapper">
      {/* Loading indicator ที่สวยงาม */}
      <div className="preloader"></div>

      {/* แสดงหน้ารายการอสังหาริมทรัพย์ */}
      <ListingPropertiesPage
        properties={searchResults.data || []}
        pagination={searchResults.pagination || {}}
        zones={zones || []}
        searchParams={searchParams || {}}
      />
    </div>
  );
}
