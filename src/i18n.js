import { getRequestConfig } from 'next-intl/server';

export const supportedLocales = ['th', 'en', 'zh', 'ru'];
export const defaultLocale = 'th';

export default getRequestConfig(async ({ locale }) => {
  // ตรวจสอบว่า locale มีค่าและอยู่ในรายการที่รองรับ
  const finalLocale = locale && supportedLocales.includes(locale) ? locale : defaultLocale;
  
  return {
    // ต้องส่งคืน locale ด้วย ตามที่ next-intl v4 ต้องการ
    locale: finalLocale,
    // โหลดข้อความแปลภาษา
    messages: (await import(`./messages/${finalLocale}.json`)).default,
    // ตั้งค่าเพิ่มเติม (ไม่จำเป็นแต่แนะนำให้ใส่)
    timeZone: 'Asia/Bangkok',
    now: new Date()
  };
});