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

// ฟังก์ชันตรวจสอบว่า pathname มี locale หรือไม่
function getLocaleFromPathname(pathname) {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  return locales.includes(firstSegment) ? firstSegment : null;
}

// ฟังก์ชันลบ locale prefix จาก pathname
function removeLocaleFromPathname(pathname, locale) {
  if (locale && pathname.startsWith(`/${locale}`)) {
    return pathname.slice(`/${locale}`.length) || '/';
  }
  return pathname;
}

// ฟังก์ชันตรวจสอบว่าเป็น static file หรือไม่
function isStaticFile(pathname) {
  return /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot|webp)$/i.test(pathname);
}

export function middleware(request) {
  // ดึง pathname จาก URL
  const pathname = request.nextUrl.pathname;
  
  // ตรวจสอบว่าเป็น sitemap.xml หรือ robots.txt
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    console.log('Middleware: Excluding from locale handling:', pathname);
    return NextResponse.next();
  }
  
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     * - images (public images)
     * - css (public css)
     * - fonts (public fonts)
     * - scss (public scss)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|css|fonts|scss).*)',
  ],
};
