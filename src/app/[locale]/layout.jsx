import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from "next-intl/server";
import { Suspense } from 'react';
import { lazy } from 'react';
import dynamic from 'next/dynamic';

// นำเข้า ErrorBoundary แบบ dynamic เพื่อให้ทำงานเฉพาะฝั่ง client
const ErrorBoundary = dynamic(() => import('@/components/common/ErrorBoundary'), { 
  ssr: false 
});

// นำเข้า AppLoadingWrapper แบบ dynamic
const AppLoadingWrapper = dynamic(() => import('@/components/common/AppLoadingWrapper'), {
  ssr: false
});

import Script from 'next/script';
import React from 'react';

import "../../../node_modules/react-modal-video/scss/modal-video.scss";
import "@/styles/scss/main.scss";
import "rc-slider/assets/index.css";
import "../../styles/main.scss"; // Import backoffice styles

import { DM_Sans, Poppins } from "next/font/google";
import { supportedLocales } from '../../i18n';
// const Header = lazy(() => import("@/components/home/home/Header"));
// const Header = lazy(() => import("@/components/common/DefaultHeader"));
const Header = lazy(() => import("@/components/home/home/Header"));
const MobileMenu = lazy(() => import("@/components/common/mobile-menu"));
const Footer = lazy(() => import("@/components/common/Footer"));
const ScrollToTop = lazy(() => import("@/components/common/ScrollTop"));
const LoadingAnimation = lazy(() => import("@/components/common/LoadingAnimation"));

import AOSInitializer from "@/components/common/AOSInitializer";
import { headers } from 'next/headers';

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

const LoadingScreen = () => (
  <div className="loading-screen" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    flexDirection: 'column'
  }}>
    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <h4>กำลังโหลดข้อมูล...</h4>
  </div>
);


export default async function LocaleLayout({ children, params }) {
  // โหลดข้อความแปลภาษา
  const locale = params.locale || defaultLocale;

  // ตรวจสอบว่าเป็น path ของ backoffice หรือไม่โดยตรงจาก params
  const headersList = headers();
  const referer = headersList.get('referer') || '';

  const isBackoffice = referer.includes('/backoffice');

  // ใช้ getMessages แทน useMessages เพราะเราอยู่ในคอมโพเนนต์ async
  const messages = await getMessages({ locale })



  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>DDProperty.co.th</title>
        <meta name="description" content="DDProperty.co.th - Thailand Real Estate Portal" />
        <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />
      </head>
      <body
        className={`body ${poppins.variable} ${dmSans.variable}`}
        cz-shortcut-listen="false"
      >
          <React.Fragment>
            <AOSInitializer />
            <NextIntlClientProvider locale={locale} messages={messages}>
              <div className="wrapper ovh">
                <AppLoadingWrapper>
                  <Suspense fallback={<LoadingAnimation />}>
                    <Header />
                    <MobileMenu />
                    <ErrorBoundary errorMessage="มีข้อผิดพลาดในการแสดงผล โปรดลองรีเฟรชหน้านี้">
                      {children}
                    </ErrorBoundary>
                    {!isBackoffice && <Footer />}

                    <ScrollToTop />
                  </Suspense>
                </AppLoadingWrapper>
              </div>
            </NextIntlClientProvider>
          </React.Fragment>

        {/* โหลด JavaScript หลังจาก hydration เสร็จสิ้น */}
        <Script id="aos-script" src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js" />
        <Script id="jquery-script" src="https://code.jquery.com/jquery-3.6.0.min.js" />
        <Script id="bootstrap-script" src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" />

        <Script id="init-scripts">
          {`
           
              window.addEventListener('load', function() {
      
                  AOS.init({
                    duration: 1200,
                    once: true,
                  });
                  console.log('AOS initialized');
              });
            
          `}
        </Script>
      </body>
    </html>
  );
}
