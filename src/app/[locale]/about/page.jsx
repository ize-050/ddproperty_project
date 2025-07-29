

import CallToActions from "@/components/common/CallToActions";
import Mission from "@/components/pages/about/Mission";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Features from "@/components/pages/about/Features";
import AboutContent from "@/components/about/AboutContent";

const Agents = dynamic(() => import("@/components/about/Agents"), { ssr: false });


// Dynamic metadata generation for About page
export async function generateMetadata({ params: { locale } }) {
  const baseUrl = 'https://ddproperty.com';
  const localizedUrl = locale === 'th' ? baseUrl : `${baseUrl}/${locale}`;
  const currentUrl = `${localizedUrl}/about`;
  
  const metadataByLocale = {
    th: {
      title: 'เกี่ยวกับ D-Luck Property: ผู้เชี่ยวชาญอสังหาฯ พัทยา & EEC',
      description: 'D-Luck Property คือที่ปรึกษาอสังหาฯ ครบวงจรในพัทยา เชี่ยวชาญคอนโด บ้าน วิลล่า. เรามุ่งมั่นบริการด้วยความโปร่งใส ช่วยเหลือทุกขั้นตอนสำหรับลูกค้าไทยและต่างชาติ เพื่อการลงทุนและอยู่อาศัยที่ราบรื่น',
      keywords: ['เกี่ยวกับ D-Luck Property','บริษัทอสังหาริมทรัพย์ พัทยา','นายหน้าอสังหาริมทรัพย์ พัทยา','ตัวแทนอสังหาริมทรัพย์ พัทยา','ผู้เชี่ยวชาญอสังหาฯ พัทยา','ที่ปรึกษาอสังหาฯ พัทยา','ประสบการณ์อสังหาริมทรัพย์ พัทยา','ทีมงาน D-Luck Property','บริการซื้อ ขาย เช่า พัทยา','บริหารจัดการอสังหาริมทรัพย์ พัทยา','กฎหมายอสังหาริมทรัพย์ พัทยา','ที่ปรึกษาการลงทุนอสังหาฯ พัทยา','บริษัทอสังหาฯ ชาวต่างชาติ พัทยา','อสังหาริมทรัพย์ EEC','อสังหาริมทรัพย์ที่เชื่อถือได้ พัทยา','ตัวแทนอสังหาริมทรัพย์ในพัทยาที่น่าเชื่อถือ','รีวิว D-Luck Property']
    },
    en: {
      title: 'About D-Luck Property: Your Pattaya & EEC Real Estate Experts',
      description: 'D-Luck Property is your trusted real estate consultant in Pattaya & EEC. We specialize in condos, houses, and villas, offering transparent, expert guidance for seamless buying, selling, and renting for both local and international clients.',
      keywords: ['Buy property Pattaya','Pattaya real estate company','Pattaya real estate agents','D-Luck Property about us','Real estate experts Pattaya','Pattaya property consultants','Trusted real estate Pattaya','Buy sell rent property Pattaya','Property management Pattaya','Pattaya condo specialists','Pattaya villa specialists','Pattaya house specialists','Pattaya pool villa experts','Real estate investment Pattaya advice','Foreigner property buying Pattaya','EEC real estate services','Reliable property agency Pattaya','Pattaya real estate market insights','Experienced Pattaya agents','D-Luck Property team']
    },
    zh: {
      title: '关于D-Luck Property: 芭提雅及EEC房产专家',
      description: 'D-Luck Property是您在芭提雅及EEC值得信赖的一站式房产顾问。我们专注于公寓、别墅、房屋、泳池别墅的买卖租赁，为海内外客户提供专业透明的服务，助您轻松置业或投资。',
      keywords: ['关于 D-Luck Property','芭提雅房产公司','芭提雅房地产中介','芭提雅房产专家','芭提雅置业顾问','值得信赖的芭提雅房产','芭提雅公寓买卖租赁','芭提雅别墅买卖租赁','芭提雅房屋买卖租赁','芭提雅泳池别墅服务','芭提雅房产管理','芭提雅投资咨询','外国人芭提雅购房','EEC房产服务','D-Luck Property 团队','泰国芭提雅置业指南','专业房地产服务芭提雅','透明房产交易芭提雅','芭提雅优质房源']
    },
    ru: {
      title: 'О D-Luck Property: Ваш эксперт по недвижимости в Паттайе и ЕЭС',
      description: 'D-Luck Property — ваш надежный консультант по недвижимости в Паттайе и ЕЭС. Мы специализируемся на кондо, домах и виллах, предлагая прозрачные, экспертные консультации для беспроблемной покупки, продажи и аренды для местных и международных клиентов.',
      keywords: ['关于 D-Luck Property','недвижимость Паттайя компания','агентства недвижимости Паттайя','D-Luck Property о нас','эксперты по недвижимости Паттайя','консультанты по недвижимости Паттайя','надежная недвижимость Паттайя','купить продать арендовать недвижимость Паттайя','управление недвижимостью Паттайя','специалисты по кондо Паттайя','специалисты по виллам Паттайя','специалисты по домам Паттайя','эксперты по виллам с бассейном Паттайя','консультации по инвестициям в недвижимость Паттайя','покупка недвижимости иностранцами Паттайя','услуги по недвижимости ЕЭС','надежное агентство недвижимости Паттайя','аналитика рынка недвижимости Паттайя','опытные агенты Паттайя','D-Luck Property команда']
    }
  };

  // เลือก metadata ตาม locale
  const currentMetadata = metadataByLocale[locale] || metadataByLocale['th'];
  
  // สร้าง alternates สำหรับ SEO
  const languages = {};
  ['th', 'en', 'zh', 'ru'].forEach(lang => {
    const langUrl = lang === 'th' ? baseUrl : `${baseUrl}/${lang}`;
    languages[lang] = `${langUrl}/about`;
  });

  return {
    title: currentMetadata.title,
    description: currentMetadata.description,
    keywords: currentMetadata.keywords,
    alternates: {
      canonical: currentUrl,
      languages
    },
    openGraph: {
      title: currentMetadata.title,
      description: currentMetadata.description,
      url: currentUrl,
      siteName: 'D-Luck Property',
      images: [
        {
          url: `${baseUrl}/images/logo/logo.png`,
          width: 1200,
          height: 630,
          alt: 'D-Luck Property Logo',
        },
      ],
      locale: locale === 'th' ? 'th_TH' : locale === 'zh' ? 'zh_CN' : locale === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMetadata.title,
      description: currentMetadata.description,
      images: [`${baseUrl}/images/logo/logo.png`],
    },
  };
}

const About = () => {
  return (
    <>
      <AboutContent />
    </>
  );
};

export default About;
