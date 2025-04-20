"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// ใช้ dynamic import เพื่อแก้ไขปัญหา hydration error
const Header = dynamic(() => import("@/components/home/home-v8/Header"), { ssr: false });
const MobileMenu = dynamic(() => import("@/components/common/mobile-menu"), { ssr: false });
const Footer = dynamic(() => import("@/components/home/home-v8/footer"), { ssr: false });
const ScrollToTop = dynamic(() => import("@/components/common/ScrollTop"), { ssr: false });

// ข้อมูลภาษา
const locales = ['th', 'en', 'zh', 'ru'];
const languageNames = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
  ru: 'Русский'
};

const ClientWrapper = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('th');
  const [isClient, setIsClient] = useState(false);
  
  // ตรวจสอบว่าอยู่ใน client side หรือไม่
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // ตรวจสอบภาษาปัจจุบันจาก URL
  useEffect(() => {
    if (!isClient) return; // ไม่ทำงานถ้ายังไม่อยู่ใน client side
    
    const path = pathname || '';
    const localeMatch = path.match(/^\/(en|zh|ru)(?:\/|$)/);
    
    if (localeMatch) {
      setCurrentLocale(localeMatch[1]);
    } else {
      setCurrentLocale('th'); // ภาษาเริ่มต้น
    }
  }, [pathname, isClient]);

  // ฟังก์ชันสำหรับเปลี่ยนภาษา
  const handleLanguageChange = (newLocale) => {
    // เก็บค่าภาษาที่เลือกใน localStorage
    localStorage.setItem('selectedLocale', newLocale);
    
    if (newLocale === 'th') {
      // ถ้าเป็นภาษาไทย ให้ไปที่ root path
      window.location.href = '/';
    } else {
      // สำหรับภาษาอื่นๆ ให้เพิ่มรหัสภาษาใน URL
      window.location.href = `/${newLocale}`;
    }
  };

  // ถ้ายังไม่อยู่ใน client side ให้แสดง loading หรือ skeleton
  if (!isClient) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  return (
    <>
      {/* Language Switcher - แสดงเฉพาะเมื่ออยู่ใน client side */}
      <div className="language-switcher position-fixed top-0 end-0 mt-3 me-3 z-index-1000">
        <select 
          onChange={(e) => handleLanguageChange(e.target.value)}
          value={currentLocale}
          className="form-select form-select-sm bg-transparent border-0"
        >
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {languageNames[locale]}
            </option>
          ))}
        </select>
      </div>

      {/* Main Header Nav */}
      <Header />

      <MobileMenu />
      {/* End Mobile Nav */}

      {/* Main Content */}
      {children}
      {/* End Main Content */}

      {/* Footer */}
      <Footer />
      {/* End Footer */}

      {/* Scroll To Top */}
      <ScrollToTop />
      {/* End Scroll To Top */}
    </>
  );
};

export default ClientWrapper;
