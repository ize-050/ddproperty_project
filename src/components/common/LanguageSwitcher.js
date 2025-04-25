"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locales, languageNames, defaultLocale } from '../../navigation';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  
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
  
  // สกุลเงินสำหรับแต่ละภาษา
  const currencies = {
    th: 'THB',
    en: 'USD',
    zh: 'CNY',
    ru: 'RUB'
  };
  
  const [currentLocale, setCurrentLocale] = useState(defaultLocale);
  const [isMounted, setIsMounted] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState(currencies[defaultLocale]);

  // ใช้ useEffect เพื่อตรวจสอบภาษาปัจจุบันจาก URL และ localStorage
  // เพื่อหลีกเลี่ยง hydration error
  useEffect(() => {
    setIsMounted(true);
    
    // ตรวจสอบภาษาจาก URL ก่อน
    const path = pathname || '';
    const localeMatch = path.match(/^\/([a-z]{2})(?:\/|$)/);

    let detectedLocale = defaultLocale;
    if (localeMatch && locales.includes(localeMatch[1])) {
      detectedLocale = localeMatch[1];
    }
    
    setCurrentLocale(detectedLocale);
    setCurrentCurrency(currencies[detectedLocale]);
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

  // ฟังก์ชันสำหรับเปลี่ยนสกุลเงิน
  const handleCurrencyChange = (currency) => {
    setCurrentCurrency(currency);
    // ตรงนี้สามารถเพิ่มโค้ดสำหรับจัดการเปลี่ยนสกุลเงินได้
  };

  return (
    <div className="language-currency-switcher d-flex align-items-center">
      {/* Currency Switcher */}
      <div className="dropdown me-2">
        <button
          className="btn btn-sm currency-dropdown-btn dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '4px 8px',
            color: '#333',
            fontSize: '12px'
          }}
        >
          {currentCurrency}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          {Object.values(currencies).map((currency) => (
            <li key={currency}>
              <a
                className={`dropdown-item ${currency === currentCurrency ? 'text-primary' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currency !== currentCurrency) {
                    handleCurrencyChange(currency);
                  }
                }}
              >
                {currency}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Language Switcher */}
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
            backgroundColor: 'transparent',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '4px 8px',
            color: '#333'
          }}
        >
          <span style={{ fontSize: '16px' }}>{flagCodes[currentLocale]}</span>
          <span style={{ fontWeight: '500' }}>{localeShortCodes[currentLocale]}</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          {locales.map((locale) => (
            <li key={locale}>
              <a
                className={`dropdown-item ${locale === currentLocale ? 'text-primary' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (locale !== currentLocale) {
                    handleLanguageChange(locale);
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{flagCodes[locale]}</span>
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
