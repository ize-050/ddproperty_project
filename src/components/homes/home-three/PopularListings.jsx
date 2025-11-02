"use client"
import { useState, useEffect } from "react"
import { useLocale } from "next-intl"
import Link from "next/link"
import Image from "next/image"

const PopularListings = () => {
   const locale = useLocale()
   const [properties, setProperties] = useState([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const fetchProperties = async () => {
         try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties?limit=4&featured=true`)
            
            if (!response.ok) {
               throw new Error(`API Error: ${response.status}`)
            }
            
            const result = await response.json()
            console.log('Popular Listings API Response:', result)
            
            const data = result.success ? result.data : result
            
            // Map properties to component format
            const mappedProperties = data.map((property) => {
               // Extract images array
               const images = property.images && Array.isArray(property.images) 
                  ? property.images.map(img => img.url || img.image_url || img)
                  : property.mainImage 
                     ? [property.mainImage]
                     : ['/assets/images/listing/img_large_01.jpg']
               
               return {
                  id: property.id,
                  title: property.title || property.name,
                  address: property.address || property.location,
                  price: property.price || 0,
                  tag: property.propertyType || 'For Sale',
                  image: images[0], // First image as fallback
                  images: images, // All images for carousel
                  bedrooms: property.bedrooms || 0,
                  bathrooms: property.bathrooms || 0,
                  sqft: property.area || property.sqft || 0,
                  slug: property.slug || property.id
               }
            })
            
            console.log('Mapped Properties:', mappedProperties)
            setProperties(mappedProperties)
            setLoading(false)
         } catch (error) {
            console.error('Error fetching properties:', error)
            // Fallback data
            setProperties([])
            setLoading(false)
         }
      }

      fetchProperties()
   }, [locale])

   if (loading) {
      return (
         <div className="property-listing-five mt-170 xl-mt-120">
            <div className="container container-large">
               <div className="position-relative">
                  <div className="title-one mb-25 lg-mb-10 wow fadeInUp">
                     <h3>Loading...</h3>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   if (properties.length === 0) {
      return (
         <div className="property-listing-five mt-170 xl-mt-120">
            <div className="container container-large">
               <div className="position-relative">
                  <div className="title-one mb-25 lg-mb-10 wow fadeInUp">
                     <h3>Popular Listings</h3>
                     <p className="fs-22">No properties available at the moment.</p>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="property-listing-five mt-170 xl-mt-120">
         <div className="container container-large">
            <div className="position-relative">
               <div className="title-one mb-25 lg-mb-10 wow fadeInUp">
                  <h3>Popular Listings</h3>
                  <p className="fs-22">Explore latest and featured properties for sale, rent & mortgage.</p>
               </div>

               <div className="row gx-xxl-5">
                  {properties.map((property, index) => (
                     <div key={property.id} className="col-lg-4 col-md-6 d-flex mt-40 wow fadeInUp">
                        <div className="listing-card-one style-two shadow-none h-100 w-100">
                           <div className="img-gallery">
                              <div className="position-relative overflow-hidden">
                                 <div className="tag fw-500">{property.tag}</div>
                                 <div id={`carousel${property.id}`} className="carousel slide">
                                    <div className="carousel-indicators">
                                       {property.images && property.images.length > 1 ? (
                                          property.images.map((_, i) => (
                                             <button 
                                                key={i}
                                                type="button" 
                                                data-bs-target={`#carousel${property.id}`} 
                                                data-bs-slide-to={i} 
                                                className={i === 0 ? "active" : ""} 
                                                aria-current={i === 0 ? "true" : "false"}
                                                aria-label={`Slide ${i + 1}`}
                                             ></button>
                                          ))
                                       ) : (
                                          <button type="button" data-bs-target={`#carousel${property.id}`} data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                       )}
                                    </div>
                                    <div className="carousel-inner">
                                       {property.images && property.images.length > 0 ? (
                                          property.images.map((img, i) => (
                                             <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`} data-bs-interval="1000000">
                                                <Link href={`/properties/${property.slug}`} className="d-block">
                                                   <Image 
                                                      src={img} 
                                                      alt={`${property.title} - ${i + 1}`}
                                                      width={400}
                                                      height={300}
                                                      className="w-100"
                                                      style={{ objectFit: 'cover', height: '300px' }}
                                                   />
                                                </Link>
                                             </div>
                                          ))
                                       ) : (
                                          <div className="carousel-item active" data-bs-interval="1000000">
                                             <Link href={`/properties/${property.slug}`} className="d-block">
                                                <Image 
                                                   src={property.image} 
                                                   alt={property.title}
                                                   width={400}
                                                   height={300}
                                                   className="w-100"
                                                   style={{ objectFit: 'cover', height: '300px' }}
                                                />
                                             </Link>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="property-info pt-20">
                              <Link href={`/properties/${property.slug}`} className="title tran3s">
                                 {property.title}
                              </Link>
                              <div className="address">{property.address}</div>
                              <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between pb-15 pt-5">
                                 <li className="d-flex align-items-center">
                                    <i className="bi bi-house-door me-2"></i>
                                    <span className="fs-16">{property.bedrooms} bed</span>
                                 </li>
                                 <li className="d-flex align-items-center">
                                    <i className="bi bi-droplet me-2"></i>
                                    <span className="fs-16">{property.bathrooms} bath</span>
                                 </li>
                                 <li className="d-flex align-items-center">
                                    <i className="bi bi-arrows-angle-expand me-2"></i>
                                    <span className="fs-16">{property.sqft} sqft</span>
                                 </li>
                              </ul>
                              <div className="pl-footer top-border bottom-border d-flex align-items-center justify-content-between">
                                 <strong className="price fw-500 color-dark">
                                    ${property.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                 </strong>
                                 <Link href={`/properties/${property.slug}`} className="btn-four">
                                    <i className="bi bi-arrow-up-right"></i>
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="section-btn text-center md-mt-60">
                  <Link href="/properties/list" className="btn-eight">
                     <span>Explore All</span> <i className="bi bi-arrow-up-right"></i>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

export default PopularListings
