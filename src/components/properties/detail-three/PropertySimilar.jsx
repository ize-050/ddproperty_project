'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const PropertySimilar = ({ property, locale }) => {
   const [similarProperties, setSimilarProperties] = useState([])

   useEffect(() => {
      // TODO: Fetch similar properties from API
      // For now, using empty array
      setSimilarProperties([])
   }, [property])

   if (similarProperties.length === 0) return null

   const formatPrice = (price, currency = 'THB') => {
      if (!price) return 'Contact for price'
      const formatted = new Intl.NumberFormat('en-US').format(price)
      return `${currency} ${formatted}`
   }

   return (
      <div className="similar-property mb-50">
         <div className="bg-white shadow4 border-20 p-40">
            <h4 className="mb-40">
               {locale === 'th' ? 'ทรัพย์สินที่คล้ายกัน' : 'Similar Properties'}
            </h4>
            
            <div className="row">
               {similarProperties.map((item, index) => (
                  <div key={index} className="col-md-6 mb-30">
                     <div className="listing-card-one border-20 overflow-hidden">
                        <div className="img-gallery position-relative">
                           <div className="position-relative" style={{ height: '250px' }}>
                              <Image
                                 src={item.mainImage || '/assets/images/listing/img_01.jpg'}
                                 alt={item.title}
                                 fill
                                 style={{ objectFit: 'cover' }}
                              />
                           </div>
                           <Link 
                              href={`/${locale}/property-detail-three/${item.id}`}
                              className="btn-four rounded-circle position-absolute"
                           >
                              <i className="bi bi-arrow-up-right"></i>
                           </Link>
                        </div>
                        <div className="property-info p-25">
                           <Link 
                              href={`/${locale}/property-detail-three/${item.id}`}
                              className="title tran3s"
                           >
                              {item.title}
                           </Link>
                           <div className="address">{item.address}</div>
                           <div className="price fw-500 color-dark mt-10">
                              {formatPrice(item.price, item.currency)}
                           </div>
                           <ul className="style-none d-flex align-items-center justify-content-between mt-15">
                              <li><i className="fa-light fa-bed-front me-2"></i>{item.bedrooms} Bed</li>
                              <li><i className="fa-light fa-bath me-2"></i>{item.bathrooms} Bath</li>
                              <li><i className="fa-light fa-ruler-combined me-2"></i>{item.area} sqm</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default PropertySimilar
