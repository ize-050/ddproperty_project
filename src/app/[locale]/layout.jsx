import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from "next-intl/server";
import { Suspense } from 'react';
import { lazy } from 'react';
import Script from 'next/script';
import React from 'react';
import dynamic from 'next/dynamic';
import "../../../node_modules/react-modal-video/scss/modal-video.scss";
import "../../../public/scss/main.scss";
import "rc-slider/assets/index.css";
import "../../styles/main.scss"; // Import backoffice styles
import { DM_Sans, Poppins } from "next/font/google";
import { supportedLocales } from '../../i18n';
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* SEO - เพิ่ม alternate links สำหรับแต่ละภาษา */}
        <link rel="alternate" hrefLang="th" href="https://ddproperty.com" />
        <link rel="alternate" hrefLang="en" href="https://ddproperty.com/en" />
        <link rel="alternate" hrefLang="zh" href="https://ddproperty.com/zh" />
        <link rel="alternate" hrefLang="ru" href="https://ddproperty.com/ru" />
        <link rel="alternate" hrefLang="x-default" href="https://ddproperty.com" />

        {/* โหลด CSS ทั้งหมดใน head เพื่อหลีกเลี่ยง hydration error */}

        <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css" rel="stylesheet" />
        <link href="/css/style.css" rel="stylesheet" />
      </head>
      <body
        className={`body ${poppins.variable} ${dmSans.variable}`}
        cz-shortcut-listen="false"
      >

        <AOSInitializer />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="wrapper ovh">
            <Suspense fallback={<LoadingAnimation />}>
              <Header />
              <MobileMenu />
              {children}
              {!isBackoffice && <Footer />}
              <ScrollToTop />
            </Suspense>
            <AOSInitializer />
          </div>
        </NextIntlClientProvider>

        {/* โหลด JavaScript หลังจาก hydration เสร็จสิ้น */}
        <Script id="bootstrap-script" src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossOrigin="anonymous" />
        <Script id="aos-script" src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js" />
        <Script id="jquery-script" src="https://code.jquery.com/jquery-3.6.0.min.js" />

      
        <Script id="init-scripts">
          {`
           
              window.addEventListener('load', function() {
      
                  AOS.init({
                    duration: 1200,
                    once: true,
                    disable: 'mobile'
                  });
                  console.log('AOS initialized');
              });
            
          `}
        </Script>
      </body>
    </html>

  );
}

// --- AOS Effect Integration ---
// This hook will initialize AOS and refresh it on every route change


// Add this component to your layout (e.g. inside <body> or <NextIntlClientProvider>)
