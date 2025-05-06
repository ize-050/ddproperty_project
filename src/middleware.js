import createMiddleware from "next-intl/middleware";
import { localePrefix, locales } from "./navigation";

export default createMiddleware({
  locales,
  localePrefix,
  localeDetection: false,
  defaultLocale: "th",
});

// only applies this middleware to files in the app directory
export const config = {
  matcher: ["/((?!api|static|_next|favicon.ico|robots.txt)(?!.*\\/[^\\/]*\\.[^\\/]{2,4}$).*)"],
};
