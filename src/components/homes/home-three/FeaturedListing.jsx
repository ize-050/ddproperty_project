'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import createSlug from '@/utils/slugify'
import useSimpleTranslations from '@/hooks/useSimpleTranslations'
import { convertAndFormatPrice, convertAndFormatPriceSync, localeToCurrencySymbol } from '@/utils/currencyUtils'

const FeaturedListing = ({ randomProperties }) => {
  const locale = useLocale()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [formattedPrices, setFormattedPrices] = useState({})
  const { t: dynamicT } = useSimpleTranslations('listing')

  // สัญลักษณ์สกุลเงินตามภาษา
  const currencySymbol = localeToCurrencySymbol(locale)

  // ฟังก์ชันสำหรับแปลงราคาเป็นรูปแบบที่อ่านง่าย
  const formatPrice = (price) => {
    return convertAndFormatPriceSync(price, locale, false)
  }

  // โหลดราคาที่แปลงแล้วสำหรับแต่ละทรัพย์สิน
  useEffect(() => {
    const loadFormattedPrices = async () => {
      if (properties.length > 0) {
        const pricesObj = {}

        for (const property of properties) {
          if (property.listings && property.listings.length > 0) {
            for (const listing of property.listings) {
              if (listing.price) {
                const key = `${property.id}-${listing.id}`
                pricesObj[key] = await convertAndFormatPrice(listing.price, locale, false)
              }
            }
          }
        }

        setFormattedPrices(pricesObj)
      }
    }

    loadFormattedPrices()
  }, [properties, locale])

  // ใช้ข้อมูลจาก props ที่ได้จาก SSR
  useEffect(() => {
    try {
      if (randomProperties && Array.isArray(randomProperties) && randomProperties.length > 0) {
        // Take only first 6 properties
        setProperties(randomProperties.slice(0, 6))
      } else {
        setProperties([])
      }
    } catch (err) {
      console.error('Error setting properties from props:', err)
    } finally {
      setLoading(false)
    }
  }, [randomProperties])

  if (loading) {
    return (
      <div className="property-listing-one mt-170 xl-mt-120">
        <div className="container container-large">
          <div className="position-relative">
            <div className="title-one mb-25 lg-mb-10">
              <h3>Loading...</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return null
  }

  return (
    <>
      {properties && properties.length > 0 && (
        <>
          <div className="row align-items-center mb-4" data-aos="fade-up">
            <div className="col-lg-12">
              <div className="main-title2">
                <h2 className="title">
                  Featured <span style={{ color: '#eb6753' }}>Listing</span>
                </h2>
                <p className="paragraph">
                  {(() => {
                    const translations = {
                      'en': 'Explore featured properties for sale.',
                      'th': 'สำรวจอสังหาริมทรัพย์แนะนำสำหรับขาย',
                      'zh': '探索精选待售房产',
                      'ru': 'Изучите избранные объекты недвижимости на продажу'
                    }
                    return translations[locale] || translations['en']
                  })()}
                </p>
              </div>
            </div>
          </div>

          <Swiper
            className="overflow-visible"
            spaceBetween={30}
            modules={[Navigation]}
            navigation={{
              nextEl: ".featured-next__active",
              prevEl: ".featured-prev__active",
            }}
            slidesPerView={1}
            loop={false}
            breakpoints={{
              300: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              576: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 25,
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
          >
            {properties.map((property, index) => {
              // เรียงลำดับรูปภาพตาม sortOrder ก่อนแล้วเอารูปแรก
              const sortedImages = property.images && property.images.length > 0
                ? property.images.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                : []

              const firstImage = sortedImages[0]

              const mainImage = firstImage && firstImage.url
                ? (firstImage.url.startsWith('http') ? firstImage.url : firstImage.url)
                : "/images/listings/default-property.jpg"

              const delay = `${index * 0.1}s`

              return (
                <SwiperSlide key={property.id}>
                  <div className="item">
                    <div className="listing-style9">
                    <div className="list-thumb" style={{ position: 'relative', height: '465px', overflow: 'hidden' }}>
                      <img
                        width={500}
                        height={465}
                        className="cover"
                        src={mainImage}
                        alt={property.title || 'Property'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                      {/* Gradient overlay for text readability */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                        pointerEvents: 'none'
                      }}></div>
                      <div className="sale-sticker-wrap">
                        <div className="special-tags">
                          {property.labels?.map((label, labelIndex) => (
                            <React.Fragment key={`${property.id}-${label.labelType}-${labelIndex}`}>
                              {label.isHotOffer && (
                                <div className="tag hot-offer">{dynamicT('hot-offer', 'HOT OFFER')}</div>
                              )}
                              {label.isNewListing && (
                                <div className="tag new-listing">{dynamicT('new-listing', 'NEW LISTING')}</div>
                              )}
                              {label.resale && (
                                <div className="tag resale">{dynamicT('resale', 'RESALE')}</div>
                              )}
                              {label.rented && (
                                <div className="tag rented">{dynamicT('rented', 'RENTED')}</div>
                              )}
                              {label.newDevelopment && (
                                <div className="tag new-development">{dynamicT('new-development', 'NEW DEVELOPMENT')}</div>
                              )}
                              {label.reducePrice && (
                                <div className="tag reduce-price">{dynamicT('reduce-price', 'REDUCE PRICE')}</div>
                              )}
                              {label.sold && (
                                <div className="tag sold">{dynamicT('sold', 'SOLD')}</div>
                              )}
                              {label.underConstruction && (
                                <div className="tag under-construction">{dynamicT('under-construction', 'UNDER CONSTRUCTION')}</div>
                              )}
                            </React.Fragment>
                          ))}

                          <div className="property-type">
                            {property.listings && property.listings.length > 1 ? (
                              <>
                                {property.listings.some(listing => listing.listingType === 'SALE') &&
                                  property.listings.some(listing => listing.listingType === 'RENT') && (
                                    <div className="for-rent">{(() => {
                                      const translations = {
                                        'en': 'For Sale/Rent',
                                        'th': 'ขาย/เช่า',
                                        'zh': '出售/租赁',
                                        'ru': 'Продажа/Аренда'
                                      }
                                      return translations[locale] || translations['en']
                                    })()}</div>
                                  )}
                                {property.listings.every(listing => listing.listingType === 'SALE') && (
                                  <div className="for-sale">{(() => {
                                    const translations = {
                                      'en': 'For Sale',
                                      'th': 'ขาย',
                                      'zh': '出售',
                                      'ru': 'Продажа'
                                    }
                                    return translations[locale] || translations['en']
                                  })()}</div>
                                )}
                                {property.listings.every(listing => listing.listingType === 'RENT') && (
                                  <div className="for-rent">{(() => {
                                    const translations = {
                                      'en': 'For Rent',
                                      'th': 'เช่า',
                                      'zh': '租赁',
                                      'ru': 'Аренда'
                                    }
                                    return translations[locale] || translations['en']
                                  })()}</div>
                                )}
                              </>
                            ) : property.listings && property.listings[0]?.listingType && (
                              <>
                                <div className={property.listings[0].listingType === 'SALE' ? "for-sale" : "for-rent"}>
                                  {(() => {
                                    const listingType = property.listings[0].listingType
                                    const translations = {
                                      'SALE': {
                                        'en': 'For Sale',
                                        'th': 'ขาย',
                                        'zh': '出售',
                                        'ru': 'Продажа'
                                      },
                                      'RENT': {
                                        'en': 'For Rent',
                                        'th': 'เช่า',
                                        'zh': '租赁',
                                        'ru': 'Аренда'
                                      }
                                    }
                                    return translations[listingType]?.[locale] || translations[listingType]?.['en'] || listingType
                                  })()}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="list-meta">
                        <Link href={`/${locale !== 'th' ? locale + '/' : ''}property_detail/${property.id}/${createSlug(property.title)}`} className="list-meta-link">
                          <span className="flaticon-fullscreen" />
                        </Link>
                      </div>
                    </div>

                    <div className="list-content">
                      <div className="list-price">
                        {property.listings?.[0]?.price
                          ? `${currencySymbol}${formattedPrices[`${property.id}-${property.listings[0].id}`] || formatPrice(property.listings[0].price)}`
                          : 'Contact for price'}
                      </div>
                      <h6 className="list-title my-1">
                        <Link href={`/${locale !== 'th' ? locale + '/' : ''}property_detail/${property.id}/${createSlug(property.title)}`}>
                          {(() => {
                            if (property.translatedTitles) {
                              try {
                                const titles = JSON.parse(property.translatedTitles)
                                return titles[locale] || titles['en'] || property.title
                              } catch (e) {
                                return property.title
                              }
                            }
                            return property.title
                          })()}
                        </Link>
                      </h6>
                      <p className="list-text"
                        style={{
                          fontSize: '14px',
                          color: '#666'
                        }}
                      >{(() => {
                        if (property.zone) {
                          switch (locale) {
                            case 'th':
                              return property.zone.nameTh || property.zone.nameEn || property.zone.name
                            case 'en':
                              return property.zone.nameEn || property.zone.name
                            case 'zh':
                              return property.zone.nameCh || property.zone.nameEn || property.zone.name
                            case 'ru':
                              return property.zone.nameRu || property.zone.nameEn || property.zone.name
                            default:
                              return property.zone.nameEn || property.zone.name
                          }
                        }
                        return 'Zone not specified'
                      })()}</p>
                      <div className="list-meta2 d-flex align-items-center">
                        <a className="mr10" href="#">
                          <span className="flaticon-bed" /> {property.bedrooms || 0} {dynamicT('bed', 'bed')}
                        </a>
                        <a className="mr10" href="#">
                          <span className="flaticon-shower" /> {property.bathrooms || 0} {dynamicT('bath', 'bath')}
                        </a>
                        <a href="#">
                          <span className="flaticon-expand" /> {property.usableArea || 0} {dynamicT('sqm', 'sqm')}
                        </a>
                      </div>
                    </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>

          <div className="row align-items-center justify-content-between arrowY-center-position">
            <div className="col-auto">
              <button className="featured-prev__active swiper_button">
                <i className="far fa-arrow-left-long" />
              </button>
            </div>
            <div className="col-auto">
              <button className="featured-next__active swiper_button">
                <i className="far fa-arrow-right-long" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default FeaturedListing
