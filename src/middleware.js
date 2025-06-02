import createMiddleware from "next-intl/middleware";
import { localePrefix, locales } from "./navigation";

if (!locales.includes("th")) {
  throw new Error("Invalid default locale. Please check your locales setup.");
}

export default createMiddleware({
  locales,
  localePrefix,
  localeDetection: true,
  defaultLocale: "th",
});

// only applies this middleware to files in the app directory
export const config = {
  matcher: ["/((?!api|static|_next|favicon.ico|robots.txt)(?!.*\\/[^\\/]*\\.[^\\/]{2,4}$).*)"],
};
