
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import './loading-animation.css';

// ใช้ dynamic import แบบมี suspense เพื่อแก้ไขปัญหา hydration error
const Page = dynamic(() => import("@/components/home/page"), { ssr: false });
const Header = dynamic(() => import("@/components/home/home-v8/Header"), { ssr: false });
const MobileMenu = dynamic(() => import("@/components/common/mobile-menu"), { ssr: false });
const Footer = dynamic(() => import("@/components/home/home-v8/footer"), { ssr: false });
const ScrollToTop = dynamic(() => import("@/components/common/ScrollTop"), { ssr: false });
const LanguageSwitcher = dynamic(() => import("@/components/common/LanguageSwitcher"), { ssr: false });
const LoadingAnimation = dynamic(() => import("@/components/common/LoadingAnimation"), { ssr: false });

export const metadata = {
  title: "DDProperty - เว็บไซต์อสังหาริมทรัพย์",
  description: "ค้นหาบ้าน คอนโด และอสังหาริมทรัพย์ที่ดีที่สุดในประเทศไทย",
  alternates: {
    canonical: 'https://ddproperty.com',
    languages: {
      'en': 'https://ddproperty.com/en',
      'th': 'https://ddproperty.com',
      'zh': 'https://ddproperty.com/zh',
      'ru': 'https://ddproperty.com/ru',
    },
  },
};

export default function MainRoot() {
  // ใช้ useParams เพื่อดึงค่าภาษาจาก URL

  
  return (
    <div className="main-wrapper">
      {/* Loading indicator ที่สวยงาม */}
      <Suspense fallback={<LoadingAnimation />}>
        {/* Language Switcher */}
       
        
        {/* Main Header Nav */}
        <Header />

        <MobileMenu />
        {/* End Mobile Nav */}
        
        {/* Main Content */}
        <Page />
        {/* End Main Content */}

        {/* Footer */}
        <Footer />
        {/* End Footer */}

        {/* Scroll To Top */}
        <ScrollToTop />
        {/* End Scroll To Top */}
      </Suspense>
    </div>
  );
}
