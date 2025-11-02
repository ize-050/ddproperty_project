'use client'

import { useState } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'

const PropertyMediaGallery = ({ property }) => {
   const [nav1, setNav1] = useState(null)
   const [nav2, setNav2] = useState(null)

   // Get images
   const getImages = () => {
      const images = []
      
      // Main image
      if (property?.mainImage) {
         images.push(property.mainImage)
      }
      
      // Additional images
      if (property?.images && Array.isArray(property.images)) {
         images.push(...property.images)
      }
      
      // Default image if no images
      if (images.length === 0) {
         images.push('/assets/images/listing/img_large_01.jpg')
      }
      
      return images
   }

   const images = getImages()

   const mainSliderSettings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      fade: true,
      asNavFor: nav2,
      ref: (slider) => setNav1(slider)
   }

   const thumbSliderSettings = {
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: nav1,
      dots: false,
      centerMode: false,
      focusOnSelect: true,
      ref: (slider) => setNav2(slider),
      responsive: [
         {
            breakpoint: 768,
            settings: {
               slidesToShow: 3
            }
         },
         {
            breakpoint: 576,
            settings: {
               slidesToShow: 2
            }
         }
      ]
   }

   return (
      <div className="media-gallery mt-50 mb-60">
         {/* Main Image Slider */}
         <div className="position-relative border-20 overflow-hidden mb-20">
            <div className="tag bg-white text-dark fw-500 border-20">
               {images.length} Photos
            </div>
            <Slider {...mainSliderSettings} className="main-img-slider">
               {images.map((img, index) => (
                  <div key={index} className="item">
                     <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                        <Image
                           src={img}
                           alt={`Property image ${index + 1}`}
                           fill
                           style={{ objectFit: 'cover' }}
                           className="border-20"
                        />
                     </div>
                  </div>
               ))}
            </Slider>
         </div>

         {/* Thumbnail Slider */}
         {images.length > 1 && (
            <Slider {...thumbSliderSettings} className="thumb-slider">
               {images.map((img, index) => (
                  <div key={index} className="item px-2">
                     <div style={{ position: 'relative', width: '100%', height: '120px', cursor: 'pointer' }}>
                        <Image
                           src={img}
                           alt={`Thumbnail ${index + 1}`}
                           fill
                           style={{ objectFit: 'cover' }}
                           className="border-10"
                        />
                     </div>
                  </div>
               ))}
            </Slider>
         )}
      </div>
   )
}

export default PropertyMediaGallery
