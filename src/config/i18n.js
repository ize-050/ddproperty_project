export const locales = ['en', 'th', 'zh', 'ru'];
export const defaultLocale = 'th';

export function getLocaleDirection(locale) {
  // ภาษาที่อ่านจากขวาไปซ้าย (RTL) - ไม่มีในกรณีนี้
  return 'ltr';
}

export function getLanguageName(locale) {
  const names = {
    en: 'English',
    th: 'ไทย',
    zh: '中文',
    ru: 'Русский'
  };
  return names[locale] || locale;
}

// สำหรับ SEO
export function getLanguageAlternates() {
  return locales.map((locale) => ({
    hrefLang: locale,
    href: `/${locale}`
  }));
}

// สำหรับการแปลง URL ระหว่างภาษา
export function getLocalizedUrl(path, locale) {
  // ถ้าเป็น path หลัก
  if (path === '/') {
    return locale === defaultLocale ? '/' : `/${locale}`;
  }
  
  // ตรวจสอบว่า path ปัจจุบันมีภาษาอยู่แล้วหรือไม่
  const pathWithoutLocale = locales.some(loc => path.startsWith(`/${loc}/`))
    ? path.substring(3) // ตัด /{locale}/ ออก
    : path.startsWith('/') 
      ? path 
      : `/${path}`;
  
  return locale === defaultLocale
    ? pathWithoutLocale
    : `/${locale}${pathWithoutLocale}`;
}
