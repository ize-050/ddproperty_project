// src/server-utils.js
import { supportedLocales, defaultLocale } from './i18n';

// ฟังก์ชันสำหรับสร้าง URL ที่มี locale (ทำงานได้ทั้ง client และ server)
export function getLocalizedPath(path, locale) {
  const currentLocale = locale || defaultLocale;
  if (currentLocale === defaultLocale) {
    return path;
  }
  return `/${currentLocale}${path}`;
}

// สร้าง redirect ฟังก์ชันสำหรับ server components
export function serverRedirect(path, locale) {
  const localizedPath = getLocalizedPath(path, locale);
  return Response.redirect(new URL(localizedPath, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}