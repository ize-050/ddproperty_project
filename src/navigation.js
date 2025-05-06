// src/navigation.js
'use client';

// นำเข้าฟังก์ชันที่จำเป็นสำหรับ client components
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { supportedLocales, defaultLocale } from './i18n';

// ส่งออกตัวแปรและฟังก์ชันที่จำเป็น
export { useLocale, useTranslations };
export { useRouter, usePathname };
export { supportedLocales, defaultLocale };

// สำหรับ middleware
export const localePrefix = 'as-needed';

// ส่งออก locales สำหรับ generateStaticParams
export const locales = supportedLocales;

// ฟังก์ชันสำหรับสร้าง URL ที่มี locale (ทำงานได้ทั้ง client และ server)
export function getLocalizedPath(path, locale) {
  const currentLocale = locale || defaultLocale;
  if (currentLocale === defaultLocale) {
    return path;
  }
  return `/${currentLocale}${path}`;
}

// ฟังก์ชันสำหรับ redirect (client-side only)
export function redirect(path, locale) {
  const router = useRouter();
  const currentLocale = locale || useLocale();
  const localizedPath = getLocalizedPath(path, currentLocale);
  router.push(localizedPath);
}

// คอมโพเนนต์ Link ที่รองรับ locale (client-side only)
export function Link({ href, locale, children, ...props }) {
  const currentLocale = useLocale();
  const finalLocale = locale || currentLocale;
  const localizedHref = getLocalizedPath(href, finalLocale);
  
  return (
    <NextLink href={localizedHref} {...props}>
      {children}
    </NextLink>
  );
}