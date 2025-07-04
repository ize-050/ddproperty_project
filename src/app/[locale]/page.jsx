import React, { Suspense } from "react";
import { lazy } from 'react';
import dynamic from 'next/dynamic';

import './loading-animation.css';
import './loading-placeholders.css';
import serverApi from '@/utils/serverApi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

//service
import LanguageApi from '@/utils/languageApi';

// Store


import TranslationInitializer from '@/components/Translation/page';

//component
const SidebarStickyBar = dynamic(() => import("@/components/home/home/SidebarStickyBar"), { ssr: false });
const PartnerDark = dynamic(() => import("@/components/common/PartnerDark"), { ssr: false });

const BannerWithPreload = lazy(() => import("@/components/home/home/BannerWithPreload"))
// บังคับให้โหลดข้อมูลใหม่ทุกครั้งที่เข้าหน้า รวมถึงตอนกดปุ่ม Back
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// ใช้ lazy import แบบมี suspense เพื่อแก้ไขปัญหา hydration error
const Page = lazy(() => import("@/components/home/page"));


// สร้าง metadata แบบ dynamic ตามภาษา
export async function generateMetadata() {
  // ใช้ getLocale จาก next-intl/server แทนการใช้ params
  const locale = 'th'; // กำหนดค่าเริ่มต้นเป็นภาษาไทย

  const baseUrl = 'https://ddproperty.com';
  const localizedUrl = locale === 'th' ? baseUrl : `${baseUrl}/${locale}`;

  // ข้อความสำหรับแต่ละภาษา
  const titles = {
    th: "DDProperty - เว็บไซต์อสังหาริมทรัพย์",
    en: "DDProperty - Real Estate Website",
    zh: "DDProperty - 房地产网站",
    ru: "DDProperty - Сайт недвижимости"
  };

  const descriptions = {
    th: "ค้นหาบ้าน คอนโด และอสังหาริมทรัพย์ที่ดีที่สุดในประเทศไทย",
    en: "Find the best homes, condos, and real estate in Thailand",
    zh: "在泰国找到最好的房屋、公寓和房地产",
    ru: "Найдите лучшие дома, квартиры и недвижимость в Таиланде"
  };

  // สร้าง alternates สำหรับ SEO
  const languages = {};
  ['th', 'en', 'zh', 'ru'].forEach(lang => {
    languages[lang] = lang === 'th' ? baseUrl : `${baseUrl}/${lang}`;
  });

  return {
    title: titles[locale] || titles.th,
    description: descriptions[locale] || descriptions.th,
    alternates: {
      canonical: localizedUrl,
      languages
    }
  };
}

// ฟังก์ชันสำหรับดึงข้อมูล properties แบบสุ่มจาก API (Server-Side)
async function getRandomProperties() {
  try {
    // เรียกใช้ serverApi เพื่อดึงข้อมูลจาก API
    const response = await serverApi.get('/properties/random', {
      params: { count: 4 },
      headers: { 'x-api-key': 'dd-property-api-key-2025' } // ใส่ API key สำหรับการเรียก API
    });
    console.log('Random Properties:', response.data);
    // ตรวจสอบข้อมูลที่ได้รับจาก API
    if (response && response.data) {
      console.log('Random Properties:', response.data);
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }

    return [];
  } catch (error) {
    console.error('Error fetching random properties (CSR):', error);
    // ส่งค่า fallback data ในกรณีที่เกิดข้อผิดพลาด
    return [];
  }
}

async function getAllpropertyTypes() {
  try {
    // เรียกใช้ serverApi เพื่อดึงข้อมูลจาก API
    const response = await serverApi.get('/property-types', {
      headers: { 'x-api-key': 'dd-property-api-key-2025' } // ใส่ API key สำหรับการเรียก API
    });
    console.log('Property Types:', response.data);
    // ตรวจสอบข้อมูลที่ได้รับจาก API
    if (response && response.data) {
      console.log('Property Types:', response.data);
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }

    return [];
  } catch (error) {
    console.error('Error fetching property types (CSR):', error);
    // ส่งค่า fallback data ในกรณีที่เกิดข้อผิดพลาด
    return [];
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล Zone ทั้งหมดจาก API (Server-Side)
async function getAllZones() {
  try {
    // เรียกใช้ serverApi เพื่อดึงข้อมูลจาก API`
    const response = await serverApi.get('/zones', {
      headers: { 'x-api-key': 'dd-property-api-key-2025' } // ใส่ API key สำหรับการเรียก API
    });



    // ตรวจสอบข้อมูลที่ได้รับจาก API
    if (response && response.data) {
      console.log('Zones:', response.data);
      return response.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching zones (SSR):', error);
    // ส่งค่า fallback data ในกรณีที่เกิดข้อผิดพลาด
    return [];
  }
}

async function getLanguage(section = 'home') {
  try {
    const response = await LanguageApi.getUiStringsBySection(section, {
      serverSide: true,
      // Cache for 1 hour by default, can be customized
      next: { revalidate: 3600 }
    });



    if (!response.success) {
      console.error(`Failed to fetch ${section} translations`);
      return {};
    }

    // Transform API response into the format needed for the store
    const translations = response.data.reduce((acc, item) => {
      acc[item.slug] = {
        en: item.en,
        th: item.th,
        zhCN: item.zhCN,
        ru: item.ru
      };
      return acc;
    }, {});

    return translations;
  } catch (error) {
    console.error(`Error fetching ${section} translations (SSR):`, error);
    return {};
  }
}



export default async function HomeContent({ params }) {
  // ดึงข้อมูล properties แบบสุ่มจาก API
  const randomProperties = await getRandomProperties();
  // ดึงข้อมูล Zone ทั้งหมดจาก API
  const zones = await getAllZones();

  // Get the current locale from params
  const locale = params?.locale || 'en';

  // Get all home section translations
  const homeTranslations = await getLanguage('home');

  const propertyTypes = await getAllpropertyTypes();

  console.log("homeTranslations", homeTranslations)

  // Create a local getString function for server components
  const getString = (slug, defaultValue = '') => {
    const string = homeTranslations[slug];
    return string ? (string[locale] || string.en || defaultValue) : defaultValue;
  };


  return (
    <TranslationInitializer translations={homeTranslations} locale={locale} section="home">
      <Suspense fallback={<div className="sidebar-loading"></div>}>
        <SidebarStickyBar />
      </Suspense>
      <BannerWithPreload propertyTypes={propertyTypes} />
      <section className="our-partners bgc-dark pt60 pb60">
        <div className="container">
          <div className="row">
            <div className="col-lg-12" data-aos="fade-up">
              <div className="main-title text-center">
                <h6 className="text-white">{getString('developer')}</h6>
              </div>
            </div>
            <div className="col-lg-12 text-center">
              <div
                className="dots_none nav_none"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <Suspense fallback={<div className="partners-loading"></div>}>
                  <PartnerDark />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="property-info-section bgc-f8">
        {locale === 'th' ? (
          <div className="container">
            <div className="row mt20">
              <div className="col-lg-12" data-aos="fade-up">
                <div className="main-title text-center">
                  <h2>อสังหาริมทรัพย์พัทยา | D-LUCK PROPERTY</h2>
                </div>
              </div>
              <div className="col-12 " data-aos="fade-up" data-aos-delay="100">
                <p>
                  D-LUCK PROPERTY คือจุดหมายปลายทางอันดับหนึ่งสำหรับบริการอสังหาริมทรัพย์พัทยา ไม่ว่าคุณจะมองหาคอนโดพัทยาขาย หรือคอนโดพัทยาเช่า เราให้บริการข้อมูลที่ครบถ้วนและทันสมัยเกี่ยวกับตลาดอสังหาริมทรัพย์ไทยที่เปลี่ยนแปลงอยู่ตลอดเวลา
                </p>

                <div className="mt20">
                  <h4>บริการซื้อ ขาย และเช่าอสังหาริมทรัพย์ในพัทยา</h4>
                  <p>
                    ที่ D-LUCK PROPERTY เราเชี่ยวชาญในการช่วยเหลือลูกค้าซื้อ ขาย และเช่าคอนโด บ้าน ที่ดิน และอสังหาริมทรัพย์เชิงพาณิชย์ทั่วพัทยา ประเทศไทย ทีมงานผู้เชี่ยวชาญของเราดูแลให้การทำธุรกรรมเป็นไปอย่างราบรื่นสำหรับลูกค้าทั้งในประเทศและต่างประเทศ
                  </p>
                </div>

                <div className="mt20">
                  <h4>โอกาสการลงทุนอสังหาริมทรัพย์พัทยา</h4>
                  <p>
                    กำลังมองหาการลงทุนอสังหาริมทรัพย์พัทยา? เราช่วยนักลงทุนค้นหาอสังหาริมทรัพย์ที่ให้ผลตอบแทนสูงและมีศักยภาพในการให้เช่าที่แข็งแกร่ง โดยตั้งเป้าผลตอบแทนปีละ 8% ขึ้นไป ผู้เชี่ยวชาญด้านการลงทุนของเรามุ่งเน้นคอนโดติดหาด โครงการใหม่ และอสังหาริมทรัพย์ให้เช่าที่มีผู้เช่าอยู่แล้ว
                  </p>
                </div>

                <div className="mt20">
                  <h4>บริการลงประกาศขายและให้เช่าอสังหาริมทรัพย์แบบมืออาชีพ</h4>
                  <p>
                    เจ้าของอสังหาริมทรัพย์สามารถเพิ่มการเข้าถึงได้สูงสุดผ่านบริการลงประกาศที่ครบครันของเรา เรานำเสนอการถ่ายภาพแบบมืออาชีพ การตลาดผ่านหลายแพลตฟอร์ม และการวิเคราะห์ราคาจากผู้เชี่ยวชาญ เพื่อขายหรือให้เช่าอสังหาริมทรัพย์พัทยาของคุณอย่างรวดเร็วและทำกำไร
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : locale == 'en' ? (
          <div className="container">
            <div className="row mt20">
              <div className="col-lg-12" data-aos="fade-up">
                <div className="main-title text-center">
                  <h2>Pattaya Real Estate | D-LUCK PROPERTY</h2>
                </div>
              </div>
              <div className="col-12" data-aos="fade-up" data-aos-delay="100">
                <p>
                  D-LUCK PROPERTY is your premier destination for Pattaya real estate services. Whether you&#39;re searching for Pattaya condos for sale or Pattaya condos for rent, we provide comprehensive, up-to-date information about Thailand&#39;s dynamic property market.
                </p>

                <div className="mt20">
                  <h4>Buy, Sell &amp; Rent Property Services in Pattaya</h4>
                  <p>
                    At D-LUCK PROPERTY, we specialize in helping clients buy, sell, and rent condos, houses, land, and commercial properties throughout Pattaya, Thailand. Our experienced team ensures smooth transactions for both local and international clients.
                  </p>
                </div>

                <div className="mt20">
                  <h4>Pattaya Property Investment Opportunities</h4>
                  <p>
                    Looking to invest in Pattaya real estate? We help investors find high-yield properties with strong rental potential, targeting 8%+ annual returns. Our investment specialists focus on beachfront condos, off-plan developments, and established rental properties.
                  </p>
                </div>

                <div className="mt20">
                  <h4>Professional Property Listing Services</h4>
                  <p>
                    Property owners can maximize their exposure through our comprehensive listing services. We offer professional photography, multi-platform marketing, and expert pricing analysis to sell or rent your Pattaya property quickly and profitably.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : locale == 'ru' ? (
          <div className="container">
            <div className="row mt20">
              <div className="col-lg-12" data-aos="fade-up">
                <div className="main-title text-center">
                  <h2>Недвижимость Паттайи | D-LUCK PROPERTY</h2>
                </div>
              </div>
              <div className="col-12 " data-aos="fade-up" data-aos-delay="100">
                <p>
                D-LUCK PROPERTY — ваша ведущая платформа для услуг недвижимости в Паттайе. Независимо от того, ищете ли вы кондоминиумы в Паттайе на продажу или кондоминиумы в Паттайе в аренду, мы предоставляем полную и актуальную информацию о динамичном рынке недвижимости Таиланда.
                </p>

                <div className="mt20">
                  <h4>Услуги покупки, продажи и аренды недвижимости в Паттайе</h4>
                  <p>
                  В D-LUCK PROPERTY мы специализируемся на помощи клиентам в покупке, продаже и аренде кондоминиумов, домов, земельных участков и коммерческой недвижимости по всей Паттайе, Таиланд. Наша опытная команда обеспечивает беспроблемные сделки как для местных, так и для международных клиентов.
                  </p>
                </div>

                <div className="mt20">
                  <h4>Услуги покупки, продажи и аренды недвижимости в Паттайе</h4>
                  <p>
                    В D-LUCK PROPERTY мы специализируемся на помощи клиентам в Паттайе в покупке, продаже и аренде квартир, домов, земли и коммерческой недвижимости. Наш опытный коллектив обеспечивает успешные сделки для местных и иностранных клиентов.
                  </p>
                </div>

                <div className="mt20">
                  <h4>Инвестиционные возможности в недвижимость Паттайи</h4>
                  <p>
                  Ищете инвестиции в недвижимость Паттайи? Мы помогаем инвесторам найти высокодоходную недвижимость с сильным арендным потенциалом, нацеливаясь на годовую доходность от 8%. Наши специалисты по инвестициям сосредоточены на прибрежных кондоминиумах, проектах на стадии строительства и готовой арендной недвижимости с существующими арендаторами.
                  </p>
                </div>

                <div className="mt20">
                  <h4>Профессиональные услуги размещения объявлений</h4>
                  <p>
                  Владельцы недвижимости могут максимизировать охват через наши комплексные услуги размещения. Мы предлагаем профессиональную фотосъемку, маркетинг на множественных платформах и экспертный анализ ценообразования для быстрой и прибыльной продажи или аренды вашей недвижимости в Паттайе.
                  </p>
                </div>
                
                <div className="mt20">
                  <p>
                  Свяжитесь с D-LUCK PROPERTY сегодня для получения бесплатной консультации и откройте для себя лучшие возможности недвижимости в Паттайе.
                  </p>
                </div>
            
              </div>
            </div>
          </div>
        ) : locale == 'zh' ? (
          <div className="container">
            <div className="row mt20">
              <div className="col-lg-12" data-aos="fade-up">
                <div className="main-title text-center">
                  <h2>芭提雅房地产 | D-LUCK PROPERTY</h2>
                </div>
              </div>
              <div className="col-12" data-aos="fade-up" data-aos-delay="100">
                <p>
                  D-LUCK PROPERTY 是您芭提雅房地产服务的首选平台。无论您是寻找芭提雅公寓出售还是芭提雅公寓出租，我们都提供关于泰国动态房地产市场的全面、最新信息。
                </p>

                <div className="mt20">
                  <h4>芭提雅房产买卖租赁服务</h4>
                  <p>
                    在 D-LUCK PROPERTY，我们专门帮助客户在泰国芭提雅地区买卖和租赁公寓、别墅、土地和商业地产。我们经验丰富的团队确保本地和国际客户的交易顺利进行。
                  </p>
                </div>

                <div className="mt20">
                  <h4>芭提雅房地产投资机会</h4>
                  <p>
                    寻找芭提雅房地产投资机会？我们帮助投资者找到具有强劲租赁潜力的高收益房产，目标年回报率达8%以上。我们的投资专家专注于海滨公寓、期房项目和已有租客的成熟租赁房产。
                  </p>
                </div>

                <div className="mt20">
                  <h4>专业房产挂牌服务</h4>
                  <p>
                    房产业主可通过我们全面的挂牌服务最大化曝光度。我们提供专业摄影、多平台营销和专家定价分析，帮助您快速且盈利地出售或出租芭提雅房产。
                  </p>
                </div>

          
              </div>
            </div>
          </div>
        ) : locale == 'ru' ? (
          <div className="container">
            <div className="row mt20">
              <div className="col-lg-12" data-aos="fade-up">
                <div className="main-title text-center">
                  <h2>Pattaya Real Estate | D-LUCK PROPERTY</h2>
                </div>
              </div>
              <div className="col-12 " data-aos="fade-up" data-aos-delay="100">
                <p>
                  D-LUCK PROPERTY คือจุดหมายปลายทางอันดับหนึ่งสำหรับบริการอสังหาริมทรัพย์พัทยา ไม่ว่าคุณจะมองหาคอนโดพัทยาขาย หรือคอนโดพัทยาเช่า เราให้บริการข้อมูลที่ครบถ้วนและทันสมัยเกี่ยวกับตลาดอสังหาริมทรัพย์ไทยที่เปลี่ยนแปลงอยู่ตลอดเวลา
                </p>
              </div>
            </div>
          </div>
        ) : ''}
      </section>

      <Page randomProperties={randomProperties} zones={zones} />

    </TranslationInitializer>
  );
}
