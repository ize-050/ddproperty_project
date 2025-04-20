// ข้อมูลภาษาที่รองรับ
export const locales = ['th', 'en', 'zh', 'ru'];
export const defaultLocale = 'th';

// ชื่อภาษาสำหรับแสดงในตัวเลือกภาษา
export const languageNames = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
  ru: 'Русский'
};

// ฟังก์ชันสำหรับแปลงเส้นทาง URL ระหว่างภาษา
export function getLocalizedPath(path, locale) {
  // ถ้าเป็นหน้าหลัก
  if (path === '/') {
    return locale === defaultLocale ? '/' : `/${locale}`;
  }

  // ตรวจสอบว่าเส้นทางมีภาษาอยู่แล้วหรือไม่
  const pathWithoutLocale = path.replace(/^\/[a-z]{2}(?:\/|$)/, '/');
  
  return locale === defaultLocale ? pathWithoutLocale : `/${locale}${pathWithoutLocale}`;
}

// ฟังก์ชันสำหรับดึงข้อความแปลตามภาษา
export function getTranslations(locale) {
  try {
    // ในสถานการณ์จริง คุณอาจจะต้องใช้ dynamic import หรือ API call
    const translations = {
      th: require('../translations/th/common.json'),
      en: require('../translations/en/common.json'),
      zh: require('../translations/zh/common.json'),
      ru: require('../translations/ru/common.json')
    };
    return translations[locale] || translations[defaultLocale];
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    return {};
  }
}
