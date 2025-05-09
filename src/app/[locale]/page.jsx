import { Suspense } from 'react';
import { lazy } from 'react';
import './loading-animation.css';
import serverApi from '@/utils/serverApi';

// บังคับให้โหลดข้อมูลใหม่ทุกครั้งที่เข้าหน้า รวมถึงตอนกดปุ่ม Back
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// ใช้ lazy import แบบมี suspense เพื่อแก้ไขปัญหา hydration error
const Page = lazy(() => import("@/components/home/page"));


// สร้าง metadata แบบ dynamic ตามภาษา
export async function generateMetadata() {
  // ใช้ getLocale จาก next-intl/server แทนการใช้ params
  const locale = 'th'; // กำหนดค่าเริ่มต้นเป็นภาษาไทย
  
  const baseUrl = 'https://ddproperty.com';
  const localizedUrl = locale === 'th' ? baseUrl : `${baseUrl}/${locale}`;
  
  // ข้อความสำหรับแต่ละภาษา
  const titles = {
    th: "DDProperty - เว็บไซต์อสังหาริมทรัพย์",
    en: "DDProperty - Real Estate Website",
    zh: "DDProperty - 房地产网站",
    ru: "DDProperty - Сайт недвижимости"
  };
  
  const descriptions = {
    th: "ค้นหาบ้าน คอนโด และอสังหาริมทรัพย์ที่ดีที่สุดในประเทศไทย",
    en: "Find the best homes, condos, and real estate in Thailand",
    zh: "在泰国找到最好的房屋、公寓和房地产",
    ru: "Найдите лучшие дома, квартиры и недвижимость в Таиланде"
  };
  
  // สร้าง alternates สำหรับ SEO
  const languages = {};
  ['th', 'en', 'zh', 'ru'].forEach(lang => {
    languages[lang] = lang === 'th' ? baseUrl : `${baseUrl}/${lang}`;
  });
  
  return {
    title: titles[locale] || titles.th,
    description: descriptions[locale] || descriptions.th,
    alternates: {
      canonical: localizedUrl,
      languages
    }
  };
}

// ฟังก์ชันสำหรับดึงข้อมูล properties แบบสุ่มจาก API (Server-Side)
async function getRandomProperties() {
  try {
    // เรียกใช้ serverApi เพื่อดึงข้อมูลจาก API
    const response = await serverApi.get('/properties/random', { 
      params: { count: 4 },
      headers: { 'x-api-key': 'dd-property-api-key-2025' } // ใส่ API key สำหรับการเรียก API
    });
    console.log('Random Properties:', response.data);
    // ตรวจสอบข้อมูลที่ได้รับจาก API
    if (response && response.data) {
      console.log('Random Properties:', response.data);
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching random properties (CSR):', error);
    // ส่งค่า fallback data ในกรณีที่เกิดข้อผิดพลาด
    return [];
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล Zone ทั้งหมดจาก API (Server-Side)
async function getAllZones() {
  try {
    // เรียกใช้ serverApi เพื่อดึงข้อมูลจาก API`
    const response = await serverApi.get('/zones', {
      headers: { 'x-api-key': 'dd-property-api-key-2025' } // ใส่ API key สำหรับการเรียก API
    });

    
    
    // ตรวจสอบข้อมูลที่ได้รับจาก API
    if (response && response.data) {
      console.log('Zones:', response.data);
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching zones (SSR):', error);
    // ส่งค่า fallback data ในกรณีที่เกิดข้อผิดพลาด
    return [];
  }
}

// แยก component สำหรับดึงข้อมูลและแสดงผล
// ทำให้มั่นใจว่าจะเรียกข้อมูลใหม่ทุกครั้งที่เข้าหน้า
async function HomeContent() {
  // ดึงข้อมูล properties แบบสุ่มจาก API
  const randomProperties = await getRandomProperties();
  // ดึงข้อมูล Zone ทั้งหมดจาก API
  const zones = await getAllZones();
  

  
  return (
    <>

      <Page randomProperties={randomProperties} zones={zones} />

    </>
  );
}

// หน้าหลักที่ใช้ Suspense และ dynamic content
export default function MainRoot() {
  return (
    <div className="main-wrapper">
        <HomeContent />
    </div>
  );
}
