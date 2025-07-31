import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from "next-intl/server";
import { Suspense } from 'react';
import { lazy } from 'react';
import dynamic from 'next/dynamic';
import { headers } from "next/headers";
import AOSInit from "@/components/Aos/AosComponent";
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/utils/schemaGenerator';

// นำเข้า ErrorBoundary แบบ dynamic เพื่อให้ทำงานเฉพาะฝั่ง client


const HeaderBackoffice = dynamic(() => import('@/components/backoffice/layout/HeaderBackoffice'), {
  ssr: false
});

import Script from 'next/script';
import React from 'react';

import "../../../node_modules/react-modal-video/scss/modal-video.scss";
import "@/styles/scss/main.scss";
import "rc-slider/assets/index.css";
import "../../styles/main.scss"; // Import backoffice styles
import "@/styles/components/TopLoadingBar.scss"; // Import loading bar styles

import { DM_Sans, Poppins } from "next/font/google";
import { supportedLocales } from '../../i18n';
// const Header = lazy(() => import("@/components/home/home/Header"));
// const Header = lazy(() => import("@/components/common/DefaultHeader"));
const Header = lazy(() => import("@/components/home/home/Header"));
const HeaderSSR = lazy(() => import("@/components/home/home/HeaderSSR"))
const MobileMenu = lazy(() => import("@/components/common/mobile-menu"));
const Footer = lazy(() => import("@/components/common/DynamicFooter"));
const ScrollToTop = lazy(() => import("@/components/common/ScrollTop"));
const LoadingAnimation = lazy(() => import("@/components/common/LoadingAnimation"));
const MobileContactButtons = dynamic(() => import("@/components/common/MobileContactButtons"), {
  ssr: false
});

const TopLoadingBar = dynamic(() => import("@/components/common/TopLoadingBar"), {
  ssr: false
});

//backoffice
const BackofficeWrapper = lazy(() => import("@/components/backoffice/layout/BackofficeWrapper"));

// import AOSInitializer from "@/components/common/AOSInitializer";

// ฟังก์ชันสำหรับสร้าง static params สำหรับแต่ละภาษา
export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

// DM_Sans font
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--body-font-family",
});

// Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--title-font-family",
});



export default async function LocaleLayout({ children, params }) {
  // โหลดข้อความแปลภาษา
  const locale = params.locale || defaultLocale;


  const headersList = headers();
  const pathname = headersList.get('x-next-pathname') || '';
  let isBackofficeFromHeader = pathname.includes('/backoffice');
  let isLoginPage = pathname.includes('/login');


  let isBackofficeFromPath = false;


  if (params.slug && Array.isArray(params.slug)) {
    isBackofficeFromPath = params.slug.includes('backoffice');
  } else if (params.locale && params.locale === 'backoffice') {
    isBackofficeFromPath = true;
  } else {
    const currentPath = `/${params.locale}${params.slug ? '/' + params.slug.join('/') : ''}`;
    isBackofficeFromPath = currentPath.includes('/backoffice');
  }
  const isBackoffice = isBackofficeFromHeader || isBackofficeFromPath;



  const messages = await getMessages({ locale })

  // สร้าง Schema.org markup สำหรับ SEO
  const organizationSchema = generateOrganizationSchema(locale);
  const websiteSchema = generateWebsiteSchema(locale);

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <title>D&#39;LuckProperty</title> */}
        <meta name="description" content="D&#39;LuckProperty - Thailand Real Estate Portal" />
        <link rel="icon" type="image/x-icon" href="/images/dluckfav.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/images/dluckfav.ico" />
        <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />
        
        {/* Schema.org markup สำหรับ SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`body ${poppins.variable} ${dmSans.variable}`}
        cz-shortcut-listen="false"
        style={{
          fontFamily: '__Poppins_c70c06'
        }}
      >
        <React.Fragment>
          <GoogleAnalytics />
          <AOSInit />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="wrapper ovh">
              <TopLoadingBar />
              {isBackoffice && !isLoginPage ? (
                <>
                  <HeaderBackoffice />
                  <MobileMenu />
                  <BackofficeWrapper>{children}</BackofficeWrapper>
                </>
              ) :
                isLoginPage ? (
                  <>
                    {children}
                  </>
                ) : (
                  <>
                    <HeaderSSR />
                    <MobileMenu />
                    {children}
                    <Footer />
                    <ScrollToTop />
                    <MobileContactButtons />
                  </>
                )}
            </div>
          </NextIntlClientProvider>
        </React.Fragment>

        <Script id="aos-script" src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js" />
        <Script id="jquery-script" src="https://code.jquery.com/jquery-3.6.0.min.js" />
        <Script id="bootstrap-script" src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" />

        {/* <Script id="init-scripts">
          {`
           
              window.addEventListener('load', function() {
      
                  AOS.init({
                    duration: 1200,
                    once: true,
                  });
                  console.log('AOS initialized');
              });
            
          `}
        </Script> */}
      </body>
    </html>
  );
}
