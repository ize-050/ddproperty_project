"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locales, languageNames, defaultLocale } from '../../navigation';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState(defaultLocale);
  const [isMounted, setIsMounted] = useState(false);

  // ใช้ useEffect เพื่อตรวจสอบภาษาปัจจุบันจาก URL และ localStorage
  // เพื่อหลีกเลี่ยง hydration error
  useEffect(() => {
    setIsMounted(true);
    
    // ตรวจสอบภาษาจาก URL ก่อน
    const path = pathname || '';
    const localeMatch = path.match(/^\/([a-z]{2})(?:\/|$)/);

    if (localeMatch && locales.includes(localeMatch[1])) {
      setCurrentLocale(localeMatch[1]);
      return;
    }

    // ถ้าไม่มีภาษาใน URL ให้ใช้ภาษาเริ่มต้น
    setCurrentLocale(defaultLocale);
  }, [pathname]);

  // ฟังก์ชันสำหรับเปลี่ยนภาษา
  const handleLanguageChange = (locale) => {
    // คำนวณ URL ใหม่ตามภาษาที่เลือก
    let newPath = '';
    
    // ถ้าเป็นภาษาเริ่มต้น (ไทย) และอยู่ที่หน้าแรก
    if (locale === defaultLocale && (pathname === '/' || pathname === `/${currentLocale}`)) {
      newPath = '/';
    } 
    // ถ้าเป็นภาษาเริ่มต้น (ไทย) แต่ไม่ได้อยู่ที่หน้าแรก
    else if (locale === defaultLocale) {
      // ลบ prefix ภาษาออกจาก URL
      newPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    } 
    // ถ้าเป็นภาษาอื่น
    else {
      // ถ้ามี prefix ภาษาอยู่แล้ว ให้แทนที่
      if (pathname.match(/^\/[a-z]{2}(\/|$)/)) {
        newPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, `/${locale}$1`);
      } 
      // ถ้าไม่มี prefix ภาษา ให้เพิ่มเข้าไป
      else {
        newPath = `/${locale}${pathname}`;
      }
    }

    // นำทางไปยัง URL ใหม่
    try {
      router.push(newPath);
    } catch (error) {
      console.error('Error changing language:', error);
      // ถ้าเกิดข้อผิดพลาด ให้โหลดหน้าใหม่ทั้งหมด
      window.location.href = newPath;
    }
  };

  // ถ้ายังไม่ได้ mount ให้แสดงปุ่มว่างๆ เพื่อหลีกเลี่ยง hydration error
  if (!isMounted) {
    return <div className="language-switcher-placeholder" style={{ width: '60px', height: '32px' }}></div>;
  }

  // สัญลักษณ์ธงสำหรับแต่ละภาษา
  const flagCodes = {
    th: '🇹🇭', // ธงไทย (TH)
    en: '🇬🇧', // ธงอังกฤษ (GB)
    zh: '🇨🇳', // ธงจีน (CN)
    ru: '🇷🇺'  // ธงรัสเซีย (RU)
  };

  // รหัสภาษาแบบย่อ
  const localeShortCodes = {
    th: 'TH',
    en: 'EN',
    zh: 'ZH',
    ru: 'RU'
  };

  return (
    <div className="language-switcher">
      <div className="dropdown">
        <button
          className="btn btn-sm language-dropdown-btn dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#007bff',
            borderRadius: '4px',
            padding: '4px 8px',
            color: '#fff'
          }}
        >
          <span style={{ fontSize: '16px' }}>{flagCodes[currentLocale]}</span>
          <span style={{ fontWeight: '500' }}>{localeShortCodes[currentLocale]}</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          {locales.map((locale) => (
            <li key={locale}>
              <a
                className={`dropdown-item ${locale === currentLocale ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (locale !== currentLocale) {
                    handleLanguageChange(locale);
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ fontSize: '16px' }}>{flagCodes[locale]}</span>
                <span>{languageNames[locale]}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ลบ export default ซ้ำออก
