'use client'

import { useState, useEffect } from "react"
import FaqThree from "@/components/common/faq/FaqThree"
import Image from "next/image"
import Link from "next/link"
import Count from "@/components/common/Count"
import FeedbackHomeFive from "@/components/homes/home-five/Feedback"
import { useParams } from "next/navigation"


const titleShape = "/assets/images/shape/shape_37.svg"
const featureImg = "/assets/images/assets/screen_10.png"

const BLockFeatureOne = () => {
   const [aboutData, setAboutData] = useState([])
   const [openAccordion, setOpenAccordion] = useState('collapseOne')
   const params = useParams()
   const locale = params?.locale || 'th'

   useEffect(() => {
      fetchAboutData()
   }, [])

   const toggleAccordion = (id) => {
      setOpenAccordion(openAccordion === id ? '' : id)
   }

   const fetchAboutData = async () => {
      try {
         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
         const response = await fetch(`${backendUrl}/api/ui-strings/public/section/about`)
         const result = await response.json()
         
         console.log("DataAbout", result);
         
         if (result.success && result.data) {
            setAboutData(result.data)
         }
      } catch (error) {
         console.error('Error fetching about data:', error)
      }
   }

   const getLocalizedText = (slug) => {
      const item = aboutData.find(item => item.slug === slug)
      console.log(`Looking for slug: ${slug}, found:`, item)
      
      if (!item) {
         console.log(`Slug ${slug} not found in aboutData:`, aboutData)
         return ''
      }
      
      const localeMap = { 'th': 'th', 'en': 'en', 'zh': 'zhCN', 'ru': 'ru' }
      const lang = localeMap[locale] || 'th'
      const text = item[lang] || item.th || ''
      console.log(`Returning text for ${slug} in ${lang}:`, text)
      return text
   }

   return (
      <div className="block-feature-fifteen mt-150 xl-mt-100 mb-140 xl-mb-80">
         <div className="container">
            <div className="row gx-xl-5">
               <div className="col-xl-6 col-lg-7 order-lg-last wow fadeInRight">
                  <div className="ms-xxl-5 ps-xl-4 ps-lg-5 md-mb-50">
                     <div className="title-one mb-45 lg-mb-20">
                        <h2 className="font-garamond star-shape">
                           About <span className="text-danger">12 Real Estate Pattaya</span>
                        </h2>
                     </div>
                     <div className="accordion-style-three">
                        <div className="accordion" id="accordionThree">
                           <div className="accordion-item">
                              <h2 className="accordion-header">
                                 <button 
                                    className={`accordion-button ${openAccordion !== 'collapseOne' ? 'collapsed' : ''}`}
                                    type="button" 
                                    onClick={() => toggleAccordion('collapseOne')}
                                    aria-expanded={openAccordion === 'collapseOne'}>
                                    {getLocalizedText('who_we_are_title')}
                                 </button>
                              </h2>
                              <div className={`accordion-collapse collapse ${openAccordion === 'collapseOne' ? 'show' : ''}`}>
                                 <div className="accordion-body">
                                    <p>{getLocalizedText('who_we_are_content')}</p>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="accordion-item">
                              <h2 className="accordion-header">
                                 <button 
                                    className={`accordion-button ${openAccordion !== 'collapseTwo' ? 'collapsed' : ''}`}
                                    type="button" 
                                    onClick={() => toggleAccordion('collapseTwo')}
                                    aria-expanded={openAccordion === 'collapseTwo'}>
                                    {getLocalizedText('our_goal_title')}
                                 </button>
                              </h2>
                              <div className={`accordion-collapse collapse ${openAccordion === 'collapseTwo' ? 'show' : ''}`}>
                                 <div className="accordion-body">
                                    <p>{getLocalizedText('our_goal_content')}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="accordion-item">
                              <h2 className="accordion-header">
                                 <button 
                                    className={`accordion-button ${openAccordion !== 'collapseThree' ? 'collapsed' : ''}`}
                                    type="button" 
                                    onClick={() => toggleAccordion('collapseThree')}
                                    aria-expanded={openAccordion === 'collapseThree'}>
                                    {getLocalizedText('our_vision_title')}
                                 </button>
                              </h2>
                              <div className={`accordion-collapse collapse ${openAccordion === 'collapseThree' ? 'show' : ''}`}>
                                 <div className="accordion-body">
                                    <p>{getLocalizedText('our_vision_content')}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <Link href="/contact" className="btn-five mt-75 lg-mt-50">
                        {getLocalizedText('contact_us_button')}
                     </Link>
                  </div>
               </div>
               <div className="col-xl-6 col-lg-5 d-lg-flex wow fadeInLeft">
                  <div className="media-block h-100 w-100 pe-xl-5">
                     <div className="bg-img position-relative" style={{ backgroundImage: `url(/assets/images/aboutus/title.png)` }}>
                    
                     </div>
                  </div>
               </div>
            </div>

            <div className="wrapper mt-90 lg-mt-40">
               <div className="row justify-content-center">
                  <div className="col-md-4 col-sm-6">
                     <div className="counter-block-two text-center dark mt-30">
                        <div className="main-count sm font-garamond fw-500">
                           {getLocalizedText('counter_properties_number')}
                        </div>
                        <p className="fs-20 mt-15 md-mt-10">
                           {getLocalizedText('counter_properties_label')}
                        </p>
                     </div>
                  </div>
                  <div className="col-md-4 col-sm-6">
                     <div className="counter-block-two text-center dark mt-30">
                        <div className="main-count sm font-garamond fw-500">
                           {getLocalizedText('counter_foreign_number')}
                        </div>
                        <p className="fs-20 mt-15 md-mt-10">
                           {getLocalizedText('counter_foreign_label')}
                        </p>
                     </div>
                  </div>
                  <div className="col-md-4 col-sm-6">
                     <div className="counter-block-two text-center dark mt-30">
                        <div className="main-count sm font-garamond fw-500">
                           {getLocalizedText('counter_satisfaction_number')}
                        </div>
                        <p className="fs-20 mt-15 md-mt-10">
                           {getLocalizedText('counter_satisfaction_label')}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
         {/* Client Feedback Section */}
         <FeedbackHomeFive style={true} />
      </div>
   )
}

export default BLockFeatureOne
