'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

const AboutUsContent = () => {
   const [aboutData, setAboutData] = useState([])
   const [loading, setLoading] = useState(true)
   const params = useParams()
   const locale = params?.locale || 'th'

   useEffect(() => {
      fetchAboutData()
   }, [])

   const fetchAboutData = async () => {
      try {
         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
         console.log('Fetching from:', `${backendUrl}/api/aboutus`)
         const response = await fetch(`${backendUrl}/api/aboutus`)
         const data = await response.json()
         console.log('About data received:', data)
         setAboutData(data)
         setLoading(false)
      } catch (error) {
         console.error('Error fetching about data:', error)
         setLoading(false)
      }
   }

   const getLocalizedText = (item, field) => {
      const localeMap = {
         'th': 'th',
         'en': 'en',
         'zh': 'zh',
         'ru': 'ru'
      }
      const lang = localeMap[locale] || 'th'
      return item[`${field}_${lang}`] || item[`${field}_th`]
   }

   if (loading) {
      return <div className="text-center py-5">Loading...</div>
   }

   const whoWeAre = aboutData.find(item => item.section === 'who_we_are')
   const ourGoal = aboutData.find(item => item.section === 'our_goal')
   const ourVision = aboutData.find(item => item.section === 'our_vision')
   
   console.log('Current locale:', locale)
   console.log('Who we are:', whoWeAre)
   console.log('Our goal:', ourGoal)
   console.log('Our vision:', ourVision)

   return (
      <div className="block-feature-fifteen mt-150 xl-mt-100 mb-140 xl-mb-80">
         <div className="container">
            <div className="row gx-xl-5">
               <div className="col-xl-6 col-lg-7 order-lg-last wow fadeInRight">
                  <div className="ms-xxl-5 ps-xl-4 ps-lg-5 md-mb-50">
                  
                     
                     <div className="accordion accordion-style-one" id="accordionAbout">
                        {whoWeAre && (
                           <div className="accordion-item">
                              <h2 className="accordion-header">
                                 <button className="accordion-button" type="button" data-bs-toggle="collapse" 
                                    data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    {getLocalizedText(whoWeAre, 'title')}
                                 </button>
                              </h2>
                              <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionAbout">
                                 <div className="accordion-body">
                                    <p>{getLocalizedText(whoWeAre, 'content')}</p>
                                 </div>
                              </div>
                           </div>
                        )}
                        
                        {ourGoal && (
                           <div className="accordion-item">
                              <h2 className="accordion-header">
                                 <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                    data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    {getLocalizedText(ourGoal, 'title')}
                                 </button>
                              </h2>
                              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionAbout">
                                 <div className="accordion-body">
                                    <p>{getLocalizedText(ourGoal, 'content')}</p>
                                 </div>
                              </div>
                           </div>
                        )}

                        {ourVision && (
                           <div className="accordion-item">
                              <h2 className="accordion-header">
                                 <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                    data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    {getLocalizedText(ourVision, 'title')}
                                 </button>
                              </h2>
                              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionAbout">
                                 <div className="accordion-body">
                                    <p>{getLocalizedText(ourVision, 'content')}</p>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>

                     <Link href="/contact" className="btn-two mt-50 md-mt-30">
                        {locale === 'th' && 'ติดต่อเรา'}
                        {locale === 'en' && 'Contact Us'}
                        {locale === 'zh' && '联系我们'}
                        {locale === 'ru' && 'Связаться с нами'}
                     </Link>
                  </div>
               </div>
               
               <div className="col-xl-6 col-lg-5 d-lg-flex wow fadeInLeft">
                  <div className="media-block h-100 w-100 pe-xl-5">
                     <div className="bg-img position-relative" style={{ backgroundImage: `url(/assets/images/aboutus/get to know -photo.png)` }}>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AboutUsContent
