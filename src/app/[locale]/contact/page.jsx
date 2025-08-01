import Image from "next/image";
import Form from "@/components/pages/contact/Form.jsx";
import LanguageApi from "@/utils/languageApi";
import { TranslationInitializer } from "@/components/Translation/page";

// Dynamic metadata generation for Contact page
export async function generateMetadata({ params: { locale } }) {
  const baseUrl = 'https://www.d-luckproperty.com';
  const localizedUrl = locale === 'th' ? baseUrl : `${baseUrl}/${locale}`;
  const currentUrl = `${localizedUrl}/contact`;
  
  // SEO-optimized metadata สำหรับ Contact page แยกตามภาษา
  const metadataByLocale = {
    th: {
      title: 'ติดต่อ D-Luck Property พัทยา | อสังหาริมทรัพย์และคำปรึกษา',
      description: 'ติดต่อ D-Luck Property เพื่อรับคำปรึกษาจากผู้เชี่ยวชาญในการซื้อ ขาย เช่า คอนโด บ้าน วิลล่า พูลวิลล่า ในพัทยาและ EEC. พร้อมบริการอสังหาฯ ที่น่าเชื่อถือวันนี้!',
      keywords: ['ติดต่อ D-Luck Property','ติดต่ออสังหาริมทรัพย์ พัทยา','สอบถามอสังหาฯ พัทยา','ติดต่อนายหน้า พัทยา','เบอร์โทร D-Luck Property','ที่อยู่ D-Luck Property','อีเมล D-Luck Property','ออฟฟิศอสังหาฯ พัทยา','ติดต่อซื้ออสังหาริมทรัพย์ พัทยา','ติดต่อขายอสังหาริมทรัพย์ พัทยา','ติดต่อเช่าอสังหาริมทรัพย์ พัทยา','ติดต่อคอนโด พัทยา','ติดต่อวิลล่า พัทยา','ติดต่อบ้าน พัทยา','ปรึกษาอสังหาริมทรัพย์ พัทยา','สนทนากับผู้เชี่ยวชาญอสังหาฯ พัทยา','แผนที่ D-Luck Property','เวลาทำการ D-Luck Property','Line ID D-Luck Property']
    },
    en: {
      title: 'Contact D-Luck Property Pattaya | Real Estate & Property Enquiries',
      description: 'Get in touch with D-Luck Property for expert advice on buying, selling, or renting condos, houses, villas, and pool villas in Pattaya & EEC. Contact us today for reliable real estate services.',
      keywords: ['Contact D-Luck Property','Pattaya real estate contact','Property enquiries Pattaya','Contact real estate agent Pattaya','Get in touch Pattaya property','D-Luck Property phone number','D-Luck Property email','Real estate office Pattaya','Contact us to buy property Pattaya','Contact us to sell property Pattaya','Contact us to rent property Pattaya','Pattaya condo contact','Pattaya villa contact','Pattaya house contact','Real estate consultation Pattaya','Find property in Pattaya contact','Speak to Pattaya real estate expert','D-Luck Property location Pattaya']
    },
    zh: {
      title: '联系D-Luck Property芭提雅 | 房产咨询与服务',
      description: '立即联系D-Luck Property，获取芭提雅及EEC地区公寓、房屋、别墅、泳池别墅买卖租赁的专家建议。我们提供可靠、专业的房产服务，期待您的垂询。',
      keywords: ['联系D-Luck Property','芭提雅房产联系','房产咨询芭提雅','联系芭提雅房产中介','D-Luck Property 电话','D-Luck Property 地址','D-Luck Property 邮箱','芭提雅房产公司联系','芭提雅公寓咨询','芭提雅别墅咨询','芭提雅房屋咨询','联系芭提雅置业顾问','D-Luck Property 微信','芭提雅房产客服','EEC房产联系','芭提雅中文房产中介','D-Luck Property 工作时间']
    },
    ru: {
      title: 'Контакты D-Luck Property Паттайя | Консультации по недвижимости',
      description: 'Свяжитесь с D-Luck Property для экспертной консультации по покупке, продаже или аренде кондо, домов, вилл и вилл с бассейном в Паттайе и ЕЭС. Надежные услуги по недвижимости ждут вас.',
      keywords: ['联系D-Luck Property','контакты D-Luck Property','недвижимость Паттайя контакты','запросы по недвижимости Паттайя','связаться с агентом недвижимости Паттайя','номер телефона D-Luck Property','D-Luck Property адрес','D-Luck Property электронная почта','офис недвижимости Паттайя','как связаться с D-Luck Property','связаться по покупке недвижимости Паттайя','связаться по продаже недвижимости Паттайя','связаться по аренде недвижимости Паттайя','контакты по кондо Паттайя','контакты по виллам Паттайя','контакты по домам Паттайя','консультация по недвижимости Паттайя','график работы D-Luck Property','русскоязычный агент Паттайя контакты']
    }
  };

  // เลือก metadata ตาม locale
  const currentMetadata = metadataByLocale[locale] || metadataByLocale['th'];
  
  // สร้าง alternates สำหรับ SEO
  const languages = {};
  ['th', 'en', 'zh', 'ru'].forEach(lang => {
    const langUrl = lang === 'th' ? baseUrl : `${baseUrl}/${lang}`;
    languages[lang] = `${langUrl}/contact`;
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

async function getContactTranslations(locale) {
    // Fetch contact section translations from API
    const response = await LanguageApi.getUiStringsBySection('contact', {
        serverSide: true,
        cache: 'no-store',
        next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.success) {
        console.error('Failed to fetch contact translations:', response.error);
        return [];
    }

    return response.data;
}

const Contact = async ({ params }) => {
    // Get locale from params
    const { locale } = params;
    const contactTranslations = await getContactTranslations(locale);
    
    // Map frontend locale to database field name
    const getLocaleField = (locale) => {
        switch (locale) {
            case 'zh':
                return 'zhCN'; // Database field for Chinese
            case 'th':
                return 'th';
            case 'ru':
                return 'ru';
            default:
                return 'en';
        }
    };
    
    const dbLocale = getLocaleField(locale);
    return (
        <>
            {/* Initialize translations in the client */}
            <TranslationInitializer 
                translations={{ contact: contactTranslations }} 
                locale={locale} 
            />

            <section className="p-0">
                <Image
                    className="home8-map contact-page"
                    loading="lazy"
                    width={1920}
                    height={1080}
                    src="/images/contact/banner-contact-us.png"
                    title="Contact Us - D-LUCK PROPERTY"
                    aria-label="Contact Us Banner"
                />
            </section>

            <section>
                <div className="container">
                    <div className="row d-flex align-items-end">
                        <div className="col-lg-5 position-relative">
                            <div className="home8-contact-form default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white">
                                <h4 className="form-title mb25">
                                    {/* Use translation from API */}
                                    {contactTranslations.find(t => t.slug === 'need_more_info')?.[dbLocale] || 
                                     contactTranslations.find(t => t.slug === 'need_more_info')?.en || 
                                     'Need more information?'}
                                </h4>
                                <Form translations={contactTranslations} locale={locale} />
                            </div>
                        </div>

                        <div className="col-lg-5 offset-lg-2">
                            <h2 className="mb-4">
                                {/* Use translation from API */}
                                {contactTranslations.find(t => t.slug === 'contact_consultant')?.[dbLocale] || 
                                 contactTranslations.find(t => t.slug === 'contact_consultant')?.en || 
                                 'Contact our Property Consultant'}
                            </h2>
                            <p className="mb-4">
                                {/* Use translation from API */}
                                {contactTranslations.find(t => t.slug === 'contact_description')?.[dbLocale] || 
                                 contactTranslations.find(t => t.slug === 'contact_description')?.en || 
                                 'Please do not hesitate to contact us if you have any questions about the condo & properties buying, selling or leasing process and for would like to schedule an appointment to view properties in Pattaya.'}
                            </p>

                        </div>
                    </div>
                </div>
            </section>


            <section className="container">
                <div className="d-flex row">
                    <div className="col-lg-4 text-center">
                        <a href="tel:+66951432234" className="d-block text-decoration-none">
                            <div className="mb-3">
                                <img src="/images/contact/icon-call-us.png" alt="Call Us" width="60" height="60" />
                            </div>
                            <h5 className="mb-0">
                                {contactTranslations.find(t => t.slug === 'call_us_title')?.[dbLocale] || 
                                 contactTranslations.find(t => t.slug === 'call_us_title')?.en || 
                                 'Call Us Now'}
                            </h5>
                            <p className="small text-muted">
                                {contactTranslations.find(t => t.slug === 'phone_number')?.[dbLocale] || 
                                 contactTranslations.find(t => t.slug === 'phone_number')?.en || 
                                 '+66(0)95 1432 2345'}
                            </p>
                        </a>
                    </div>

                    <div className="col-lg-4 text-center">
                        <a href="mailto:info@d-luckproperty.com" className="d-block text-decoration-none">
                            <div className="mb-3">
                                <img src="/images/contact/icon-drop-a-mail.png" alt="Email Us" width="60" height="60" />
                            </div>
                            <h5 className="mb-0">
                                {contactTranslations.find(t => t.slug === 'drop_mail_title')?.[dbLocale] || 
                                 contactTranslations.find(t => t.slug === 'drop_mail_title')?.en || 
                                 'Drop a Mail'}
                            </h5>
                            <p className="small text-muted">
                                {contactTranslations.find(t => t.slug === 'email_address_contact')?.[dbLocale] || 
                                 contactTranslations.find(t => t.slug === 'email_address_contact')?.en || 
                                 'info@d-luckproperty.com'}
                            </p>
                        </a>
                    </div>

                    <div className="col-lg-4 text-center">
                        <a href="https://line.me/ti/p/@dluck" target="_blank" rel="noopener noreferrer" className="d-block text-decoration-none">
                            <div className="mb-3">
                                <img src="/images/contact/icon-add-friend.png" alt="Line" width="60" height="60" />
                            </div>
                            <h5 className="mb-0">
                                {contactTranslations.find(t => t.slug === 'add_friend_title')?.[dbLocale] || 
                                 contactTranslations.find(t => t.slug === 'add_friend_title')?.en || 
                                 'Add Friend'}
                            </h5>
                            <p className="small text-muted">
                                {contactTranslations.find(t => t.slug === 'line_id_text')?.[dbLocale] || 
                                 contactTranslations.find(t => t.slug === 'line_id_text')?.en || 
                                 'Line ID : @dluck or Click'}
                            </p>
                        </a>
                    </div>
                </div>
            </section>


        </>
    );
};

export default Contact;
