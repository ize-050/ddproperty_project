import Image from "next/image"
import Link from "next/link"


const breadcrumbShape_1 = '/assets/images/shape/shape_35.svg';
const breadcrumbShape_2 = '/assets/images/shape/shape_36.svg';

const BreadcrumbTwo = ({ title ="Get to Know about Us" }) => {
   return (
      <div className="inner-banner-three inner-banner text-center z-1 position-relative">
         <div className="bg-wrapper overflow-hidden position-relative z-1" style={{ backgroundImage: `url(/assets/images/aboutus/banner.png)` }}>
            <div className="container position-relative z-2">
               <h2 className="mb-35 xl-mb-20 md-mb-10 pt-15 font-garamond text-white">{title}</h2>
            
            </div>
            <img src={breadcrumbShape_1} alt="" className="lazy-img shapes shape_01" />
            <img src={breadcrumbShape_2} alt="" className="lazy-img shapes shape_02" />
         </div>
      </div>
   )
}

export default BreadcrumbTwo
