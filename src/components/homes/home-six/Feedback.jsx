"use client"
import { useState, useEffect } from "react"
import Image from "next/image";
import Slider from "react-slick";
import { useParams } from "next/navigation"

const setting = {
   dots: true,
   arrows: false,
   centerPadding: '0px',
   slidesToShow: 1,
   slidesToScroll: 1,
   fade: true,
   autoplay: true,
   autoplaySpeed: 300000
}

const qouteIcon = "/images/icon/icon_38.svg"
const ShapeIcon = "/images/shape/shape_62.svg"

const Feedback = () => {
   const [feedbackData, setFeedbackData] = useState([])
   const params = useParams()
   const locale = params?.locale || 'th'

   useEffect(() => {
      fetchFeedbackData()
   }, [])

   const fetchFeedbackData = async () => {
      try {
         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
         const response = await fetch(`${backendUrl}/api/ui-strings/public/section/feedback`)
         const result = await response.json()
         
         if (result.success && result.data) {
            setFeedbackData(result.data)
         }
      } catch (error) {
         console.error('Error fetching feedback data:', error)
      }
   }

   const getLocalizedText = (slug) => {
      const item = feedbackData.find(item => item.slug === slug)
      if (!item) return ''
      
      const localeMap = { 'th': 'th', 'en': 'en', 'zh': 'zhCN', 'ru': 'ru' }
      const lang = localeMap[locale] || 'th'
      return item[lang] || item.th || ''
   }

   const feedback_items = [
      {
         id: 1,
         text: getLocalizedText('feedback_1_text'),
         name: getLocalizedText('feedback_1_name'),
         img: getLocalizedText('feedback_1_image'),
      },
      {
         id: 2,
         text: getLocalizedText('feedback_2_text'),
         name: getLocalizedText('feedback_2_name'),
         img: getLocalizedText('feedback_2_image'),
      },
   ]

   return (
      <div className="feedback-section-seven mt-170 xl-mt-120 md-mt-80"
      style={{
         backgroundColor: "#eeeeee !important"
      }}
      >
         <div className="container container-large">
            <div className="position-relative z-1">
               <div className="row">
                  <div className="col-lg-5">
                     <div className="title-one mt-30 md-mb-50 pe-xxl-4 wow fadeInLeft">
                        <div className="upper-title">{getLocalizedText('feedback_upper_title')}</div>
                        <h3>{getLocalizedText('feedback_heading')}</h3>
                        <p className="fs-18 mt-20">{getLocalizedText('feedback_description')}</p>
                     </div>
                  </div>
                  <div className="col-lg-7">
                     <div className="content-wrapper position-relative z-1 ms-xxl-3">
                       
                        <Slider {...setting} className="feedback-slider-one">
                           {feedback_items.map((item) => (
                              <div key={item.id} className="item">
                                 <div className="feedback-block-five" style={{ minHeight: '280px' }}>
                                    <blockquote style={{ fontSize: '15px', lineHeight: '1.6' }}>{item.text}</blockquote>
                                    <div className="d-flex align-items-center justify-content-end ct-info">
                                       <img src={item.img} alt={item.name} width={50} height={50} className="rounded-circle avatar" />
                                       <div className="ps-3">
                                          <h6 className="fs-18 m0">{item.name}</h6>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </Slider>
                     </div>
                  </div>
               </div>
              
            </div>
         </div>
      </div>
   )
}

export default Feedback
