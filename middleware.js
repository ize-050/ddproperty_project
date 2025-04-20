import { NextResponse } from 'next/server';

// รายการภาษาที่รองรับ
const locales = ['th', 'en', 'zh', 'ru'];
// ภาษาเริ่มต้น
export const defaultLocale = 'th';

// ฟังก์ชันสำหรับตรวจสอบภาษาจาก Accept-Language header
function getLocaleFromHeader(request) {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;
  
  const userLocales = acceptLanguage.split(',').map(l => l.split(';')[0].trim());
  
  for (const locale of userLocales) {
    const shortLocale = locale.substring(0, 2);
    if (locales.includes(shortLocale)) {
      return shortLocale;
    }
  }
  
  return defaultLocale;
}

export function middleware(request) {
  // ดึง pathname จาก URL
  const pathname = request.nextUrl.pathname;
  
  // ตรวจสอบว่า pathname มีภาษาหรือไม่
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // ถ้าเป็น /th ให้ redirect ไปที่ root path
  if (pathname === '/th') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // ถ้าไม่มีภาษาใน pathname และไม่ใช่ static files หรือ API routes
  if (!pathnameHasLocale && !pathname.includes('.') && !pathname.startsWith('/api')) {
    // ตรวจสอบภาษาจาก Accept-Language header
    const locale = getLocaleFromHeader(request);
    
    // ถ้าเป็นภาษาไทยและเป็น root path
    if (locale === defaultLocale && pathname === '/') {
      return NextResponse.next();
    }
    
    // ถ้าเป็นภาษาไทยแต่ไม่ใช่ root path
    if (locale === defaultLocale) {
      return NextResponse.next();
    }
    
    // สำหรับภาษาอื่นๆ ให้ redirect ไปที่ /{locale}{pathname}
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // ใช้กับทุกเส้นทางยกเว้น api, _next, และไฟล์สถิต
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
};
