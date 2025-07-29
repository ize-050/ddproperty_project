import React, { useState, useEffect } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";
import usePropertyFilterStore from '@/store/usePropertyFilterStore';
import { useSearchParams } from "next/navigation";
import AdvanceFilterContent from "./AdvancedFilterContent";
import useDynamicTranslations from '@/hooks/useDynamicTranslations';

export default function HeroSearchBar({
  onSearch,
  initialType = "CONDO",
  initialListingType = "SALE",
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const searchParams = useSearchParams();
  const {advancedSearchVisible,setAdvancedSearchVisible} = usePropertyFilterStore();
 
  // ดึงค่า type จาก URL parameters
  const typeParam = searchParams.get('type');
  const [searchQuery, setSearchQuery] = useState('');

  // กำหนด initial listing type จาก URL parameter ถ้ามี
  const getInitialListingType = () => {
    if (typeParam === 'rent') return "RENT";
    if (typeParam === 'sale') return "SALE";
    return initialListingType;
  };

  const { t } = useDynamicTranslations('listing');

  const tabs = [
    { id: "buy", label: t('buy', 'Buy') },
    { id: "rent", label: t('rent', 'Rent') },
  ];

  const [listingType, setListingType] = useState(getInitialListingType());

  // อัพเดต listingType เมื่อ URL parameters เปลี่ยน
  useEffect(() => {
    if (typeParam === 'rent') {
      setListingType("RENT");
      setActiveTab("rent");
    } else if (typeParam === 'buy') {
      setListingType("SALE");
      setActiveTab("buy");
    }
  }, [typeParam]);

  // Sync listingType with filter store if needed
  // (ถ้าต้องการเก็บ listingType ใน filter store ให้เพิ่ม field และ setter ใน usePropertyFilterStore)

  const handleSearch = () => {
    console.log('HeroSearchBar handleSearch called with:', {
      listingType,
      searchQuery,
    });
    
    onSearch({
      listingType,
      searchQuery,
    });
  };

 

  

  const [activeTab, setActiveTab] = useState(typeParam === 'rent' ? "rent" : "buy");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // Update listing type based on tab
    let newListingType;
    if (tab === "buy") {
      newListingType = "SALE";
      setListingType("SALE");
    } else if (tab === "rent") {
      newListingType = "RENT";
      setListingType("RENT");
    }
    
    // Automatically trigger search when tab changes
    if (newListingType) {
      console.log('Tab changed, triggering search with listingType:', newListingType);
      onSearch({
        listingType: newListingType,
        searchQuery,
      });
    }
  };

  return (
    <>
      <div className="inner-banner-style1 text-center">
        <h2 className="hero-title animate-up-1 ">{t('find-your-dream-home', 'Find Your Dream Home')}</h2>
        <p className="hero-text fz15 animate-up-2">
          {t('apartments-available-text', "We've more than 745,000 apartments, place & plot.")}
        </p> 
      </div>



      {advancedSearchVisible && (
        <div className="advance-feature-modal">
          <div
            className="modal fade show d-block"
            id="advanceSeachModal"
            tabIndex={-1}
            aria-labelledby="advanceSeachModalLabel"
            aria-hidden="false"
            style={{paddingRight: '15px'}}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{maxWidth: '800px'}}>
              <div className="modal-content">
                <AdvanceFilterContent 
                  onClose={() => setAdvancedSearchVisible(false)} 
                  onSearch={onSearch}
                  type={typeParam} 
                />
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

   

      <div className="advance-search-tab mt30  mx-auto animate-up-3">
        <ul className="nav nav-tabs p-0 m-0">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          {tabs.map((tab) => (
            <div
              className={`${activeTab === tab.id ? "active" : ""} tab-pane`}
              key={tab.id}
            >
              <div className="advance-content-style1">
                <div className="row">
                  <div className="col-md-8 col-lg-9">
                    <div className="advance-search-field position-relative text-start">
                      <form className="form-search position-relative">
                        <div className="box-search">
                          <span className="icon flaticon-home-1" />
                          <input
                            className="form-control bgc-f7 bdrs12"
                            type="text"
                            name="search"
                            placeholder={tab.id === 'buy' ? t('search-for-buy', 'Search for Buy...') : t('search-for-rent', 'Search for Rent...')}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* End .col-md-8 */}

                  <div className="col-md-4 col-lg-3">
                    <div className="d-flex align-items-center justify-content-start justify-content-md-center mt-3 mt-md-0">
                      <button
                        className="advance-search-btn"
                        type="button"
                        onClick={() => setAdvancedSearchVisible(true)}
                      >
                        <span className="flaticon-settings" /> {t('advanced', 'Advanced')}
                      </button>
                      <button
                        className="advance-search-icon ud-btn btn-dark ms-4"
                        type="button"
                        onClick={handleSearch}
                      >
                        <span className="flaticon-search" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          ))}
          
        </div>


      

      </div>


    </>
  );
}
