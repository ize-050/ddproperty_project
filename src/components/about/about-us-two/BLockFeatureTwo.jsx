'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

const featureShape_3 = '/assets/images/shape/shape_37.svg';
const icon1 = '/assets/images/icon/icon_40.svg';
const icon2 = '/assets/images/icon/icon_41.svg';
const icon3 = '/assets/images/icon/icon_42.svg';


const BLockFeatureTwo = () => {
   const [servicesData, setServicesData] = useState([])
   const params = useParams()
   const locale = params?.locale || 'th'

   useEffect(() => {
      fetchServicesData()
   }, [])

   const fetchServicesData = async () => {
      try {
         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
         const response = await fetch(`${backendUrl}/api/ui-strings/public/section/services`)
         const result = await response.json()
         
         if (result.success && result.data) {
            setServicesData(result.data)
         }
      } catch (error) {
         console.error('Error fetching services data:', error)
      }
   }

   const getLocalizedText = (slug) => {
      const item = servicesData.find(item => item.slug === slug)
      if (!item) return ''
      
      const localeMap = { 'th': 'th', 'en': 'en', 'zh': 'zhCN', 'ru': 'ru' }
      const lang = localeMap[locale] || 'th'
      return item[lang] || item.th || ''
   }

   const services = [
      { id: 1, icon: icon1, title: getLocalizedText('service_1_title'), desc: getLocalizedText('service_1_description') },
      { id: 2, icon: icon2, title: getLocalizedText('service_2_title'), desc: getLocalizedText('service_2_description') },
      { id: 3, icon: icon3, title: getLocalizedText('service_3_title'), desc: getLocalizedText('service_3_description') },
   ]

   return (
      <div className="">
         <div className="block-feature-fourteen pt-150 xl-pt-120 lg-pt-100 pb-150 xl-pb-120 lg-pb-80">
            <div className="container">
               <div className="row">
                  <div className="col-lg-6">
                     <div className="title-one md-mb-30 pe-xxl-4 wow fadeInLeft">
                        <h2 className="font-garamond text-white star-shape">{getLocalizedText('services_title')} <span className="star-shape"><img src={featureShape_3} alt="" className="lazy-img" /></span></h2>
                     </div>
                  </div>
                  <div className="col-xxl-5 col-lg-6 ms-auto">
                     <p className="text-white fs-24 m0 lh-lg  wow fadeInRight">{getLocalizedText('services_subtitle')}</p>
                  </div>
               </div>

               <div className="wow fadeInUp mt-70 xl-mt-50">
                  <div className="row">
                     {services.map((item) => (
                        <div key={item.id} className="col-lg-4">
                           <div className="card-style-eight mt-45 wow fadeInUp">
                              <div className="d-flex align-items-start pe-xxl-5">
                                 <img src={item.icon} alt={item.title} className="lazy-img icon" />
                                 <div className="text">
                                    <h5 className="text-white">{item.title}</h5>
                                    <p>{item.desc}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default BLockFeatureTwo
