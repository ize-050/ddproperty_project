"use client";

import { useState, useEffect, useRef } from 'react';
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
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  
  // สร้าง ref สำหรับ dropdown
  const languageDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target) &&
          !event.target.closest('.lang-btn')) {
        setIsLanguageDropdownOpen(false);
      }
      
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target) &&
          !event.target.closest('.currency-btn')) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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

  // ฟังก์ชันสำหรับเปิด/ปิด dropdown ภาษา
  const toggleLanguageDropdown = () => {
    console.log('Toggle language dropdown', isLanguageDropdownOpen);
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    setIsCurrencyDropdownOpen(false); // ปิด dropdown สกุลเงินเมื่อเปิด dropdown ภาษา
  };
  
  // ฟังก์ชันสำหรับเปิด/ปิด dropdown สกุลเงิน
  const toggleCurrencyDropdown = () => {
    console.log('Toggle currency dropdown', isCurrencyDropdownOpen);
    setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
    setIsLanguageDropdownOpen(false); // ปิด dropdown ภาษาเมื่อเปิด dropdown สกุลเงิน
  };


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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Language Switcher - เหมือนในรูป */}
      <div style={dropdownStyles.wrapper}>
        <button 
          style={dropdownStyles.button}
          onClick={toggleLanguageDropdown}
        >
          <span style={dropdownStyles.flagIcon}>{flagCodes[currentLocale]}</span>
          <span style={dropdownStyles.text}>{localeShortCodes[currentLocale]}</span>
          <span style={dropdownStyles.dropdownIcon}>▼</span>
        </button>
        {isLanguageDropdownOpen && (
          <div ref={languageDropdownRef} style={dropdownStyles.dropdownMenu}>
            {locales.map((locale) => (
              <button 
                key={locale}
                style={{
                  ...dropdownStyles.dropdownItem,
                  backgroundColor: locale === currentLocale ? '#f5f5f5' : 'transparent'
                }}
                onClick={() => {
                  handleLanguageChange(locale);
                  setIsLanguageDropdownOpen(false);
                }}
              >
                <span style={{ marginRight: '8px' }}>{flagCodes[locale]}</span> {languageNames[locale]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Currency Dropdown - เหมือนในรูป */}
      <div style={dropdownStyles.wrapper}>
        <button 
          style={dropdownStyles.button}
          onClick={toggleCurrencyDropdown}
        >
          <span style={dropdownStyles.text}>{currentCurrency}</span>
          <span style={dropdownStyles.dropdownIcon}>▼</span>
        </button>
        {isCurrencyDropdownOpen && (
          <div ref={currencyDropdownRef} style={dropdownStyles.dropdownMenu}>
            {Object.values(currencies).map((currency) => (
              <button 
                key={currency}
                style={{
                  ...dropdownStyles.dropdownItem,
                  backgroundColor: currency === currentCurrency ? '#f5f5f5' : 'transparent'
                }}
                onClick={() => {
                  handleCurrencyChange(currency);
                  setIsCurrencyDropdownOpen(false);
                }}
              >
                {currency}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ลบ export default ซ้ำออก
