import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./navigation";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  localeDetection: false
});

// กำหนดเส้นทางที่ middleware นี้จะทำงาน
export const config = {
  // ทำงานกับทุกเส้นทาง ยกเว้นเส้นทางที่ขึ้นต้นด้วย /api, /_next, และไฟล์ static
  matcher: ["/((?!api|static|_next|favicon.ico|robots.txt)(?!.*\/[^\/]*\.[^\/]{2,4}$).*)"],
};
