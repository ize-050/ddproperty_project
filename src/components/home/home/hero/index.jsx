"use client";
import AdvanceFilterContent from "@/components/properties/listing/AdvancedFilterContent";
import HeroContent from "./HeroContent";
import Image from "next/image";
import React from "react";
import usePropertyFilterStore from "@/store/usePropertyFilterStore";
import { useRouter } from "next/navigation";

import useTranslation from '@/hooks/useTranslation';

const Hero = ({ propertyTypes }) => {
  const { getString } = useTranslation('en');
  const router = useRouter();

  // Use store for modal state
  const { advancedSearchVisible, setAdvancedSearchVisible, searchParams } = usePropertyFilterStore();


  // Handle search from advanced modal
  const handleAdvancedSearchSubmit = (filters) => {
    console.log("filters", filters);
    // Create search params from filters
    const searchParams = new URLSearchParams();

    // Add filters from advanced search
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        searchParams.append(key, value);
      }
    });

    // Close modal and navigate to search results
    setAdvancedSearchVisible(false);
    router.push(`/properties/list?${searchParams.toString()}`);
  };

  const handleCloseAdvancedModal = () => {
    setAdvancedSearchVisible(false);
  };

  console.log("getString", getString('title'))
  return (

    <>
      {/* Background Banner Image */}
      <div className="hero-banner-wrapper">
        <Image
          src="/images/banner/banner.png"
          alt="D-Luck Property Banner"
          fill
          priority
          className="hero-banner-image"
        />
      </div>

      <div className="col-lg-6 col-xl-6">
        <div className="inner-banner-style8">
          <h6 className="hero-sub-title animate-up-1">{getString('welcome')}</h6>
          <h2 className="hero-title animate-up-2">{getString('d_luck')}</h2>
          <p className="hero-text fz15 animate-up-3">
            {getString('title')}

            
          </p>
          <p className="hero-text fz15 animate-up-3">
            {getString('subtitle')}
          </p>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <HeroContent propertyTypes={propertyTypes} />
      </div>

      {/* <!-- Advance Feature Modal Start --> */}
      {advancedSearchVisible && (
        <div className="advance-feature-modal">
          <div
            className="modal fade show d-block"
            id="advanceSeachModal"
            tabIndex={-1}
            aria-labelledby="advanceSeachModalLabel"
            aria-hidden="false"
            style={{ paddingRight: '15px' }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '800px' }}>
              <div className="modal-content">
                <AdvanceFilterContent
                  onClose={() => setAdvancedSearchVisible(false)}
                  onSearch={handleAdvancedSearchSubmit}
                  type={'sale'}
                />
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
      <style jsx global>{`
        .home-banner-style8 {
          position: relative;
          overflow: hidden;
          padding: 0;
        }

        .hero-banner-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .hero-banner-image {
          object-fit: cover;
          object-position: center;
        }

        .inner-banner-style8 {
          position: relative;
          z-index: 1;
          //padding: 120px 0 50px;
        }

        .inner-banner-style8 .hero-sub-title,
        .inner-banner-style8 .hero-title,
        .inner-banner-style8 .hero-text {
            color:#fff;
        }

        .inner-banner-style8 .hero-sub-title {
          color:#fff;
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .inner-banner-style8 .hero-title {
            color:#fff;
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 15px;
          word-wrap: break-word;
          max-width: 100%;
        }
        
        @media (max-width: 767px) {
          .inner-banner-style8 .hero-title {
            font-size: 32px;
          }
          
          .search-form-wrapper {
              
            padding: 15px !important;
          }
          
          .home-eight .inner-banner-style8 .container-fluid {
              
            padding-left: 15px;
            padding-right: 15px;
          }
        }
        
        @media (max-width: 480px) {
          .inner-banner-style8 .hero-title {
            font-size: 28px;
          }
          
          .inner-banner-style8 {
            padding: 50px 0 0;
          }
          
          .tab-pane {
            width: 100%;
            overflow-x: hidden;
          }
          
          .home-eight .search-box-wrapper {
            width: 100%;
          }
          
          .home-eight .search-box-wrapper .nav-tabs {
            display: flex;
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
          }
          
          .home-eight .search-box-wrapper .nav-tabs::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Edge */
          }
        }
        
        .home-eight .inner-banner-style8 .search-box-wrapper {
          margin-top: 30px;
        }
      `}</style>
    </>
  );
};

export default Hero;
