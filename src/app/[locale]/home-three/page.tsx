import HomeThree from "../../../components/homes/home-three"
import Wrapper from "../../../layouts/Wrapper"
import serverApi from '@/utils/serverApi'
import LanguageApi from '@/utils/languageApi'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export const metadata = {
  title: "Home Three - D-Luck Property",
}

// ฟังก์ชันสำหรับดึงข้อมูล properties แบบสุ่มจาก API (Server-Side)
async function getRandomProperties() {
  try {
    const response = await serverApi.get('/properties/random', {
      params: { count: 6 },
      headers: { 'x-api-key': 'dd-property-api-key-2025' }
    })
    
    if (response && response.data) {
      return Array.isArray(response.data) ? response.data : (response.data.data || [])
    }
    return []
  } catch (error) {
    console.error('Error fetching random properties:', error)
    return []
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล translations
async function getLanguage(section = 'home') {
  try {
    const response = await LanguageApi.getUiStringsBySection(section, {
      serverSide: true,
      next: { revalidate: 3600 }
    })

    if (!response.success) {
      console.error(`Failed to fetch ${section} translations`)
      return {}
    }

    const translations = response.data.reduce((acc, item) => {
      acc[item.slug] = {
        en: item.en,
        th: item.th,
        zhCN: item.zhCN,
        ru: item.ru
      }
      return acc
    }, {})

    return translations
  } catch (error) {
    console.error(`Error fetching ${section} translations:`, error)
    return {}
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล zones
async function getAllZones() {
  try {
    const response = await serverApi.get('/zones', {
      headers: { 'x-api-key': 'dd-property-api-key-2025' }
    })
    
    if (response && response.data) {
      return response.data
    }
    return []
  } catch (error) {
    console.error('Error fetching zones:', error)
    return []
  }
}

const index = async ({ params }) => {
  const locale = params?.locale || 'en'

  // ดึงข้อมูลทั้งหมดพร้อม error handling
  let randomProperties = []
  let homeTranslations = {}
  let zones = []

  try {
    randomProperties = await getRandomProperties()
  } catch (error) {
    console.error('Failed to fetch random properties:', error)
  }

  try {
    homeTranslations = await getLanguage('home')
  } catch (error) {
    console.error('Failed to fetch home translations:', error)
  }

  try {
    zones = await getAllZones()
    console.log('Home Three - Zones fetched:', zones?.length || 0, 'zones')
  } catch (error) {
    console.error('Failed to fetch zones:', error)
  }

  return (
    <Wrapper>
      <HomeThree 
        locale={locale} 
        randomProperties={randomProperties}
        homeTranslations={homeTranslations}
        zones={zones}
      />
    </Wrapper>
  )
}

export default index