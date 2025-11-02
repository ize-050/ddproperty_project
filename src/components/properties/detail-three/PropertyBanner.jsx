'use client'

import Link from 'next/link'
import { useState } from 'react'

const PropertyBanner = ({ property, locale }) => {
   const [isFavorite, setIsFavorite] = useState(false)

   // Get localized title
   const getTitle = () => {
      try {
         const titles = JSON.parse(property?.translatedTitles || '{}')
         return titles[locale] || titles['en'] || property?.title || ''
      } catch {
         return property?.title || ''
      }
   }

   // Get property type
   const getPropertyType = () => {
      if (property?.propertyType === 'sale') return 'FOR SALE'
      if (property?.propertyType === 'rent') return 'FOR RENT'
      return 'FOR SALE'
   }

   // Format price
   const formatPrice = (price, currency = 'THB') => {
      if (!price) return 'Contact for price'
      const formatted = new Intl.NumberFormat('en-US').format(price)
      return `${currency} ${formatted}`
   }

   // Get location
   const getLocation = () => {
      const parts = []
      if (property?.subDistrict) parts.push(property.subDistrict)
      if (property?.district) parts.push(property.district)
      if (property?.province) parts.push(property.province)
      return parts.join(', ') || 'Location not specified'
   }

   const handleShare = () => {
      if (navigator.share) {
         navigator.share({
            title: getTitle(),
            url: window.location.href
         })
      }
   }

   const toggleFavorite = () => {
      setIsFavorite(!isFavorite)
      // TODO: Add to favorites API
   }

   return (
      <div className="row">
         <div className="col-lg-6">
            <h3 className="property-titlee">{getTitle()}</h3>
            <div className="d-flex flex-wrap mt-10">
               <div className="list-type text-uppercase border-20 mt-15 me-3">
                  {getPropertyType()}
               </div>
               <div className="address mt-15">
                  <i className="bi bi-geo-alt"></i> {getLocation()}
               </div>
            </div>
         </div>
         
         <div className="col-lg-6 text-lg-end">
            <div className="d-inline-block md-mt-40">
               <div className="price color-dark fw-500">
                  Price: {formatPrice(property?.price, property?.currency)}
               </div>
               {property?.pricePerSqm && (
                  <div className="est-price fs-20 mt-25 mb-35 md-mb-30">
                     Per Sqm: <span className="fw-500 color-dark">
                        {formatPrice(property.pricePerSqm, property?.currency)}
                     </span>
                  </div>
               )}
               
               <ul className="style-none d-flex align-items-center action-btns">
                  <li className="me-auto fw-500 color-dark" onClick={handleShare} style={{ cursor: 'pointer' }}>
                     <i className="fa-sharp fa-regular fa-share-nodes me-2"></i>
                     Share
                  </li>
                  <li>
                     <button
                        onClick={toggleFavorite}
                        className="d-flex align-items-center justify-content-center rounded-circle tran3s border-0 bg-transparent"
                        style={{ cursor: 'pointer' }}
                     >
                        <i className={`fa-${isFavorite ? 'solid' : 'light'} fa-heart`} style={{ color: isFavorite ? '#ff0000' : 'inherit' }}></i>
                     </button>
                  </li>
                  <li>
                     <Link href="#" className="d-flex align-items-center justify-content-center rounded-circle tran3s">
                        <i className="fa-light fa-bookmark"></i>
                     </Link>
                  </li>
                  <li>
                     <Link href="#" className="d-flex align-items-center justify-content-center rounded-circle tran3s">
                        <i className="fa-light fa-circle-plus"></i>
                     </Link>
                  </li>
               </ul>
            </div>
         </div>
      </div>
   )
}

export default PropertyBanner
