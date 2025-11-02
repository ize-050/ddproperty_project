"use client"
import Image from "next/image"
import Slider from "react-slick"

const brandLogo_1 = "/assets/images/logo/p_logo_07.png"
const brandLogo_2 = "/assets/images/logo/p_logo_08.png"
const brandLogo_3 = "/assets/images/logo/p_logo_09.png"
const brandLogo_4 = "/assets/images/logo/p_logo_10.png"
const brandLogo_5 = "/assets/images/logo/p_logo_11.png"
const brandLogo_6 = "/assets/images/logo/p_logo_12.png"

const brand_data = [brandLogo_1, brandLogo_2, brandLogo_3, brandLogo_4, brandLogo_5, brandLogo_6, brandLogo_3]

const setting = {
   dots: false,
   arrows: false,
   centerPadding: '0px',
   slidesToShow: 6,
   slidesToScroll: 1,
   autoplay: true,
   autoplaySpeed: 3500,
   responsive: [
      {
         breakpoint: 1200,
         settings: {
            slidesToShow: 4
         }
      },
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

const BrandTwo = () => {
   return (
      <Slider {...setting} className="partner-logo-one">
         {brand_data.map((brand, i) => (
            <div key={i} className="item"><img src={brand} alt="" /></div>
         ))}
      </Slider>
   )
}

export default BrandTwo
