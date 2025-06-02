"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState, useEffect, useRef } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ฟังก์ชันสำหรับเปลี่ยนภาษา
  const handleLanguageChange = (targetLocale) => {
    if (targetLocale === locale) {
      setIsOpen(false);
      return; // ไม่ต้องเปลี่ยนถ้าเป็นภาษาเดียวกัน
    }
    
    setIsOpen(false);
    
    // สร้าง URL ใหม่โดยตรง
    let newPath;
    
    // ถ้าเป็น URL ที่มี locale อยู่แล้ว (เช่น /en/blog, /th/properties)
    if (pathname.match(/^\/(en|th|zh|ru)\//)) {
      newPath = pathname.replace(/^\/(en|th|zh|ru)\//, `/${targetLocale}/`);
    } 
    // ถ้าเป็น URL ที่เป็น locale เท่านั้น (เช่น /en, /th)
    else if (pathname.match(/^\/(en|th|zh|ru)$/)) {
      newPath = `/${targetLocale}`;
    }
    // ถ้าเป็น URL ที่ไม่มี locale
    else {
      newPath = `/${targetLocale}${pathname}`;
    }
    
    console.log('Current locale:', locale);
    console.log('Target locale:', targetLocale);
    console.log('Current pathname:', pathname);
    console.log('Navigating to:', newPath);
    
    // ใช้ window.location.href แทน router.push เพื่อให้มีการโหลดหน้าใหม่
    window.location.href = newPath;
  };

  // ปิด dropdown เมื่อคลิกที่อื่น
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ข้อมูลภาษาที่รองรับ
  const languages = [
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  // หาภาษาปัจจุบัน
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  // สร้าง CSS สำหรับ dropdown แบบ inline
  const dropdownStyles = {
    wrapper: {
      position: 'relative',
      marginRight: '10px'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '5px 8px',
      borderRadius: '4px',
      transition: 'all 0.3s ease'
    },
    flagIcon: {
      fontSize: '16px',
      marginRight: '5px'
    },
    text: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#333',
      margin: '0 3px'
    },
    dropdownIcon: {
      fontSize: '8px',
      color: '#999',
      marginLeft: '3px'
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: '0',
      background: 'white',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      minWidth: '120px',
      zIndex: '1050',
      marginTop: '5px',
      overflow: 'hidden',
      padding: '5px 0'
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      fontSize: '13px',
      color: '#333',
      background: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer'
    }
  };

  return (
    <div style={dropdownStyles.wrapper} ref={dropdownRef}>
      <button 
        style={dropdownStyles.button}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={dropdownStyles.flagIcon}>{currentLanguage.flag}</span>
        <span style={dropdownStyles.text}>{currentLanguage.code.toUpperCase()}</span>
        <span style={dropdownStyles.dropdownIcon}>▼</span>
      </button>
      
      {isOpen && (
        <div style={dropdownStyles.dropdownMenu}>
          {languages.map((language) => (
            <button 
              key={language.code}
              style={{
                ...dropdownStyles.dropdownItem,
                backgroundColor: locale === language.code ? '#f5f5f5' : 'transparent'
              }}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span style={{ marginRight: '8px' }}>{language.flag}</span> {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
