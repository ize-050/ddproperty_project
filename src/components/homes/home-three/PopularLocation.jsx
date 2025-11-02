'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const PopularLocation = ({ zones = [] }) => {
  const locale = useLocale()
  const [popularZones, setPopularZones] = useState([])

  useEffect(() => {
    console.log('PopularLocation zones:', zones)
    if (zones && zones.length > 0) {
      // Take first 8 zones or all if less than 8
      const selectedZones = zones.slice(0, 8)
      console.log("SelectedZonem",selectedZones);
      setPopularZones(selectedZones)
      console.log('PopularLocation popularZones set:', selectedZones.length, 'zones')
    } else {
      console.log('No zones data available')
    }
  }, [zones])

  // Don't render if no zones
  if (!popularZones || popularZones.length === 0) {
    console.log('PopularLocation: No zones to display')
    return null
  }

  return (
    <>
      <section className="pb90 pb20-md pt90 pt60-md" style={{ backgroundColor: '#FFF5F5' }}>
        <div className="container">
          <div className="row align-items-center mb-4" data-aos="fade-up">
            <div className="col-lg-12 text-center">
              <div className="main-title2">
                <h2 className="title">
                  Explore Popular <span style={{ color: '#eb6753' }}>Location</span>
                </h2>
                <p className="paragraph">
                  {(() => {
                    const translations = {
                      'en': 'Explore latest & featured properties for sale.',
                      'th': 'สำรวจอสังหาริมทรัพย์ล่าสุดและแนะนำสำหรับขาย',
                      'zh': '探索最新和精选待售房产',
                      'ru': 'Изучите последние и избранные объекты недвижимости на продажу'
                    }
                    return translations[locale] || translations['en']
                  })()}
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
              {console.log('Rendering Swiper with', popularZones.length, 'zones')}
              <div style={{ minHeight: '350px' }}>
                <Swiper
                  className="overflow-visible"
                  spaceBetween={30}
                  modules={[Navigation]}
                  navigation={{
                    nextEl: ".location-next__active",
                    prevEl: ".location-prev__active",
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
                {popularZones.map((zone, index) => {
                  console.log(`Zone ${index}:`, zone)
                  
                  // Get zone name based on locale
                  const zoneName = (() => {
                    switch (locale) {
                      case 'th':
                        return zone.nameTh || zone.nameEn || zone.name
                      case 'zh':
                        return zone.nameCh || zone.nameEn || zone.name
                      case 'ru':
                        return zone.nameRu || zone.nameEn || zone.name
                      default:
                        return zone.nameEn || zone.name
                    }
                  })()

                  // Get property count text
                  const propertyCountText = (() => {
                    const count = zone.propertyCount || zone._count?.properties || 0
                    const translations = {
                      'en': `${count} Properties`,
                      'th': `${count} ทรัพย์สิน`,
                      'zh': `${count} 房产`,
                      'ru': `${count} Объектов`
                    }
                    return translations[locale] || translations['en']
                  })()

                  // Get zone image - เพิ่ม base URL ถ้าไม่มี
                  let zoneImage = zone.imagePath || '/images/zones/default-zone.jpg'
                  if (zoneImage && !zoneImage.startsWith('http')) {
                    zoneImage = `http://localhost:5001${zoneImage}`
                  }
                  console.log("zoneImage1122", zoneImage, "zoneName:", zoneName);
                  
                  return (
                    <SwiperSlide key={zone.id}>
                      <div className="item">
                        <div 
                          className="location-card"
                          style={{
                            position: 'relative',
                            width: '333px',
                            height: '400px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            display: 'block'
                          }}
                        >
                          <Link 
                            href={`/${locale !== 'th' ? locale + '/' : ''}properties/list?zoneId=${zone.id}`}
                            style={{ display: 'block', height: '100%', width: '100%' }}
                          >
                            <img
                              src={zoneImage}
                              alt={zoneName}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }}
                              onError={(e) => {
                                console.error('Image load error:', zoneImage)
                                e.target.src = '/images/zones/default-zone.jpg'
                              }}
                            />
                            {/* Gradient overlay */}
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: '60%',
                              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                              pointerEvents: 'none'
                            }}></div>

                            {/* Zone info */}
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              padding: '20px',
                              color: 'white',
                              zIndex: 2
                            }}>
                              <h4 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                marginBottom: '5px',
                                color: 'white'
                              }}>
                                {zoneName}
                              </h4>
                              <p style={{
                                fontSize: '14px',
                                margin: 0,
                                opacity: 0.9
                              }}>
                                {propertyCountText}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
              </div>

              <div className="row align-items-center justify-content-between arrowY-center-position mt-4">
                <div className="col-auto">
                  <button className="location-prev__active swiper_button">
                    <i className="far fa-arrow-left-long" />
                  </button>
                </div>
                <div className="col-auto">
                  <button className="location-next__active swiper_button">
                    <i className="far fa-arrow-right-long" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PopularLocation
