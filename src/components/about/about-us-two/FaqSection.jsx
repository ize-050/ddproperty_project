"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

const FaqSection = () => {
   const [faqData, setFaqData] = useState([])
   const [openAccordion, setOpenAccordion] = useState('collapse3')
   const params = useParams()
   const locale = params?.locale || 'th'

   useEffect(() => {
      fetchFaqData()
   }, [])

   const toggleAccordion = (id) => {
      setOpenAccordion(openAccordion === id ? '' : id)
   }

   const fetchFaqData = async () => {
      try {
         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
         const response = await fetch(`${backendUrl}/api/ui-strings/public/section/faq`)
         const result = await response.json()
         
         if (result.success && result.data) {
            setFaqData(result.data)
         }
      } catch (error) {
         console.error('Error fetching faq data:', error)
      }
   }

   const getLocalizedText = (slug) => {
      const item = faqData.find(item => item.slug === slug)
      if (!item) return ''
      
      const localeMap = { 'th': 'th', 'en': 'en', 'zh': 'zhCN', 'ru': 'ru' }
      const lang = localeMap[locale] || 'th'
      return item[lang] || item.th || ''
   }

   const faq_categories = [
      {
         id: 1,
         id_name: "Selling",
         title: getLocalizedText('faq_category_1'),
         md_pt: false,
         faq: [
            { id: 1, question: getLocalizedText('faq_q1_selling'), answer: getLocalizedText('faq_a1_selling') },
            { id: 2, question: getLocalizedText('faq_q2_selling'), answer: getLocalizedText('faq_a2_selling') },
            { id: 3, question: getLocalizedText('faq_q3_selling'), answer: getLocalizedText('faq_a3_selling') },
         ]
      },
      {
         id: 2,
         id_name: "Renting",
         title: getLocalizedText('faq_category_2'),
         md_pt: true,
         faq: [
            { id: 4, question: getLocalizedText('faq_q1_renting'), answer: getLocalizedText('faq_a1_renting') },
            { id: 5, question: getLocalizedText('faq_q2_renting'), answer: getLocalizedText('faq_a2_renting') },
         ]
      },
   ]

   return (
      <div className="faq-section-two mt-130 xl-mt-100 mb-150 xl-mb-100">
         <div className="container">
            <div className="title-one text-center mb-80 xl-mb-50 md-mb-30">
               <h3>{getLocalizedText('faq_title')}</h3>
               <p className="fs-20 mt-xs">{getLocalizedText('faq_subtitle')}</p>
            </div>
            
            <div className="row">
               <div className="col-lg-4 wow fadeInLeft">
                  <div className="faq-sidebar">
                     <div className="bg-wrapper">
                        <ul className="style-none">
                           <li><Link href="#Selling">1. <span>{getLocalizedText('faq_category_1')}</span></Link></li>
                           <li><Link href="#Renting">2. <span>{getLocalizedText('faq_category_2')}</span></Link></li>
                        </ul>
                     </div>
                     <div className="bg-wrapper text-center mt-35">
                        <h4 className="mb-35">{getLocalizedText('faq_sidebar_title')}</h4>
                        <Link href="/contact" className="btn-five">{getLocalizedText('faq_contact_button')}</Link>
                     </div>
                  </div>
               </div>

               <div className="col-lg-8">
                  {faq_categories.map((item) => (
                     <div key={item.id} className="accordion-style-two no-bg p0 ms-xl-5">
                        <div className={`accordion-title text-uppercase fw-500 ${item.md_pt ? "md-pt-90" : "pt-90"}`} id={item.id_name}>{item.title}</div>
                        <div className="accordion p0" id={`accordion${item.id}`}>
                           {item.faq.map((faq, index) => {
                              const collapseId = `collapse${faq.id}`
                              const isOpen = openAccordion === collapseId
                              
                              return (
                                 <div key={index} className={`accordion-item ${isOpen ? "active" : ""}`}>
                                    <h2 className="accordion-header">
                                       <button 
                                          className={`accordion-button ${!isOpen ? "collapsed" : ""}`} 
                                          type="button"
                                          onClick={() => toggleAccordion(collapseId)}
                                          aria-expanded={isOpen}
                                          aria-controls={collapseId}
                                       >
                                          {faq.question}
                                       </button>
                                    </h2>
                                    <div 
                                       id={collapseId} 
                                       className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                                       data-bs-parent={`#accordion${item.id}`}
                                    >
                                       <div className="accordion-body">
                                          <p>{faq.answer}</p>
                                       </div>
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   )
}

export default FaqSection
