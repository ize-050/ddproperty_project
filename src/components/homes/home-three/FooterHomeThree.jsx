'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import LanguageApi from '@/utils/languageApi'

const FooterHomeThree = () => {
  const locale = useLocale()
  const [footerData, setFooterData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true)
        const response = await LanguageApi.getUiStringsBySection('footer', {
          serverSide: false
        })

        if (response.success && response.data) {
          const dataObj = {}
          response.data.forEach(item => {
            dataObj[item.slug] = {
              en: item.en,
              th: item.th,
              zh: item.zhCN,
              ru: item.ru
            }
          })
          setFooterData(dataObj)
        }
      } catch (error) {
        console.error('Error fetching footer data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFooterData()
  }, [])

  const t = (slug) => {
    if (!footerData[slug]) return slug
    return footerData[slug][locale] || footerData[slug]['en'] || slug
  }

  if (loading) {
    return null
  }

  return (
    <>
      <footer className="footer-one pt-60 pb-40" style={{ backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
        <div className="container">
          <div className="row">
            {/* Column 1: Logo + Contact Info */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="footer-intro">
                <div className="logo mb-4">
                  <Link href={`/${locale !== 'th' ? locale + '/' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '36px', fontWeight: '700', color: '#AF1A1E' }}>12</span>
                      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>REAL ESTATE</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#AF1A1E' }}>PATTAYA</span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Call Us */}
                <div className="mb-3">
                  <h6 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
                    {t('call-us')}
                  </h6>
                  <a href="tel:+66802530622" style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', display: 'block' }}>
                    +66 (0) 80 253 0622
                  </a>
                </div>

                {/* Drop a mail */}
                <div className="mb-3">
                  <h6 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
                    {t('drop-mail')}
                  </h6>
                  <a href="mailto:info@12realestatepattaya.com" style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', display: 'block' }}>
                    info@12realestatepattaya.com
                  </a>
                </div>

                {/* Office Hour */}
                <div className="mb-4">
                  <h6 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
                    {t('office-hour')}
                  </h6>
                  <p style={{ color: '#6c757d', fontSize: '15px', margin: 0 }}>
                    {t('office-time')}
                  </p>
                </div>

                {/* Social Media */}
                <div className="social-links d-flex gap-2">
                  <a href="#" style={{ 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid #dee2e6',
                    borderRadius: '50%',
                    color: '#6c757d',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#AF1A1E'
                    e.currentTarget.style.color = '#AF1A1E'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6'
                    e.currentTarget.style.color = '#6c757d'
                  }}>
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid #dee2e6',
                    borderRadius: '50%',
                    color: '#6c757d',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#AF1A1E'
                    e.currentTarget.style.color = '#AF1A1E'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6'
                    e.currentTarget.style.color = '#6c757d'
                  }}>
                    <i className="fa-brands fa-youtube"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid #dee2e6',
                    borderRadius: '50%',
                    color: '#6c757d',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#AF1A1E'
                    e.currentTarget.style.color = '#AF1A1E'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6'
                    e.currentTarget.style.color = '#6c757d'
                  }}>
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid #dee2e6',
                    borderRadius: '50%',
                    color: '#6c757d',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#AF1A1E'
                    e.currentTarget.style.color = '#AF1A1E'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6'
                    e.currentTarget.style.color = '#6c757d'
                  }}>
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid #dee2e6',
                    borderRadius: '50%',
                    color: '#6c757d',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#AF1A1E'
                    e.currentTarget.style.color = '#AF1A1E'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6'
                    e.currentTarget.style.color = '#6c757d'
                  }}>
                    <i className="fa-brands fa-line"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Popular Search */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="footer-title mb-4" style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>
                {t('popular-search')}
              </h5>
              <ul className="footer-list" style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}properties/list?propertyType=condo&listingType=sale`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('condo-for-sale')}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}properties/list?propertyType=condo&listingType=rent`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('condo-for-rent')}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}properties/list?propertyType=villa&listingType=sale`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('pool-villa-for-sale')}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}properties/list?propertyType=villa&listingType=rent`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('pool-villa-for-rent')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="footer-title mb-4" style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>
                {t('quick-links')}
              </h5>
              <ul className="footer-list" style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}properties/list`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('property-for-sale')}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}about`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('about-us')}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}contact`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('contact-us')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Discover by Area */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="footer-title mb-4" style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>
                {t('discover-by-area')}
              </h5>
              <ul className="footer-list" style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}properties/list?zone=jomtien`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('jomtien')}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}properties/list?zone=wongamat`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('wongamat')}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}properties/list?zone=naklua`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('naklua')}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href={`/${locale !== 'th' ? locale + '/' : ''}properties/list?zone=pratumnak`}
                    style={{ color: '#6c757d', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    {t('pratumnak')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="row mt-4 pt-4" style={{ borderTop: '1px solid #e0e0e0' }}>
            <div className="col-lg-6 mb-3">
              <p className="mb-0" style={{ fontSize: '14px', color: '#6c757d' }}>
                {t('copyright')}
              </p>
            </div>
            <div className="col-lg-6 text-lg-end">
              <Link 
                href={`/${locale !== 'th' ? locale + '/' : ''}privacy`}
                style={{ color: '#6c757d', textDecoration: 'none', fontSize: '14px', marginRight: '20px', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                onMouseLeave={(e) => e.target.style.color = '#6c757d'}
              >
                {t('privacy')}
              </Link>
              <Link 
                href={`/${locale !== 'th' ? locale + '/' : ''}terms`}
                style={{ color: '#6c757d', textDecoration: 'none', fontSize: '14px', marginRight: '20px', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                onMouseLeave={(e) => e.target.style.color = '#6c757d'}
              >
                {t('terms')}
              </Link>
              <Link 
                href={`/${locale !== 'th' ? locale + '/' : ''}sitemap`}
                style={{ color: '#6c757d', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#AF1A1E'}
                onMouseLeave={(e) => e.target.style.color = '#6c757d'}
              >
                {t('sitemap')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default FooterHomeThree
