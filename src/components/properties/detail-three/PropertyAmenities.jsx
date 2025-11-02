'use client'

const PropertyAmenities = ({ property, locale }) => {
   // Get amenities
   const getAmenities = () => {
      if (!property?.amenities) return []
      
      try {
         if (typeof property.amenities === 'string') {
            return JSON.parse(property.amenities)
         }
         return property.amenities
      } catch {
         return []
      }
   }

   const amenities = getAmenities()

   if (amenities.length === 0) return null

   return (
      <div className="property-amenities bg-white shadow4 border-20 p-40 mb-50">
         <h4 className="mb-20">{locale === 'th' ? 'สิ่งอำนวยความสะดวก' : 'Amenities'}</h4>
         <p className="fs-20 lh-lg mb-40">
            {locale === 'th' 
               ? 'สิ่งอำนวยความสะดวกที่มีให้บริการในทรัพย์สินนี้' 
               : 'Available amenities in this property'}
         </p>
         <ul className="style-none d-flex flex-wrap justify-content-between list-style-two">
            {amenities.map((amenity, index) => (
               <li key={index}>
                  <i className="fa-solid fa-check me-2"></i>
                  {amenity}
               </li>
            ))}
         </ul>
      </div>
   )
}

export default PropertyAmenities
