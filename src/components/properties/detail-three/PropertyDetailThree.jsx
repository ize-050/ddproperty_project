'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import HeaderTwo from '@/layouts/headers/HeaderTwo'
import FooterHomeThree from '@/components/homes/home-three/FooterHomeThree'
import FancyBanner from '@/components/about/about-us-two/FancyBanner'
import PropertyBanner from './PropertyBanner'
import PropertyMediaGallery from './PropertyMediaGallery'
import PropertyOverview from './PropertyOverview'
import PropertySidebar from './PropertySidebar'
import PropertyDescription from './PropertyDescription'
import PropertyAmenities from './PropertyAmenities'
import PropertyLocation from './PropertyLocation'
import PropertySimilar from './PropertySimilar'

const PropertyDetailThree = ({ propertyData }) => {
   const params = useParams()
   const locale = params?.locale || 'th'

   return (
      <>
         <HeaderTwo style_1={true} style_2={false} />
         
         <div className="listing-details-one theme-details-one bg-pink pt-180 lg-pt-150 pb-150 xl-pb-120">
            <div className="container">
               <PropertyBanner property={propertyData} locale={locale} />
               <PropertyMediaGallery property={propertyData} />
               
               <div className="property-feature-list bg-white shadow4 border-20 p-40 mt-50 mb-60">
                  <h4 className="sub-title-one mb-40 lg-mb-20">Property Overview</h4>
                  <PropertyOverview property={propertyData} locale={locale} />
               </div>

               <div className="row">
                  <div className="col-xl-8">
                     <PropertyDescription property={propertyData} locale={locale} />
                     <PropertyAmenities property={propertyData} locale={locale} />
                     <PropertyLocation property={propertyData} />
                     <PropertySimilar property={propertyData} locale={locale} />
                  </div>
                  
                  <PropertySidebar property={propertyData} locale={locale} />
               </div>
            </div>
         </div>

         <FancyBanner />
         <FooterHomeThree />
      </>
   )
}

export default PropertyDetailThree
