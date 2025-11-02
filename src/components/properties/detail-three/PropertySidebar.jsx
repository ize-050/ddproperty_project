'use client'

import { useState } from 'react'
import Image from 'next/image'

const PropertySidebar = ({ property, locale }) => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      message: ''
   })
   const [loading, setLoading] = useState(false)

   const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      
      try {
         // TODO: Send contact form to API
         console.log('Form submitted:', formData)
         alert(locale === 'th' ? 'ส่งข้อความเรียบร้อยแล้ว' : 'Message sent successfully')
         setFormData({ name: '', email: '', phone: '', message: '' })
      } catch (error) {
         console.error('Error sending message:', error)
         alert(locale === 'th' ? 'เกิดข้อผิดพลาด' : 'Error sending message')
      } finally {
         setLoading(false)
      }
   }

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      })
   }

   return (
      <div className="col-xl-4">
         <div className="theme-sidebar-one ms-xl-5 lg-mt-80">
            {/* Agent Card */}
            <div className="agent-info bg-white shadow4 border-20 p-30 mb-40">
               <div className="d-flex align-items-center">
                  <Image
                     src={property?.agent?.avatar || '/assets/images/team/img_01.jpg'}
                     alt="Agent"
                     width={80}
                     height={80}
                     className="rounded-circle"
                  />
                  <div className="ms-3">
                     <h6 className="name">{property?.agent?.name || 'Agent Name'}</h6>
                     <div className="fs-16 opacity-75">
                        {property?.agent?.position || 'Property Agent'}
                     </div>
                  </div>
               </div>
               
               <div className="divider-line mt-30 mb-30"></div>
               
               <ul className="style-none">
                  {property?.agent?.phone && (
                     <li className="d-flex align-items-center mb-15">
                        <i className="fa-light fa-phone me-3"></i>
                        <a href={`tel:${property.agent.phone}`}>{property.agent.phone}</a>
                     </li>
                  )}
                  {property?.agent?.email && (
                     <li className="d-flex align-items-center">
                        <i className="fa-light fa-envelope me-3"></i>
                        <a href={`mailto:${property.agent.email}`}>{property.agent.email}</a>
                     </li>
                  )}
               </ul>
            </div>

            {/* Contact Form */}
            <div className="contact-form bg-white shadow4 border-20 p-30">
               <h5 className="mb-30">
                  {locale === 'th' ? 'ติดต่อสอบถาม' : 'Contact Agent'}
               </h5>
               
               <form onSubmit={handleSubmit}>
                  <div className="input-group mb-20">
                     <input
                        type="text"
                        name="name"
                        placeholder={locale === 'th' ? 'ชื่อของคุณ' : 'Your Name'}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                     />
                  </div>
                  
                  <div className="input-group mb-20">
                     <input
                        type="email"
                        name="email"
                        placeholder={locale === 'th' ? 'อีเมล' : 'Email'}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-control"
                     />
                  </div>
                  
                  <div className="input-group mb-20">
                     <input
                        type="tel"
                        name="phone"
                        placeholder={locale === 'th' ? 'เบอร์โทรศัพท์' : 'Phone'}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="form-control"
                     />
                  </div>
                  
                  <div className="input-group mb-30">
                     <textarea
                        name="message"
                        placeholder={locale === 'th' ? 'ข้อความ' : 'Message'}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="form-control"
                     ></textarea>
                  </div>
                  
                  <button 
                     type="submit" 
                     className="btn-two w-100"
                     disabled={loading}
                  >
                     {loading 
                        ? (locale === 'th' ? 'กำลังส่ง...' : 'Sending...') 
                        : (locale === 'th' ? 'ส่งข้อความ' : 'Send Message')
                     }
                  </button>
               </form>
            </div>
         </div>
      </div>
   )
}

export default PropertySidebar
