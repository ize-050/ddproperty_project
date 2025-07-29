'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import useDynamicTranslations from '@/hooks/useDynamicTranslations';
import Link from 'next/link';
import Image from 'next/image';

const DynamicAboutUs = () => {
  const locale = useLocale();
  const { translations, loading, error, t } = useDynamicTranslations('aboutus');

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Dynamic About Us translation error:', error);
    // Fallback to static content if dynamic translation fails
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <div className="breadcumb-list">
                  <Link href="/">{t('home_ab', 'Home')}</Link>
                  <span className="mx-2">/</span>
                  <span>{t('aboutus_ab', 'About Us')}</span>
                </div>
                <h1 className="title">{t('aboutus_ab', 'About Us')}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="our-about pb90">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-lg-6">
              <div className="about-box-1">
                <h2 className="title mb25">{t('aboutdluck_ab', 'About D-LUCK PROPERTY')}</h2>
                <p className="text mb25">{t('best_realestateab', 'Best Real Estate Agent in Pattaya Thailand')}</p>
                <div className="list-style1">
                  <p className="mb-3">{t('company_intro', 'D-LUCK PROPERTY specializes in Pattaya condo sales, rentals, and real estate investment. We cover all popular locations with professional services.')}</p>
                  
                  <div className="mb-4">
                    <h5 className="mb-2">{t('service_areas', 'Service Areas')}</h5>
                    <p className="text-muted">{t('service_areas', 'Central Pattaya | Jomtien | North Pattaya | Khao Phra Tamnak | Bang Saray | Na Kluea | Sattahip | Ban Amphoe')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-img">
                <Image
                  width={636}
                  height={500}
                  className="w-100 h-100 cover"
                  src="/images/about/about-1.jpg"
                  alt="About D-LUCK PROPERTY"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="our-features pb90">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-12">
              <div className="main-title text-center">
                <h2 className="title">{t('our_services_title', 'Our Services')}</h2>
                <p className="paragraph">
                  {t('ourexperienced_ab', 'Our experienced consultants are ready to make your property dreams come true.')}
                </p>
              </div>
            </div>
          </div>

          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-lg-6 offset-lg-3">
              <div className="about-box-1">
                <div className="row">
                  {/* Service 1 - Rental Management */}
                  <div className="col-12 mb-4">
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <div className="icon-circle" style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#f9edeb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Image src="/images/about/1.svg" alt="Rental Management" width={24} height={24} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>
                          {t('rental_management_service', 'Rental Management')}
                        </h5>
                        <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                          {t('rental_management_desc', 'Our expert management services protect your investment and optimize your revenue through strategic pricing, efficient operations, and tenant retention.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service 2 - Property Management */}
                  <div className="col-12 mb-4">
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <div className="icon-circle" style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#f9edeb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Image src="/images/about/2.svg" alt="Property Management" width={24} height={24} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>
                          {t('property_management_service', 'Property Management')}
                        </h5>
                        <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                          {t('property_management_desc', 'Reliable and efficient management for your valuable assets.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service 3 - Finance Real Estate */}
                  <div className="col-12 mb-4">
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <div className="icon-circle" style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#f9edeb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Image src="/images/about/3.svg" alt="Finance Real Estate" width={24} height={24} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>
                          {t('finance_realestate_service', 'Finance Realestate with Bank')}
                        </h5>
                        <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                          {t('finance_realestate_desc', 'Navigate property financing with trusted banking partners.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service 4 - Online Marketing */}
                  <div className="col-12 mb-4">
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <div className="icon-circle" style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#f9edeb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Image src="/images/about/4.svg" alt="Online Marketing" width={24} height={24} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>
                          {t('online_marketing_service', 'Online Marketing')}
                        </h5>
                        <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                          {t('online_marketing_desc', 'Maximize your property\'s visibility and reach the right audience online.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service 5 - Build-in & Decorate */}
                  <div className="col-12 mb-4">
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <div className="icon-circle" style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#f9edeb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Image src="/images/about/5.svg" alt="Build-in & Decorate" width={24} height={24} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>
                          {t('buildin_decorate_service', 'Build-in & Decorate')}
                        </h5>
                        <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                          {t('buildin_decorate_desc', 'Create your ideal space with our talented construction and interior design services.')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="#" className="ud-btn btn-dark">
                  Learn More
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="pb90">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-auto">
              <div
                className="main-title"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h2 className="title">{t('meetourdeam_ab', 'Meet Our Team')}</h2>
                <p className="paragraph">
                  {t('ourexperienced_ab', 'Our experienced consultants are ready to make your property dreams come true.')}
                </p>
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            {/* Team Member 1 - Oat */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team-member text-center">
                <div className="team-img mb-3">
                  <Image
                    src="/images/staff/oat.jpg"
                    alt={t('oat_supakornab', 'Oat - Supakorn')}
                    width={200}
                    height={200}
                    className="rounded-circle"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h5 className="member-name">{t('oat_supakornab', 'Oat - Supakorn')}</h5>
                <p className="member-position text-muted">{t('ceo_founderab', 'CEO & Founder')}</p>
              </div>
            </div>

            {/* Team Member 2 - Amy */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team-member text-center">
                <div className="team-img mb-3">
                  <Image
                    src="/images/staff/amy.jpg"
                    alt={t('amy_thannareeab', 'Amy - Thannaree')}
                    width={200}
                    height={200}
                    className="rounded-circle"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h5 className="member-name">{t('amy_thannareeab', 'Amy - Thannaree')}</h5>
                <p className="member-position text-muted">{t('sale_directorab', 'Sale Director')}</p>
              </div>
            </div>

            {/* Team Member 3 - Ize */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team-member text-center">
                <div className="team-img mb-3">
                  <Image
                    src="/images/staff/ize.jpg"
                    alt={t('ize_chanyapakab', 'Ize - Chanyapak')}
                    width={200}
                    height={200}
                    className="rounded-circle"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h5 className="member-name">{t('ize_chanyapakab', 'Ize - Chanyapak')}</h5>
                <p className="member-position text-muted">{t('sale_managerab', 'Sale Manager')}</p>
              </div>
            </div>

            {/* Team Member 4 - Bamboo */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team-member text-center">
                <div className="team-img mb-3">
                  <Image
                    src="/images/staff/bamboo.jpg"
                    alt={t('bamboo_kunyalukab', 'Bamboo - Kunyaluk')}
                    width={200}
                    height={200}
                    className="rounded-circle"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h5 className="member-name">{t('bamboo_kunyalukab', 'Bamboo - Kunyaluk')}</h5>
                <p className="member-position text-muted">{t('onlinemedia_designab', 'Online Media Design')}</p>
              </div>
            </div>

            {/* Team Member 5 - Min */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team-member text-center">
                <div className="team-img mb-3">
                  <Image
                    src="/images/staff/min.jpg"
                    alt={t('min_wanvisaab', 'Min - Wanvisa')}
                    width={200}
                    height={200}
                    className="rounded-circle"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h5 className="member-name">{t('min_wanvisaab', 'Min - Wanvisa')}</h5>
                <p className="member-position text-muted">{t('rental_managementab', 'Rental Management')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DynamicAboutUs;
