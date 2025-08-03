"use client";
import Link from "next/link";
import useSimpleTranslations from "@/hooks/useSimpleTranslations";
import dynamic from "next/dynamic";

const Agents = dynamic(() => import("@/components/about/Agents"), { ssr: false });

const AboutContent = () => {
  const { t, loading, error } = useSimpleTranslations('aboutus');

  if (loading) {
    return (
      <>
        {/* Loading skeleton for About page */}
        <section className="breadcumb-section2 p-0">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcumb-style1">
                  <div className="placeholder-glow">
                    <h2 className="title placeholder col-4"></h2>
                    <div className="breadcumb-list">
                      <span className="placeholder col-2 me-2"></span>
                      <span className="placeholder col-2"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="our-about pb90">
          <div className="container">
            <div className="row" data-aos="fade-up" data-aos-delay="300">
              <div className="col-lg-6">
                <div className="placeholder-glow">
                  <h2 className="placeholder col-8 mb-3"></h2>
                  <p className="placeholder col-10"></p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="placeholder-glow">
                  <p className="placeholder col-12 mb-3"></p>
                  <p className="placeholder col-10"></p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="pt30 pb-0">
          <div className="cta-banner3 bgc-thm-light mx-auto maxw1600 pt100 pt60-lg pb90 pb60-lg bdrs24 position-relative overflow-hidden mx20-lg">
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-lg-5 pl30-md pl15-xs">
                  <div className="placeholder-glow">
                    <h2 className="placeholder col-8 mb-4"></h2>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="d-flex align-items-start mb-4">
                        <div className="flex-shrink-0 me-3">
                          <div className="placeholder" style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%'
                          }}></div>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="placeholder col-6 mb-2"></h5>
                          <p className="placeholder col-10"></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="pb90">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-auto">
                <div className="main-title text-center">
                  <div className="placeholder-glow">
                    <h2 className="placeholder col-6 mx-auto mb-3"></h2>
                    <p className="placeholder col-8 mx-auto"></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row mt-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="col-lg-4 col-md-4 mb-4">
                  <div className="text-center">
                    <div className="placeholder-glow">
                      <div className="placeholder mx-auto mb-3" style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '12px'
                      }}></div>
                      <h6 className="placeholder col-6 mx-auto mb-2"></h6>
                      <p className="placeholder col-4 mx-auto"></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    console.error('Translation error:', error);
  }

  return (
    <>
      <section className="breadcumb-section2 p-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style">
                <h2 className="title">{t('aboutus_ab', 'About Us')}</h2>
                <div className="breadcumb-list">
                  <a href="#">{t('home_ab', 'Home')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcrumb Sections */}

      {/* Our About Area */}
      <section className="our-about pb90">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-lg-6">
              <h2>
                {t('aboutdluck_ab', 'About D-LUCK PROPERTY')}
              </h2>
              <p className="subtitle">{t('best_realestateab', 'Best Real Estate Agent in Pattaya Thailand')}</p>
            </div>
            <div className="col-lg-6">
              <p className="text mb25">
                {t('company_intro', 'D-LUCK PROPERTY specializes in Pattaya condo sales, rentals, and real estate investment. We cover all popular locations with professional services.')}
              </p>
              <p className="text mb25">
                {t('service_areas', 'Central Pattaya | Jomtien | North Pattaya | Khao Phra Tamnak | Bang Saray | Na Kluea | Sattahip | Ban Amphoe')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt30 pb-0">
        <div className="cta-banner3 bgc-thm-light mx-auto maxw1600 pt100 pt60-lg pb90 pb60-lg bdrs24 position-relative overflow-hidden mx20-lg">
          <div className="container">
            <div className="row">
              <div
                className="col-md-6 col-lg-5 pl30-md pl15-xs"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="mb30">
                  <h2 className="title text-capitalize">
                    {t('lets-find-right-selling-option', 'Let&apos;s find the right selling option for you')}
                  </h2>
                </div>
                <div className="why-chose-list style2">
                  <div className="row">
                    {/* Service 1 */}
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
                            <img src="/images/about/1.svg" alt="Rental Management" width="24" height="24" />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>{t('rental_management_service', 'Rental Management')}</h5>
                          <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>{t('rental_management_desc', 'Our expert management services protect your investment and optimize your revenue through strategic pricing, efficient operations, and tenant retention.')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Service 2 */}
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
                            <img src="/images/about/2.svg" alt="Property Management" width="24" height="24" />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>{t('property_management_service', 'Property Management')}</h5>
                          <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>{t('property_management_desc', 'Reliable and efficient management for your valuable assets.')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Service 3 */}
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
                            <img src="/images/about/3.svg" alt="Finance Realestate with Bank" width="24" height="24" />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>{t('finance_realestate_service', 'Finance Realestate with Bank')}</h5>
                          <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>{t('finance_realestate_desc', 'Navigate property financing with trusted banking partners.')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Service 4 */}
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
                            <img src="/images/about/4.svg" alt="Online Marketing" width="24" height="24" />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>{t('online_marketing_service', 'Online Marketing')}</h5>
                          <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>{t('online_marketing_desc', 'Maximize your property\'s visibility and reach the right audience online.')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Service 5 */}
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
                            <img src="/images/about/5.svg" alt="Build-in & Decorate" width="24" height="24"  />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>{t('buildin_decorate_service', 'Build-in & Decorate')}</h5>
                          <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>{t('buildin_decorate_desc', 'Create your ideal space with our talented construction and interior design services.')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <Link href="#" className="ud-btn btn-dark">
                  Learn More
                  <i className="fal fa-arrow-right-long" />
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Our Services */}

      <section className="pb90">
        <div className="container">
          <div className="row  justify-content-center">
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
            {/* End header */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
              <div className="property-city-slider">
                <Agents />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutContent;
