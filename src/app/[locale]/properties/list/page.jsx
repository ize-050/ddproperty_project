import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import ListingPropertiesPage from '@/components/properties/listing/ListingPropertiesPage';
import serverApi from '@/utils/serverApi';
import SidebarStickyBar from '@/components/home/home/SidebarStickyBar';

// บังคับให้โหลดข้อมูลใหม่ทุกครั้งที่เข้าหน้า
export const dynamic = 'force-dynamic';

// ฟังก์ชันสำหรับดึงข้อมูลอสังหาริมทรัพย์ตามเงื่อนไขการค้นหา
async function searchProperties(searchParams) {
  try {

    
    // สร้าง query parameters จาก searchParams
    const queryParams = new URLSearchParams();

    // เพิ่มพารามิเตอร์ต่างๆ
    if (searchParams.propertyType) {
      queryParams.append('propertyType', searchParams.propertyType);
    }

    if (searchParams.minPrice) {
      queryParams.append('minPrice', searchParams.minPrice);
    }

    if (searchParams.maxPrice) {
      queryParams.append('maxPrice', searchParams.maxPrice);
    }

    if (searchParams.zoneId) {
      queryParams.append('zoneId', searchParams.zoneId);
    }

    if (searchParams.listingType) {
      queryParams.append('listingType', searchParams.listingType);
    }

    // เพิ่มพารามิเตอร์อื่นๆ ที่อาจมีในอนาคต
    if (searchParams.bedrooms) {
      queryParams.append('bedrooms', searchParams.bedrooms);
    }

    if (searchParams.bathrooms) {
      queryParams.append('bathrooms', searchParams.bathrooms);
    }

    // เพิ่ม keyword search parameter
    if (searchParams.searchQuery) {
      queryParams.append('keyword', searchParams.searchQuery);
    }

    if (searchParams.page) {
      queryParams.append('page', searchParams.page);
    } else {
      queryParams.append('page', '1'); // ค่าเริ่มต้น
    }

    if(searchParams.type){
      queryParams.append('type', searchParams.type);
    }

    if (searchParams.limit) {
      queryParams.append('limit', searchParams.limit);
    } else {
      queryParams.append('limit', '9'); // ค่าเริ่มต้น
    }

    // เรียกใช้ API เพื่อค้นหาอสังหาริมทรัพย์
    const response = await serverApi.get(`/search/properties?${queryParams.toString()}`, {
      headers: { 'x-api-key': 'dd-property-api-key-2025' }
    });

  


    // ตรวจสอบข้อมูลที่ได้รับจาก API
    if (response && response.data) {
      console.log('Search Resultspagination:', response.data);
      return { data: response.data, pagination: response.pagination };
    }

    return { data: [], pagination: { total: 0, page: 1, limit: 9, pages: 0 } };
  } catch (error) {
    console.error('Error searching properties (SSR):', error);
    // ส่งค่า fallback data ในกรณีที่เกิดข้อผิดพลาด
    return { data: [], pagination: { total: 0, page: 1, limit: 9, pages: 0 } };
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล Zone ทั้งหมด
async function getAllZones() {
  try {
    const response = await serverApi.get('/zones', {
      headers: { 'x-api-key': 'dd-property-api-key-2025' }
    });

    if (response && response.data) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching zones (SSR):', error);
    return [];
  }
}

export async function generateMetadata({ params: { locale }, searchParams }) {
  const baseUrl = 'https://www.d-luckproperty.com';
  const localizedUrl = locale === 'th' ? baseUrl : `${baseUrl}/${locale}`;
  
  // ตรวจสอบ type parameter (sale/rent)
  const type = searchParams?.type || 'sale'; // default เป็น sale
  
  // SEO-optimized metadata สำหรับ Buy (Sale) และ Rent แยกตามภาษา
  const metadataByTypeAndLocale = {
    sale: {
      th: {
        title: 'ซื้ออสังหาฯ พัทยา: คอนโด บ้าน วิลล่า พูลวิลล่า | D-Luck Property',
        description: 'ต้องการซื้อคอนโด บ้าน วิลล่า พูลวิลล่า ในพัทยาและ EEC? D-Luck Property มีอสังหาริมทรัพย์คุณภาพสูงพร้อมผลตอบแทนการลงทุนสูง ผู้เชี่ยวชาญช่วยให้การซื้อราบรื่น',
        keywords: ['ซื้ออสังหาริมทรัพย์ พัทยา', 'ขายคอนโด พัทยา', 'ขายบ้าน พัทยา','ขายวิลล่า พัทยา','ขายพูลวิลล่า พัทย','อสังหาริมทรัพย์เพื่อการลงทุน พัทยา','ขายบ้าน พัทยา','ซื้อคอนโด พัทยา','ขายคอนโดหรู พัทยา','ขายบ้านเดี่ยว พัทยา','ขายวิลล่าติดทะเล พัทยา','ขายพูลวิลล่าส่วนตัว พัทยา','โครงการใหม่ พัทยา','บ้านพร้อมอยู่ พัทยา','ขั้นตอนการซื้ออสังหาริมทรัพย์ พัทยา','ชาวต่างชาติซื้อคอนโด พัทยา','กฎหมายครอบครองคอนโด ชาวต่างชาติ','อสังหาริมทรัพย์ ผลตอบแทนสูง พัทยา','ซื้อบ้านในพัทยาทำเลดี','คอนโดใกล้หาดจอมเทียน','วิลล่าแถวห้วยใหญ่','อสังหาริมทรัพย์ เขตเศรษฐกิจพิเศษภาคตะวันออก']
      },
      en: {
        title: 'Buy Property in Pattaya: Condos, Houses, Villas & Pool Villas',
        description: 'Looking to buy property in Pattaya? Explore premium condos, houses, villas & pool villas for sale. D-Luck Property guides you to your ideal home or high-return investment in Pattaya & EEC.',
        keywords: ['Buy property Pattaya', 'Pattaya property for sale', 'Pattaya condos for sale','Pattaya houses for sale','Pattaya villas for sale','Pattaya pool villas for sale','Property for sale Pattaya','Investment property Pattaya','Luxury condos Pattaya for sale','Beachfront villas Pattaya for sale','Family houses Pattaya for sale','New build condos Pattaya','New houses Pattaya','Off-plan properties Pattaya','Pattaya real estate investment opportunities','Buying process Pattaya property','Foreign ownership Pattaya condo','Pattaya homes for sale','Properties with high rental yield Pattaya','Property for sale in Jomtien','Property for sale in Pratumnak','East Pattaya houses for sale','Pool villas for sale near Jomtien']
      },
      zh: {
        title: '芭提雅房产购买: 公寓、房屋、别墅与泳池别墅 | D-Luck Property',
        description: '在芭提雅及EEC寻找理想房产？D-Luck Property 提供高品质公寓、房屋、别墅及泳池别墅，助您轻松实现高回报投资或安家梦想。',
        keywords: ['芭提雅房产购买', '芭提雅公寓出售','芭提雅房屋出售','芭提雅别墅出售','芭提雅泳池别墅出售','芭提雅投资房产','泰国芭提雅买房','芭提雅二手房','芭提雅海景公寓出售','芭提雅豪华别墅出售','芭提雅全新楼盘','芭提雅期房','外国人在芭提雅买房','芭提雅购房流程','芭提雅公寓投资回报','芭提雅EEC房产','芭提雅独栋房屋出售','芭提雅联排别墅出售','芭提雅海滨别墅','芭提雅带家具公寓','芭提雅优质地段别墅','芭提雅房产过户','芭提雅购房法律','芭提雅外国人公寓产权']
      },
      ru: {
        title: 'Купить недвижимость в Паттайе: Кондо, Дома, Виллы с бассейном',
        description: 'Ищете, где купить кондо, дом, виллу или виллу с бассейном в Паттайе и ЕЭС? D-Luck Property предлагает объекты с высоким инвестиционным потенциалом. Полное сопровождение покупки для россиян.',
        keywords: ['купить недвижимость Паттайя', 'купить кондо Паттайя','купить дом Паттайя','купить виллу Паттайя','купить виллу с бассейном Паттайя','недвижимость Паттайя продажа','инвестиции в недвижимость Паттайя ','недвижимость в Таиланде для россиян','как купить недвижимость в Паттайе','элитные кондо Паттайя','виллы у моря Паттайя','дома с приватным бассейном Паттайя','новые проекты кондо Паттайя','доходная недвижимость Паттайя','недвижимость Паттайя без посредников','квартиры в Паттайе купить','Паттайя ЕЭС недвижимость','купить дом в Джомтьене','купить кондо на Пратамнаке','юрист по недвижимости Паттайя','помощь в покупке недвижимости Паттайя','визы при покупке недвижимости Таиланд','гарантии инвестиций Паттайя']
      }
    },
    rent: {
      th: {
        title: 'เช่าคอนโด บ้าน วิลล่า พูลวิลล่า พัทยา | D-Luck Property',
        description: 'ค้นหาอสังหาฯ ให้เช่าในพัทยาและ EEC: คอนโด บ้าน วิลล่าหรู และพูลวิลล่าส่วนตัว ทั้งรายวัน รายเดือน รายปี พร้อมผู้เชี่ยวชาญช่วยให้การเช่าราบรื่น',
        keywords: ['เช่าคอนโด พัทยา','เช่าบ้าน พัทยา','เช่าวิลล่า พัทยา','เช่าพูลวิลล่า พัทยา','อสังหาริมทรัพย์ให้เช่า พัทย','เช่ารายเดือน พัทยา','เช่ารายวัน พัทยา','เช่าระยะยาว พัทยา','คอนโดให้เช่า พัทยากลาง','บ้านให้เช่า จอมเทียน','วิลล่าให้เช่า พัทยา พร้อมสระว่ายน้ำ','พูลวิลล่าส่วนตัว พัทยา','เช่าอพาร์ทเม้นท์ พัทยา','บ้านเช่าสำหรับครอบครัว พัทยา','คอนโดพร้อมเฟอร์นิเจอร์ พัทยา','ที่พักสำหรับชาวต่างชาติ พัทยา','กฎหมายเช่าบ้าน พัทยา','คอนโดใกล้หาดจอมเทียน ให้เช่า','บ้านเช่าพัทยา ราคาถูก','เช่าวิลล่าหรู พัทยา','อสังหาริมทรัพย์ให้เช่า EEC']
      },
      en: {
        title: 'Pattaya Property for Rent: Condos, Houses, Villas & Pool Villas',
        description: 'Find your ideal rental in Pattaya & EEC with D-Luck Property. Explore condos, houses, luxury villas & private pool villas for short-term or long-term lease. Expert help for a smooth rental.',
        keywords: ['Pattaya property for rent','Condo for rent Pattaya','House for rent Pattaya','Villa for rent Pattaya','Pool villa for rent Pattaya','Long-term rental Pattaya','Short-term rental Pattaya','Pattaya apartments for rent','Furnished condo for rent Pattaya','Pattaya villas with private pool','Monthly rental Pattaya','Expat rentals Pattaya','Digital nomad accommodation Pattaya','Affordable condo rent Pattaya','Luxury villa rental Pattaya','Jomtien condo for rent','Pratumnak villa rental','East Pattaya house for rent','Pattaya rental agency','Rent house long term Pattaya','Beachfront condo rental Pattaya','Rental property management Pattaya']
      },
      zh: {
        title: '芭提雅公寓、别墅、房屋租赁 | 短租长租 | D-Luck Property',
        description: '在芭提雅及EEC地区寻找理想的租赁房产？D-Luck Property 提供高品质公寓、房屋、别墅及私人泳池别墅的日租、月租、年租服务，助您轻松安家或度假。',
        keywords: ['芭提雅公寓出租','芭提雅别墅出租','芭提雅房屋出租','芭提雅泳池别墅出租','芭提雅短租','芭提雅长租','芭提雅租房','芭提雅日租公寓','芭提雅月租别墅','芭提雅海景公寓出租','芭提雅带家具公寓','外国人在芭提雅租房','芭提雅度假别墅租赁','中天海滩公寓出租','芭提雅私人泳池别墅','芭提雅两卧室公寓出租','芭提雅三卧室房屋出租','芭提雅数字游民住宿','芭提雅养老租房','芭提雅租房合同','芭提雅押金租金法律']
      },
      ru: {
        title: 'Аренда в Паттайе: Кондо, Дома, Виллы с бассейном | Длительно и Краткосрочно',
        description: 'Ищете кондо, дом, виллу или виллу с бассейном в Паттайе? D-Luck Property предлагает аренду для отдыха и длительного проживания. Экспертная помощь и русскоязычные менеджеры.',
        keywords: ['аренда недвижимости Паттайя','снять кондо Паттайя','снять дом Паттайя','снять виллу Паттайя','снять виллу с бассейном Паттайя','долгосрочная аренда Паттайя','краткосрочная аренда Паттайя','аренда жилья Паттайя','кондо Паттайя посуточно','дом с бассейном Паттайя аренда','апартаменты Паттайя аренда','снять жилье в Паттайе на месяц','аренда виллы в Паттайе для отдыха','недорогая аренда кондо Паттайя','аренда дома в Джомтьене','аренда кондо на Пратамнаке','Паттайя апартаменты для иностранцев','правила аренды в Таиланде для россиян','снять дом на длительный срок Паттайя','аренда виллы у моря Паттайя','жилье для цифровых кочевников Паттайя','аренда с мебелью Паттайя','аренда 3 спальни Паттайя']
      }
    }
  };

  // เลือก metadata ตาม type และ locale
  const currentMetadata = metadataByTypeAndLocale[type]?.[locale] || metadataByTypeAndLocale['sale']['th'];
  
  // สร้าง URL สำหรับ canonical และ alternates
  const queryString = new URLSearchParams(searchParams).toString();
  const currentUrl = queryString ? `${localizedUrl}/properties/list?${queryString}` : `${localizedUrl}/properties/list`;
  
  // สร้าง alternates สำหรับ SEO
  const languages = {};
  ['th', 'en', 'zh', 'ru'].forEach(lang => {
    const langUrl = lang === 'th' ? baseUrl : `${baseUrl}/${lang}`;
    languages[lang] = queryString ? `${langUrl}/properties/list?${queryString}` : `${langUrl}/properties/list`;
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
      siteName: currentMetadata.title,
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

// Loading component สำหรับแสดงระหว่างรอข้อมูล
function PropertyListingLoading() {
  return (
    <div className="property-listing-loading">
      <div className="loading-content">
        <div className="loading-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25"/>
            <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" className="spinner"/>
          </svg>
        </div>
      </div>
    </div>
  );
}


async function PropertyListContent({ searchParams }) {

  const searchResults = await searchProperties(searchParams);

  
  const zones = await getAllZones();
  
  return (
    <ListingPropertiesPage
      properties={searchResults.data || []}
      pagination={searchResults.pagination || {}}
      zones={zones || []}
      searchParams={searchParams || {}}
    />
  );
}

export default function PropertyListPage({ params, searchParams }) {
  return (
    <div className="main-wrapper">
      <Suspense fallback={<PropertyListingLoading />}>
       
        <PropertyListContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
