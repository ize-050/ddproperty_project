import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import './loading-animation.css';
import serverApi from '@/utils/serverApi';

// ใช้ dynamic import แบบมี suspense เพื่อแก้ไขปัญหา hydration error
const Page = dynamic(() => import("@/components/home/page"), { ssr: false });
const Header = dynamic(() => import("@/components/home/home/Header"), { ssr: false });
const MobileMenu = dynamic(() => import("@/components/common/mobile-menu"), { ssr: false });
const Footer = dynamic(() => import("@/components/home/home/footer"), { ssr: false });
const ScrollToTop = dynamic(() => import("@/components/common/ScrollTop"), { ssr: false });
const LoadingAnimation = dynamic(() => import("@/components/common/LoadingAnimation"), { ssr: false });

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
    console.error('Error fetching random properties (SSR):', error);
    // ส่งค่า fallback data ในกรณีที่เกิดข้อผิดพลาด
    return [];
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล Zone ทั้งหมดจาก API (Server-Side)
async function getAllZones() {
  try {
    // เรียกใช้ serverApi เพื่อดึงข้อมูลจาก API
    const response = await serverApi.get('/zones', {
      headers: { 'x-api-key': 'dd-property-api-key-2025' } // ใส่ API key สำหรับการเรียก API
    });
    
    // ตรวจสอบข้อมูลที่ได้รับจาก API
    if (response && response.data) {
      
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching zones (SSR):', error);
    // ส่งค่า fallback data ในกรณีที่เกิดข้อผิดพลาด
    return [];
  }
}



export default async function MainRoot() {
  // ใช้ useTranslations เพื่อเข้าถึงข้อความแปลภาษา

  // ดึงข้อมูล properties แบบสุ่มจาก API
  const randomProperties = await getRandomProperties();
  // ดึงข้อมูล Zone ทั้งหมดจาก API
  const zones = await getAllZones();
  
  console.log("zoneszones",zones)
  
  return (
    <div className="main-wrapper">
      {/* Loading indicator ที่สวยงาม */}
      <Suspense fallback={<LoadingAnimation />}>
        {/* Main Header Nav */}
        <Header />

        <MobileMenu />
        {/* End Mobile Nav */}
        
        {/* Main Content */}
        <Page randomProperties={randomProperties} zones={zones} />
        {/* End Main Content */}

        {/* Footer */}
        <Footer />
        {/* End Footer */}

        <ScrollToTop />
        {/* End Scroll To Top */}
      </Suspense>
    </div>
  );
}
