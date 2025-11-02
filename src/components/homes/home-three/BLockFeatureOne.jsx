"use client"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import Image from "next/image"
import Link from "next/link"

const BLockFeatureOne = () => {
   const locale = useLocale()
   const [features, setFeatures] = useState([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const fetchFeatures = async () => {
         try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ui-strings/public/section/home`)
            
            if (!response.ok) {
               throw new Error(`API Error: ${response.status}`)
            }
            
            const result = await response.json()
            console.log('API Response:', result)
            
            // API returns { success: true, data: [ { slug, en, th, zhCN, ru }, ... ] }
            const dataArray = result.success ? result.data : result
            console.log('Translation Data (Array):', dataArray)
            console.log('Is Array?', Array.isArray(dataArray))
            console.log('Array length:', dataArray?.length)
            
            // Filter only features_* slugs
            const featuresArray = Array.isArray(dataArray) 
               ? dataArray.filter(item => item.slug && item.slug.startsWith('features_'))
               : []
            console.log('Features Array:', featuresArray)
            
            // Convert array to object with slug as key
            const data = {}
            featuresArray.forEach(item => {
               data[item.slug] = item
            })
            console.log('Converted Data:', data)
            console.log('Keys:', Object.keys(data))
            
            // Map locale to database column name
            const localeMap = {
               'en': 'en',
               'th': 'th',
               'zh': 'zhCN',
               'ru': 'ru'
            }
            const dbLocale = localeMap[locale] || 'en'
            console.log('Current Locale:', locale, '-> DB Locale:', dbLocale)
            
            // Group by feature type (buy, rent, sell)
            console.log('Looking for features_buy_title:', data['features_buy_title'])
            console.log('Value for locale:', data['features_buy_title']?.[dbLocale])
            
            const groupedFeatures = [
               {
                  id: 1,
                  type: 'buy',
                  icon: '/assets/images/icon_new/home.svg',
                  title: data['features_buy_title']?.[dbLocale] || 'BUY A HOUSE',
                  desc: data['features_buy_description']?.[dbLocale] || 'Explore homes',
                  btn: data['features_buy_button']?.[dbLocale] || 'Buy A House',
               },
               {
                  id: 2,
                  type: 'rent',
                  icon: '/assets/images/icon_new/rent.svg',
                  title: data['features_rent_title']?.[dbLocale] || 'RENT A HOME',
                  desc: data['features_rent_description']?.[dbLocale] || 'Explore homes',
                  btn: data['features_rent_button']?.[dbLocale] || 'Rent A House',
                  data_delay_time: '0.1s'
               },
               {
                  id: 3,
                  type: 'sell',
                  icon: '/assets/images/icon_new/sell.svg',
                  title: data['features_sell_title']?.[dbLocale] || 'SELL PROPERTY',
                  desc: data['features_sell_description']?.[dbLocale] || 'Explore homes',
                  btn: data['features_sell_button']?.[dbLocale] || 'Sell Property',
                  data_delay_time: '0.2s'
               }
            ]
            
            console.log('Grouped Features:', groupedFeatures)
            setFeatures(groupedFeatures)
            setLoading(false)
         } catch (error) {
            console.error('Error fetching features:', error)
            // Set fallback data if API fails
            setFeatures([
               {
                  id: 1,
                  type: 'buy',
                  icon: '/assets/images/icon_new/home.svg',
                  title: 'BUY A HOUSE',
                  desc: 'Explore homy\'s 2 million+ homes and uncover your ideal living space.',
                  btn: 'Buy A House',
               },
               {
                  id: 2,
                  type: 'rent',
                  icon: '/assets/images/icon_new/rent.svg',
                  title: 'RENT A HOME',
                  desc: 'Explore homy\'s 2 million+ homes and uncover your ideal living space.',
                  btn: 'Buy A House',
                  data_delay_time: '0.1s'
               },
               {
                  id: 3,
                  type: 'sell',
                  icon: '/assets/images/icon_new/sell.svg',
                  title: 'SELL PROPERTY',
                  desc: 'Explore homy\'s 2 million+ homes and uncover your ideal living space.',
                  btn: 'Buy A House',
                  data_delay_time: '0.2s'
               }
            ])
            setLoading(false)
         }
      }

      fetchFeatures()
   }, [locale])

   if (loading) {
      return <div className="text-center py-5">Loading...</div>
   }

   return (
      <div className="block-feature-seven position-relative z-1 mt-0 xl-mt-100">
         <div className="container container-large">
            <div className="position-relative">
               <div className="row justify-content-center">
                  {features.map((item) => (
                     <div key={item.id} className="col-lg-4 col-md-6 mt-30 d-flex wow fadeInUp" data-wow-delay={item.data_delay_time}>
                        <div className="card-style-five text-center d-inline-flex flex-column align-items-center tran3s h-100 w-100">
                           <img src={item.icon} alt={item.title} className="lazy-img icon" />
                           <h5 className="mt-35 mb-20">{item.title}</h5>
                           <p className="fs-22 mb-50">{item.desc}</p>
                           <Link href="/properties/list" className="btn-twelve mt-auto">{item.btn}</Link>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   )
}

export default BLockFeatureOne
