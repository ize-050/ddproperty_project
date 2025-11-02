'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import ReactPaginate from 'react-paginate'
import HeaderTwo from '@/layouts/headers/HeaderTwo'
import FooterHomeThree from '@/components/homes/home-three/FooterHomeThree'
import HeroSearchBar from '@/components/properties/listing/HeroSearchBar'
import createSlug from '@/utils/slugify'
import { convertAndFormatPriceSync, localeToCurrencySymbol } from '@/utils/currencyUtils'
import ContactModal from '../common/ContactModal/ContactModal'

// Property Card Component with Modal
const PropertyCard = ({ property, locale, slug, title, zoneName, sortedImages, baseImageUrl, currencySymbol, formattedSalePrice, formattedRentPrice, isForSale, isForRent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="col-lg-4 col-md-6 d-flex mb-50 wow fadeInUp">
        <div className="listing-card-one border-25 h-100 w-100 border-layout">
          <div className="img-gallery p-15">
            <div className="position-relative border-25 overflow-hidden">
              {/* Listing Type Tag */}
              {(isForSale || isForRent) && (
                <div style={{ 
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  zIndex: 2
                }}>
                  <div className="tag border-25" style={{ 
                    backgroundColor: isForRent ? '#FF5A3C' : '#AF1A1E',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    display: 'inline-block'
                  }}>
                    {isForRent ? 'FOR RENT' : 'FOR SALE'}
                  </div>
                </div>
              )}
              
              {/* Additional Labels (HOT OFFER, NEW LISTING) */}
              <div style={{ 
                position: 'absolute',
                bottom: '15px',
                left: '15px',
                zIndex: 2,
                display: 'flex',
                gap: '8px'
              }}>
                {property.labels && property.labels.length > 0 ? (
                  property.labels.map((label, index) => {
                  // Get label color based on labelType
                  const getLabelColor = (labelType) => {
                    switch(labelType) {
                      case 'hot-offer': return '#DC3545' // Red
                      case 'new-listing': return '#FFC107' // Yellow
                      case 'reduce-price': return '#FF5A3C' // Orange
                      case 'resale': return '#28a745' // Green
                      case 'rented': return '#6c757d' // Gray
                      case 'sold': return '#343a40' // Dark
                      default: return '#FFC107' // Default Yellow
                    }
                  }
                  
                  return (
                    <div key={index} className="tag border-25" style={{ 
                      backgroundColor: getLabelColor(label.labelType),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {label.label}
                    </div>
                  )
                })
                ) : null}
              </div>
              
              {/* Favorite Button */}
              <button className="fav-btn tran3s" style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
                fontSize: '18px',
                color: '#666'
              }}>
                <i className="fa-light fa-heart"></i>
              </button>
              
              {/* Image Carousel */}
              <div id={`carousel${property.id}`} className="carousel slide">
                <div className="carousel-indicators">
                  {sortedImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target={`#carousel${property.id}`}
                      data-bs-slide-to={index}
                      className={index === 0 ? 'active' : ''}
                      aria-current={index === 0 ? 'true' : undefined}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
                <div className="carousel-inner">
                  {sortedImages.length > 0 ? (
                    sortedImages.map((image, index) => (
                      <div key={image.id} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="1000000">
                        <Link href={`/properties/${slug}`} className="d-block">
                          <img 
                            src={`${baseImageUrl}${image.url}`} 
                            className="w-100" 
                            alt={title}
                            style={{ height: '280px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/images/listings/default-property.jpg'
                            }}
                          />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="carousel-item active">
                      <Link href={`/properties/${slug}`} className="d-block">
                        <img 
                          src="/images/listings/default-property.jpg" 
                          className="w-100" 
                          alt={title}
                          style={{ height: '280px', objectFit: 'cover' }}
                        />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="property-info p-25">
            <Link 
              href={`/${locale !== 'th' ? locale + '/' : ''}properties/${slug}`}
              className="title tran3s"
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '10px'
              }}
            >
              {title}
            </Link>
            <div className="address" style={{ color: '#6c757d', fontSize: '14px', marginBottom: '15px' }}>
              {zoneName}
            </div>
            
            <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between mb-3">
              <li className="d-flex align-items-center">
                <i className="flaticon-expand me-2" style={{ color: '#6c757d' }}></i>
                <span className="fs-16">{property.usableArea || 0} sqm</span>
              </li>
              <li className="d-flex align-items-center">
                <i className="flaticon-bed me-2" style={{ color: '#6c757d' }}></i>
                <span className="fs-16">{property.bedrooms || 0} bed</span>
              </li>
              <li className="d-flex align-items-center">
                <i className="flaticon-shower me-2" style={{ color: '#6c757d' }}></i>
                <span className="fs-16">{property.bathrooms || 0} bath</span>
              </li>
            </ul>

            <div className="pl-footer top-border d-flex align-items-center justify-content-between pt-3" style={{ borderTop: '1px solid #e0e0e0' }}>
              <div className="price-section">
                {isForSale && formattedSalePrice && (
                  <strong className="price fw-500 color-dark" style={{ fontSize: '20px', color: '#1a1a1a', display: 'block' }}>
                    {currencySymbol}{formattedSalePrice}
                  </strong>
                )}
                {isForRent && formattedRentPrice && (
                  <strong className="price fw-500 color-dark" style={{ fontSize: isForSale ? '16px' : '20px', color: '#1a1a1a', display: 'block' }}>
                    {currencySymbol}{formattedRentPrice}<sub style={{ fontSize: '14px', fontWeight: '400' }}>/mo</sub>
                  </strong>
                )}
              </div>
              <a
                href="tel:+66123456789"
                className="contact-option phone"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsModalOpen(true)
                }}
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#AF1A1E',
                  color: 'white',
                  borderRadius: '50%',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                <i className="fas fa-phone"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={property}
      />
    </>
  )
}

const PropertiesList = ({ searchParams }) => {
  const locale = useLocale()
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 9

  // Initialize filters from URL params
  const typeParam = urlSearchParams.get('type')
  const [filters, setFilters] = useState({
    propertyType: urlSearchParams.get('propertyType') || '',
    minPrice: urlSearchParams.get('minPrice') || '',
    maxPrice: urlSearchParams.get('maxPrice') || '',
    zoneId: urlSearchParams.get('zoneId') || '',
    listingType: typeParam === 'rent' ? 'RENT' : typeParam === 'sale' ? 'SALE' : '',
    bedrooms: urlSearchParams.get('bedrooms') || '',
    bathrooms: urlSearchParams.get('bathrooms') || ''
  })

  useEffect(() => {
    fetchProperties()
  }, [currentPage, filters.propertyType, filters.minPrice, filters.maxPrice, filters.zoneId, filters.listingType, filters.bedrooms, filters.bathrooms])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      
      // Build query params from filters
      const params = new URLSearchParams()
      
      // Add filters to params
      if (filters.propertyType) params.append('propertyType', filters.propertyType)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.zoneId) params.append('zoneId', filters.zoneId)
      if (filters.listingType) params.append('listingType', filters.listingType)
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms)
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms)
      
      // Add pagination
      params.append('limit', itemsPerPage.toString())
      params.append('offset', (currentPage * itemsPerPage).toString())
      
      // Add includes for related data
      params.append('include', 'images,zone,listings,labels')

      console.log('Fetching properties with params:', params.toString())

      const response = await fetch(`/api/properties?${params.toString()}`, {
        headers: {
          'x-api-key': 'dd-property-api-key-2025'
        }
      })

      const data = await response.json()
      
      console.log('Properties response:', data)
      console.log('First property:', data.properties?.[0])
      console.log('First property listings:', data.properties?.[0]?.listings)
      console.log('First property labels:', data.properties?.[0]?.labels)
      console.log('First property images:', data.properties?.[0]?.images)
      console.log('First property zone:', data.properties?.[0]?.zone)
      
      setProperties(data.properties || [])
      setTotalCount(data.total || 0)
 
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (searchData) => {
    console.log('handleSearch called with:', searchData)
    
    // Update filters
    const newFilters = {
      ...filters,
      listingType: searchData.listingType || filters.listingType,
      searchQuery: searchData.searchQuery || ''
    }
    
    setFilters(newFilters)
    setCurrentPage(0)
    
    // Update URL params
    const params = new URLSearchParams()
    if (newFilters.listingType) params.set('type', newFilters.listingType)
    if (newFilters.searchQuery) params.set('search', newFilters.searchQuery)
    
    router.push(`/${locale !== 'th' ? locale + '/' : ''}properties?${params.toString()}`)
  }

  const pageCount = Math.ceil(totalCount / itemsPerPage)

  // Get property title based on locale
  const getPropertyTitle = (property) => {
    switch (locale) {
      case 'th':
        return property.titleTh || property.titleEn || property.title
      case 'zh':
        return property.titleCh || property.titleEn || property.title
      case 'ru':
        return property.titleRu || property.titleEn || property.title
      default:
        return property.titleEn || property.title
    }
  }

  // Get zone name based on locale
  const getZoneName = (zone) => {
    if (!zone) return ''
    switch (locale) {
      case 'th':
        return zone.name_th || zone.name_en || zone.name
      case 'zh':
        return zone.name_ch || zone.name_en || zone.name
      case 'ru':
        return zone.name_ru || zone.name_en || zone.name
      default:
        return zone.name_en || zone.name
    }
  }

  return (
    <>
      <HeaderTwo style_1={true} style_2={false} />
      
      {/* Hero Search Bar Section with Background */}
      <div className="inner-banner-one pt-180 lg-pt-150 pb-150 xl-pb-120 position-relative" style={{
        background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/hero/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '500px'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-10 mx-auto">
              <HeroSearchBar 
                onSearch={handleSearch}
                initialListingType={filters.listingType}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="property-listing-six pt-50 pb-170 xl-pb-120">
        <div className="container">
          {/* Results Header */}
          <div className="listing-header-filter d-sm-flex justify-content-between align-items-center mb-40 lg-mb-30">
            <div>
              Showing <span className="color-dark fw-500">{currentPage * itemsPerPage + 1}–{Math.min((currentPage + 1) * itemsPerPage, totalCount)}</span> of{' '}
              <span className="color-dark fw-500">{totalCount}</span> results
            </div>
            <div className="d-flex align-items-center xs-mt-20">
              <div className="short-filter d-flex align-items-center">
                <div className="fs-16 me-2">Sort by:</div>
                <select 
                  className="nice-select"
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px'
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="price_low">Price Low</option>
                  <option value="price_high">Price High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-5">
              <p>No properties found.</p>
            </div>
          ) : (
            <div className="row gx-xxl-5">
              {properties.map((property) => {
                const title = getPropertyTitle(property)
                const zoneName = getZoneName(property.zone)
                const slug = createSlug(title, property.id)
                
                // Get images with base URL
                const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || ''
                const sortedImages = property.images && property.images.length > 0
                  ? property.images.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                  : []

                // Get listing type and prices
                const listingTypes = property.listings?.map(l => l.listingType) || []
                const isForSale = listingTypes.includes('SALE')
                const isForRent = listingTypes.includes('RENT')
                
                // Get sale and rent prices
                const salePrice = property.listings?.find(l => l.listingType === 'SALE')?.price || 0
                const rentPrice = property.listings?.find(l => l.listingType === 'RENT')?.price || 0
                
                // Format prices
                const currencySymbol = localeToCurrencySymbol(locale)
                const formattedSalePrice = salePrice ? convertAndFormatPriceSync(salePrice, locale) : ''
                const formattedRentPrice = rentPrice ? convertAndFormatPriceSync(rentPrice, locale) : ''

                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    locale={locale}
                    slug={slug}
                    title={title}
                    zoneName={zoneName}
                    sortedImages={sortedImages}
                    baseImageUrl={baseImageUrl}
                    currencySymbol={currencySymbol}
                    formattedSalePrice={formattedSalePrice}
                    formattedRentPrice={formattedRentPrice}
                    isForSale={isForSale}
                    isForRent={isForRent}
                  />
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="pt-50 md-pt-20 text-center">
              <ReactPaginate
                breakLabel="..."
                nextLabel={<i className="fa-regular fa-chevron-right"></i>}
                onPageChange={handlePageClick}
                pageRangeDisplayed={pageCount}
                pageCount={pageCount}
                previousLabel={<i className="fa-regular fa-chevron-left"></i>}
                renderOnZeroPageCount={null}
                className="pagination-two d-inline-flex align-items-center justify-content-center style-none"
                forcePage={currentPage}
              />
            </div>
          )}
        </div>
      </div>

      <FooterHomeThree />
    </>
  )
}

export default PropertiesList
