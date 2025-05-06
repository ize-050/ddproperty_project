
import CallToActions from "@/components/common/CallToActions";
import Mission from "@/components/pages/about/Mission";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const Agents = dynamic(() => import("@/components/about/Agents"), { ssr: false });
export const metadata = {
  title: "About  || Homez - Real Estate NextJS Template",
};

const About = () => {
  return (
    <>
      <section className="breadcumb-section2 p-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">About Us</h2>
                <div className="breadcumb-list">
                  <a href="#">Home</a>
                  <a href="#">About</a>
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
                About D-LUCK PROPERTY
              </h2>
              <p className="subtitle">Real Estate Agent in Pattaya, Thailand</p>
            </div>
            <div className="col-lg-6">
              <p className="text mb25">
                D-LUCK PROPERTY is located in Pattaya, Thailand.
              </p>
              <p className="text mb25">
                D-LUCK PROPERTY helps you to find properties and condominium for all area in Central Pattaya, Jomtien, North Pattaya, Pratumnak Hill, Bang Saray, East Pattaya, Baan Amphur, Naklua and Sattahip.
              </p>
              <p className="text mb25">
                D-LUCK PROPERTY believes that Pattaya and EEC Area as a whole, is an area that is quickly becoming an international destination city. But Pattaya has its own unique appeal and style. The Pattaya culture is one that you cannot find anywhere else in the world; it is a gateway city to so many countries, is multicultural and diverse and has such amazing people. The economy is strong, tourism is excellent, and our real estate is highly valued. We are, after all, in one of the best location in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-0 container" style={{ backgroundColor: '#FFF8F6' }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-6 p-5">
              <h2 className="title mb-5">Our Services</h2>
              
              <div className="row">
                {/* Service 1 */}
                <div className="col-12 mb-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <img src="/images/icons/rental-management.svg" alt="Rental Management" width="30" height="30" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>Rental Management</h5>
                      <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>Our expert management services protect your investment and optimize your revenue through strategic pricing, efficient operations, and tenant retention.</p>
                    </div>
                  </div>
                </div>
                
                {/* Service 2 */}
                <div className="col-12 mb-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <img src="/images/icons/property-management.svg" alt="Property Management" width="30" height="30" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>Property Management</h5>
                      <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>Reliable and efficient management for your valuable assets.</p>
                    </div>
                  </div>
                </div>
                
                {/* Service 3 */}
                <div className="col-12 mb-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <img src="/images/icons/finance.svg" alt="Finance Realestate with Bank" width="30" height="30" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>Finance Realestate with Bank</h5>
                      <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>Navigate property financing with trusted banking partners.</p>
                    </div>
                  </div>
                </div>
                
                {/* Service 4 */}
                <div className="col-12 mb-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <img src="/images/icons/online-marketing.svg" alt="Online Marketing" width="30" height="30" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>Online Marketing</h5>
                      <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>Maximize your property's visibility and reach the right audience online.</p>
                    </div>
                  </div>
                </div>
                
                {/* Service 5 */}
                <div className="col-12 mb-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <img src="/images/icons/build-decorate.svg" alt="Build-in & Decorate" width="30" height="30" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1 fw-bold" style={{ fontSize: '16px' }}>Build-in & Decorate</h5>
                      <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>Create your ideal space with our talented construction and interior design services.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 col-md-6 p-0">
              <img 
                src="/images/about/about-us-service.png" 
                alt="Our Services" 
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* End Our Services */}

      {/* Exclusive Agents */}
      <section className="pb90">
        <div className="container">
          <div className="row  justify-content-center">
            <div className="col-auto">
              <div
                className="main-title"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h2 className="title">Meet Our Team</h2>
                <p className="paragraph">
                  Meet our Profession Team to Support you
                </p>
              </div>
            </div>
            {/* End header */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
              <div className="property-city-slider w-100 h-100" >
                <Agents />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Exclusive Agents */}



    </>
  );
};

export default About;
