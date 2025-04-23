import { Inter } from 'next/font/google';

// รายการภาษาที่รองรับ
export const locales = ['th', 'en', 'zh', 'ru'];

// ตรวจสอบว่าภาษาที่ระบุอยู่ในรายการที่รองรับหรือไม่
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }) {
  // ตรวจสอบว่าภาษาที่ระบุอยู่ในรายการที่รองรับหรือไม่
  const isValidLocale = locales.includes(params.locale);
  
  // ถ้าไม่ใช่ภาษาที่รองรับ จะแสดงข้อความแจ้งเตือน
  if (!isValidLocale) {
    return (
      <div>
        <h1>ภาษาไม่รองรับ</h1>
        <p>ภาษา "{params.locale}" ไม่ได้รับการรองรับในระบบของเรา</p>
      </div>
    );
  }

  return (
    <div lang={params.locale}>
      {children}
    </div>
  );
}
