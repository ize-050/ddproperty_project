import { NextResponse } from 'next/server';
import createMiddleware from "next-intl/middleware";
import { localePrefix, locales } from "./navigation";

if (!locales.includes("th")) {
  throw new Error("Invalid default locale. Please check your locales setup.");
}

// สร้าง middleware ของ next-intl
const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  localeDetection: true,
  defaultLocale: "th",
});

// ใช้ middleware แบบง่ายๆ โดยเพิ่ม header และเรียกใช้ intlMiddleware
export default function middleware(request) {
  // เรียกใช้ middleware ของ next-intl ก่อน
  const response = intlMiddleware(request);
  
  // เพิ่ม header ใน response โดยเก็บ pathname ที่ถูกต้อง
  const fullPath = request.nextUrl.pathname;
  response.headers.set('x-next-pathname', fullPath);
  
  return response;
}








// only applies this middleware to files in the app directory
export const config = {
  matcher: ["/((?!api|static|_next|favicon.ico|robots.txt)(?!.*\\/[^\\/]*\\.[^\\/]{2,4}$).*)"],
};
