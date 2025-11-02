'use client'

const PropertyOverview = ({ property, locale }) => {
   const overviewItems = [
      {
         icon: 'fa-light fa-bed-front',
         label: locale === 'th' ? 'ห้องนอน' : 'Bedrooms',
         value: property?.bedrooms || 'N/A'
      },
      {
         icon: 'fa-light fa-bath',
         label: locale === 'th' ? 'ห้องน้ำ' : 'Bathrooms',
         value: property?.bathrooms || 'N/A'
      },
      {
         icon: 'fa-light fa-ruler-combined',
         label: locale === 'th' ? 'พื้นที่' : 'Area',
         value: property?.area ? `${property.area} ${property.areaUnit || 'sqm'}` : 'N/A'
      },
      {
         icon: 'fa-light fa-calendar',
         label: locale === 'th' ? 'ปีที่สร้าง' : 'Year Built',
         value: property?.yearBuilt || 'N/A'
      },
      {
         icon: 'fa-light fa-building',
         label: locale === 'th' ? 'ชั้น' : 'Floor',
         value: property?.floor || 'N/A'
      },
      {
         icon: 'fa-light fa-car',
         label: locale === 'th' ? 'ที่จอดรถ' : 'Parking',
         value: property?.parking || 'N/A'
      },
      {
         icon: 'fa-light fa-compass',
         label: locale === 'th' ? 'ทิศ' : 'Direction',
         value: property?.direction || 'N/A'
      },
      {
         icon: 'fa-light fa-file-certificate',
         label: locale === 'th' ? 'เอกสารสิทธิ์' : 'Title Deed',
         value: property?.titleDeed || 'N/A'
      }
   ]

   return (
      <ul className="style-none d-flex flex-wrap align-items-center justify-content-between">
         {overviewItems.map((item, index) => (
            <li key={index}>
               <strong>{item.label}</strong>
               <span className="d-flex align-items-center">
                  <i className={`${item.icon} me-2`}></i>
                  {item.value}
               </span>
            </li>
         ))}
      </ul>
   )
}

export default PropertyOverview
