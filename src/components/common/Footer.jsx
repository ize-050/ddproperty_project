"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FaFacebookF, FaTiktok, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '30px 0 20px' }}>
      <div className="container">
        <div className="row align-items-center mb-4">
          {/* Logo ด้านซ้าย */}
          <div className="col-md-6">
            <Link href="/">
              <Image
                width={138}
                height={50}
                src="/images/logo/logo_footer.png"
                alt="D'Luck Property"
              />
            </Link>
          </div>
          {/* Social Media Icons ด้านขวา */}
          <div className="col-md-6">
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ color: 'white' }}>
                <FaFacebookF />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" style={{ color: 'white' }}>
                <FaTiktok />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: 'white' }}>
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider line */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '30px' }}></div>
        
        <div className="row">
          {/* Popular Search */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 style={{ color: 'white', fontSize: '16px', marginBottom: '15px' }}>{t('popularSearch')}</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?type=sale&propertyType=Condo" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('condoForSale')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?type=rent&propertyType=Condo" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('condoForRent')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?type=sale&propertyType=Pool Villa" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('poolVillaForSale')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?type=rent&propertyType=Pool Villa" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('poolVillaForRent')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?type=sale&propertyType=HOUSE" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('houseForSale')}</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 style={{ color: 'white', fontSize: '16px', marginBottom: '15px' }}>{t('quickLinks')}</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?type=sale" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('propertyForSale')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('aboutUs')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/contact" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('contactUs')}</Link>
              </li>
            </ul>
          </div>

          {/* Discover by Area */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 style={{ color: 'white', fontSize: '16px', marginBottom: '15px' }}>{t('discoverByArea')}</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?zoneId=1" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('jomtien')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?zoneId=2" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('wongamat')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?zoneId=3" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('naklua')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?zoneId=4" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('pratumnak')}</Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/properties/list?zoneId=5" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('banglamung')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info and Newsletter */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: 'white', fontSize: '16px', marginBottom: '10px' }}>{t('callUsNow')}</h5>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>+66(0)38 543 2345</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: 'white', fontSize: '16px', marginBottom: '10px' }}>{t('dropEmail')}</h5>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>info@d-luckproperty.com</p>
            </div>
            
            <div>
              <h5 style={{ color: 'white', fontSize: '16px', marginBottom: '10px' }}>{t('getPromoWithNewsletter')}</h5>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '5px',
                overflow: 'hidden',
                marginTop: '15px'
              }}>
                <button 
                  type="submit" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 15px', 
                    backgroundColor: 'white', 
                    color: '#1a1a1a', 
                    border: 'none', 
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {t('subscribe')}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', marginTop: '10px' }}>
          <div className="row">
            <div className="col-md-6">
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>© 2019 by D&apos;LUCK PROPERTY</p>
            </div>
            <div className="col-md-6">
              <ul style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', margin: 0, padding: 0, listStyle: 'none' }}>
                <li>
                  <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('privacy')}</Link>
                </li>
                <li>
                  <Link href="/terms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('terms')}</Link>
                </li>
                <li>
                  <Link href="/sitemap" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>{t('sitemap')}</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
