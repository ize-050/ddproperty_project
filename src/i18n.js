import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// รายการภาษาที่รองรับ
export const supportedLocales = ['th', 'en', 'zh', 'ru'];
export const defaultLocale = 'th';

// ชื่อภาษาสำหรับแสดงในตัวเลือกภาษา
export const languageNames = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
  ru: 'Русский'
};

// ฟังก์ชันสำหรับการแปลง URL ระหว่างภาษา
export function getLocalizedPath(path, locale) {
  // ถ้าเป็นหน้าหลัก
  if (path === '/') {
    return locale === defaultLocale ? '/' : `/${locale}`;
  }

  // ตรวจสอบว่าเส้นทางมีภาษาอยู่แล้วหรือไม่
  const pathWithoutLocale = path.replace(new RegExp(`^/(${supportedLocales.join('|')})(/|$)`), '/');
  
  return locale === defaultLocale ? pathWithoutLocale : `/${locale}${pathWithoutLocale}`;
}

// สำหรับ SEO
export function getLanguageAlternates() {
  return supportedLocales.map((locale) => ({
    hrefLang: locale,
    href: `/${locale}`
  }));
}

// ฟังก์ชันสำหรับ next-intl
export default getRequestConfig(async ({ locale }) => {
  // ตรวจสอบว่าภาษาที่ระบุอยู่ในรายการที่รองรับหรือไม่
  if (!supportedLocales.includes(locale)) {
    // ใช้ภาษาเริ่มต้นแทนถ้าไม่พบภาษาที่ระบุ
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default,
      timeZone: 'Asia/Bangkok',
      now: new Date(),
    };
  }

  return {
    // ใช้ locale ที่ได้รับมาจาก params
    locale,
    // โหลดข้อความแปลภาษา
    messages: (await import(`./messages/${locale}.json`)).default,
    // ตั้งค่าเขตเวลาและวันที่
    timeZone: 'Asia/Bangkok',
    now: new Date(),
  };
});
