"use client";
import AdvanceFilterModal from "@/components/common/advance-filter";
import HeroContent from "./HeroContent";
import Image from "next/image";

const Hero = () => {
  return (
    <>
      {/* Background Banner Image */}
     

      <div className="col-lg-6 col-xl-6">
        <div className="inner-banner-style8">
          <h6 className="hero-sub-title animate-up-1">WELCOME TO</h6>
          <h2 className="hero-title animate-up-2">D-LUCK PROPERTY</h2>
          <p className="hero-text fz15 animate-up-3">
            THE BEST WEBSITE IN PATTAYA THAILAND
          </p>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <HeroContent />
      </div>

      {/* <!-- Advance Feature Modal Start --> */}
      <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal />
        </div>
      </div>
      {/* <!-- Advance Feature Modal End --> */}

      {/* Add CSS for the hero banner */}
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
          padding: 120px 0 50px;
        }

        .inner-banner-style8 .hero-sub-title,
        .inner-banner-style8 .hero-title,
        .inner-banner-style8 .hero-text {
          color: #ffffff;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }

        .inner-banner-style8 .hero-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .advance-search-tab {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

export default Hero;
