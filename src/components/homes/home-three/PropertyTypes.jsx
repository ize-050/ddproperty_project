"use client"
import { useState, useEffect } from "react"
import { useLocale } from "next-intl"
import Link from "next/link"
import Image from "next/image"

const PropertyTypes = () => {
   const locale = useLocale()
   const [propertyTypes, setPropertyTypes] = useState([])
   const [loading, setLoading] = useState(true)

   // Fixed property types to display
   const fixedTypes = ['Condo', 'Pool Villa', 'House', 'Townhouse']

   useEffect(() => {
      const fetchPropertyTypes = async () => {
         try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property-types`)


      
            if (!response.ok) {
               throw new Error(`API Error: ${response.status}`)
            }
            
            const result = await response.json()
            
            const data = result.status === 'success' ? result.data : result
            
            console.log("getData",data)
            // Filter only fixed types
            const filteredTypes = data.filter(type => 
               fixedTypes.includes(type.nameEn || type.name_en || type.name)
            )
            
            // Map locale to field name (Prisma uses camelCase)
            const localeMap = {
               'en': 'nameEn',
               'th': 'nameTh',
               'zh': 'nameCh',
               'ru': 'nameRu'
            }
            const nameField = localeMap[locale] || 'nameEn'
            
            // Map to component format with CSS class names
            const bgClassMap = {
               'Condo': 'category-4-item-1',
               'Pool Villa': 'category-4-item-2', 
               'House': 'category-4-item-4',
               'Townhouse': 'category-4-item-5' // Reuse class if needed
            }

            console.log("filteredTypes",filteredTypes)
            
            const mappedTypes = filteredTypes.map((type, index) => ({
               id: type.id,
               name: type[nameField] || type.nameEn || type.name,
               image: type.p_image || type.pImage || type.z_image || '/assets/images/listing/img_large_01.jpg',
               bgClass: bgClassMap[type.nameEn || type.name_en] || '', // Use CSS class if available
               delay: `${index * 0.1}s`
            }))
            
            console.log('Mapped Property Types:', mappedTypes)
            setPropertyTypes(mappedTypes)
            setLoading(false)
         } catch (error) {
            console.error('Error fetching property types:', error)
            // Fallback data
         
            setLoading(false)
         }
      }

      fetchPropertyTypes()
   }, [locale])

   if (loading) {
      return (
         <div className="category-section-two mt-170 xl-mt-120">
            <div className="container container-large">
               <div className="position-relative">
                  <div className="title-one text-center mb-60">
                     <h3>Loading...</h3>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="category-section-two mt-170 xl-mt-120">
         <div className="container container-large">
            <div className="position-relative">
               <div className="title-one text-center text-lg-start mb-60 xl-mb-40 lg-mb-20 wow fadeInUp">
                  <h3>Property Types</h3>
               </div>
               <div className="wrapper flex-wrap d-flex justify-content-center justify-content-md-between align-items-center">
                  {propertyTypes.map((type) => (
                     <div 
                        key={type.id} 
                        className={`card-style-seven position-relative z-1 rounded-circle overflow-hidden d-flex align-items-center justify-content-center wow fadeInUp ${type.bgClass || ''}`}
                        // data-wow-delay={type.delay}
                        style={!type.bgClass && type.image ? {
                           backgroundImage: `url(${type.image})`,
                           backgroundSize: 'cover',
                           backgroundPosition: 'center'
                        } : {}}
                     >
                        <Link 
                           href={`/properties/list?type=${type.name}`} 
                           className="title stretched-link"
                        >
                           <h4 className="text-white tran3s">{type.name}</h4>
                        </Link>
                     </div>
                  ))}
               </div>
               <div className="section-btn text-center md-mt-60">
                  <Link href="/properties/list" className="btn-eight" style={{ 
                     background: 'white', 
                     color: 'black', 
                     border: '1px solid black' 
                  }}>
                     <span>See all property types</span> <i className="bi bi-arrow-up-right"></i>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

export default PropertyTypes
