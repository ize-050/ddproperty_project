"use client"
import { useState, useEffect } from "react"
import Image from "next/image";
import { Rating } from 'react-simple-star-rating';
import Slider from "react-slick";
import { useParams } from "next/navigation"

const feedbackShape_1 = "/images/shape/shape_55.svg"
const feedbackShape_2 = "/images/shape/shape_56.svg"
const quoteIcon = "/images/icon/icon_05.svg"

const setting = {
   dots: true,
   arrows: false,
   centerPadding: '0px',
   slidesToShow: 2,
   slidesToScroll: 1,
   centerMode: true,
   autoplay: true,
   autoplaySpeed: 3000,
   responsive: [
      {
         breakpoint: 992,
         settings: {
            slidesToShow: 1
         }
      },
      {
         breakpoint: 575,
         settings: {
            slidesToShow: 1
         }
      }
   ]
}

const Feedback = ({ style }) => {
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
         desc: getLocalizedText('feedback_1_text'),
         title: getLocalizedText('feedback_1_name'),
         thumb: getLocalizedText('feedback_1_image'),
      },
      {
         id: 2,
         desc: getLocalizedText('feedback_2_text'),
         title: getLocalizedText('feedback_2_name'),
         thumb: getLocalizedText('feedback_2_image'),
      },
   ]

   return (
      <div className={`feedback-section-six bg-pink-two position-relative z-1 pt-110 xl-pt-80 pb-100 xl-pb-80 ${style ? "" : "mt-170 xl-mt-120"}`}>
         <div className={`container ${style ? "" : "container-large"}`}>
            <div className="title-one text-center mb-80 xl-mb-50 md-mb-30">
               <h3>{getLocalizedText('feedback_title')}</h3>
               <p className="fs-20 mt-xs">{getLocalizedText('feedback_description')}</p>
            </div>
            <Slider {...setting} className="feedback-slider-three">
               {feedback_items.map((item) => (
                  <div key={item.id} className="item">
                     <div className={`feedback-block-six ${style ? "rounded-4" : ""}`} style={{ minHeight: '280px' }}>
                        <div className="d-flex justify-content-between align-items-center">
                           <ul className="rating style-none d-flex">
                              <li><Rating initialValue={5} size={20} readonly={true} /></li>
                           </ul>
                        
                        </div>
                        <blockquote style={{ fontSize: '15px', lineHeight: '1.6' }}>{item.desc}</blockquote>
                        <div className="d-flex align-items-center justify-content-between">
                           <h6 className="fs-18 m0">{item.title}</h6>
                           <img src={item.thumb} alt={item.title} width={50} height={50} className="rounded-circle avatar" />
                        </div>
                     </div>
                  </div>
               ))}
            </Slider>
            {!style && (
               <>
                  <img src={feedbackShape_1} alt="" className="lazy-img shapes shape_01" />
                  <img src={feedbackShape_2} alt="" className="lazy-img shapes shape_02" />
               </>
            )}
         </div>
      </div>
   )
}

export default Feedback
