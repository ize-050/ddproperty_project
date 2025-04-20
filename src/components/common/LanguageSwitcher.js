"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// ข้อมูลภาษา
const locales = ['th', 'en', 'zh', 'ru'];
const languageNames = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
  ru: 'Русский'
};

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState('th');

  // ตรวจสอบภาษาปัจจุบันจาก URL และ localStorage
  useEffect(() => {
    // ตรวจสอบภาษาจาก localStorage ก่อน
    const savedLocale = typeof window !== 'undefined' ? localStorage.getItem('selectedLocale') : null;
    
    if (savedLocale && locales.includes(savedLocale)) {
      setCurrentLocale(savedLocale);
      return;
    }
    
    // ถ้าไม่มีภาษาใน localStorage ให้ตรวจสอบจาก URL
    const path = pathname || '';
    const localeMatch = path.match(/^\/([a-z]{2})(?:\/|$)/);
    
    if (localeMatch && locales.includes(localeMatch[1])) {
      setCurrentLocale(localeMatch[1]);
      // เก็บค่าภาษาใน localStorage เพื่อใช้ในครั้งต่อไป
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedLocale', localeMatch[1]);
      }
    } else {
      setCurrentLocale('th'); // ภาษาเริ่มต้น
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedLocale', 'th');
      }
    }
  }, [pathname]);

  // สลับภาษาแบบ Client-Side Routing ไม่ต้อง refresh หน้าเว็บ
  const handleLanguageChange = (locale) => {
    // เก็บค่าภาษาที่เลือกใน localStorage เพื่อให้สามารถใช้ได้ในหน้าอื่นๆ
    localStorage.setItem('selectedLocale', locale);
    
    // ใช้ shallow routing เพื่อไม่ให้มีการโหลดหน้าใหม่ทั้งหมด
    try {
      if (locale === 'th') {
        // ถ้าเป็นภาษาไทย ให้ไปที่ root path
        router.push('/', undefined, { shallow: true, scroll: false });
      } else {
        // สำหรับภาษาอื่นๆ ให้เพิ่มรหัสภาษาใน URL
        router.push(`/${locale}`, undefined, { shallow: true, scroll: false });
      }
    } catch (error) {
      console.error('Error changing language:', error);
      // ถ้ามีข้อผิดพลาดให้ใช้วิธีเดิม
      if (locale === 'th') {
        window.location.href = '/';
      } else {
        window.location.href = `/${locale}`;
      }
    }
  };

  // กำหนดธงชาติสำหรับแต่ละภาษา
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
            gap: '6px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
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

export default LanguageSwitcher;
