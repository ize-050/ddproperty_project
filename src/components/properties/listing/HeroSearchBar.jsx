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
      {/* Title Section */}
      <div className="text-center mb-40">
        <h2 className="hero-title" style={{ 
          fontSize: '48px', 
          fontWeight: '700', 
          color: 'white',
          marginBottom: '15px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {t('find-your-property', 'Find Your Property')}
        </h2>
        <p className="hero-text" style={{ 
          fontSize: '16px', 
          color: 'rgba(255,255,255,0.9)',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {t('apartments-available-text', "We've more than 745,000 apartments, place & plot.")}
        </p> 
      </div>

      {/* Advanced Filter Modal */}
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

      {/* Filter Box - Custom Style */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Buy/Rent Tabs - Separate from filter box */}
        <div style={{ 
          display: 'inline-flex',
          gap: '0',
          marginBottom: '0',
          backgroundColor: 'white',
          borderRadius: '8px 8px 0 0',
          padding: '0',
          overflow: 'hidden'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? '#1a1a1a' : '#999',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #1a1a1a' : '3px solid transparent',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0 12px 12px 12px',
          padding: '25px 30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          {tabs.map((tab) => activeTab === tab.id && (
            <form key={tab.id} onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="row gx-3 align-items-end">
                {/* Property Type */}
                <div className="col-lg-2 col-md-6 mb-3 mb-lg-0" style={{ maxWidth: '200px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    color: '#aaa', 
                    marginBottom: '8px',
                    fontWeight: '400'
                  }}>
                    Property Type
                  </label>
                  <select 
                    className="form-select"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #e0e0e0',
                      borderRadius: '0',
                      padding: '10px 0',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1a1a1a',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <option value="">Condominium</option>
                    <option value="condo">Condominium</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                
                {/* Price */}
                <div className="col-lg-2 col-md-6 mb-3 mb-lg-0" style={{ maxWidth: '200px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    color: '#aaa', 
                    marginBottom: '8px',
                    fontWeight: '400'
                  }}>
                    Price
                  </label>
                  <select 
                    className="form-select"
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #e0e0e0',
                      borderRadius: '0',
                      padding: '10px 0',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1a1a1a',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <option value="">Select Price</option>
                    <option value="0-1000000">Under 1M</option>
                    <option value="1000000-5000000">1M - 5M</option>
                    <option value="5000000-10000000">5M - 10M</option>
                    <option value="10000000-999999999">Above 10M</option>
                  </select>
                </div>
                
                {/* Location */}
                <div className="col-lg-2 col-md-6 mb-3 mb-lg-0" style={{ maxWidth: '200px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    color: '#aaa', 
                    marginBottom: '8px',
                    fontWeight: '400'
                  }}>
                    Location
                  </label>
                  <select 
                    className="form-select"
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #e0e0e0',
                      borderRadius: '0',
                      padding: '10px 0',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1a1a1a',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <option value="">Jomtien</option>
                    <option value="jomtien">Jomtien</option>
                    <option value="wongamat">Wongamat</option>
                    <option value="naklua">Naklua</option>
                    <option value="pratumnak">Pratumnak</option>
                    <option value="central-pattaya">Central Pattaya</option>
                  </select>
                </div>
                
                {/* Property Quota */}
                <div className="col-lg-2 col-md-6 mb-3 mb-lg-0" style={{ maxWidth: '200px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    color: '#aaa', 
                    marginBottom: '8px',
                    fontWeight: '400'
                  }}>
                    Property Quaota
                  </label>
                  <select 
                    className="form-select"
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #e0e0e0',
                      borderRadius: '0',
                      padding: '10px 0',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1a1a1a',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <option value="">Thai Quaota</option>
                    <option value="thai">Thai Quaota</option>
                    <option value="foreign">Foreign Quaota</option>
                  </select>
                </div>
                
                {/* Buttons */}
                <div className="col-lg-4">
                  <div className="d-flex align-items-center justify-content-end" style={{ gap: '12px' }}>
                    <button 
                      type="button"
                      onClick={() => setAdvancedSearchVisible(true)}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '1px solid #e0e0e0',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#666'
                      }}
                    >
                      <i className="fa-light fa-sliders-up"></i>
                    </button>
                    <button 
                      type="submit"
                      style={{
                        backgroundColor: '#AF1A1E',
                        color: 'white',
                        border: 'none',
                        padding: '14px 45px',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      SEARCH
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ))}
        </div>
      </div>
    </>
  );
}
