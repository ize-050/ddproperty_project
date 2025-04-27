import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./navigation";
import { NextResponse } from 'next/server';

// สร้าง middleware ที่จัดการเฉพาะ i18n
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  localeDetection: false
});

// Middleware หลักที่จะจัดการทั้ง i18n และกรณีพิเศษ
export default function middleware(request) {
  const { pathname, search } = request.nextUrl;
  
  // กรณีพิเศษสำหรับ /properties/list
  if (pathname === '/properties/list') {
    // ใช้ภาษาไทยเป็นค่าเริ่มต้น แต่ไม่แสดง /th ในพาธ
    // สร้าง URL ใหม่สำหรับการแสดงผลภายใน แต่ไม่เปลี่ยน URL ที่แสดงในเบราว์เซอร์
    const url = request.nextUrl.clone();
    url.pathname = `/th${pathname}`;
    
    // คงค่า query parameters ไว้
    if (search) {
      url.search = search;
    }
    
    // ใช้ rewrite แทน redirect เพื่อไม่เปลี่ยน URL ที่แสดงในเบราว์เซอร์
    return NextResponse.rewrite(url);
  }
  
  // กรณีอื่นๆ ใช้ intlMiddleware ปกติ
  return intlMiddleware(request);
}

// กำหนดเส้นทางที่ middleware นี้จะทำงาน
export const config = {
  // ทำงานกับทุกเส้นทาง ยกเว้นเส้นทางที่ขึ้นต้นด้วย /api, /_next, และไฟล์ static
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
