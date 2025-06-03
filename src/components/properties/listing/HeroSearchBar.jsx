import React, { useState, useEffect } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";
import AdvancedFilterModal from "./AdvancedFilterModal";
import AdvancedFilterContent from "./AdvancedFilterContent";
import usePropertyFilterStore from '@/store/usePropertyFilterStore';
import { useSearchParams } from "next/navigation";

export default function HeroSearchBar({
  onSearch,
  initialType = "CONDO",
  initialListingType = "SALE",
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const searchParams = useSearchParams();
  const {
    propertyType,
    minPrice,
    maxPrice,
    zoneId,
    bedrooms,
    bathrooms,
    setPropertyType,
    setMinPrice,
    setMaxPrice,
    setZoneId,
    setBedrooms,
    setBathrooms,
    resetFilters
  } = usePropertyFilterStore();
  
  // ดึงค่า type จาก URL parameters
  const typeParam = searchParams.get('type');
  
  // กำหนด initial listing type จาก URL parameter ถ้ามี
  const getInitialListingType = () => {
    if (typeParam === 'rent') return "RENT";
    if (typeParam === 'sale') return "SALE";
    return initialListingType;
  };
  
  const [listingType, setListingType] = useState(getInitialListingType());
  
  // อัพเดต listingType เมื่อ URL parameters เปลี่ยน
  useEffect(() => {
    if (typeParam === 'rent') {

      setListingType("RENT");
    } else if (typeParam === 'sale') {
      setListingType("SALE");
    }
  }, [typeParam]);

  // Sync listingType with filter store if needed
  // (ถ้าต้องการเก็บ listingType ใน filter store ให้เพิ่ม field และ setter ใน usePropertyFilterStore)

  const handleSearch = () => {
    onSearch && onSearch({
      listingType,
      propertyType,
      minPrice,
      maxPrice,
      zoneId,
      bedrooms,
      bathrooms
    });
  };

  return (
    <div className="hero-search-bar">
      <div className="search-tabs">
        <button
          className={`tab-btn${listingType === "SALE" ? " active" : ""}`}
          onClick={() => setListingType("SALE")}
        >
          Buy
        </button>
        <button
          className={`tab-btn${listingType === "RENT" ? " active" : ""}`}
          onClick={() => setListingType("RENT")}
        >
          Rent
        </button>
      </div>
      <div className="search-main">
        <input
          className="search-input"
          type="text"
          value={(() => {
            const pt = [
              { value: 'CONDO', label: 'Condominium' },
              { value: 'HOUSE', label: 'House' },
              { value: 'TOWNHOUSE', label: 'Townhouse' },
              { value: 'VILLA', label: 'Villa' },
              { value: 'LAND', label: 'Land' },
              { value: 'APARTMENT', label: 'Apartment' },
              { value: 'COMMERCIAL', label: 'Commercial' },
              { value: 'OFFICE', label: 'Office' },
              { value: 'RETAIL', label: 'Retail' },
              { value: 'WAREHOUSE', label: 'Warehouse' },
              { value: 'FACTORY', label: 'Factory' },
              { value: 'HOTEL', label: 'Hotel' },
              { value: 'RESORT', label: 'Resort' },
            ];
            return pt.find((p) => p.value === propertyType)?.label || "";
          })()}
          placeholder="Condominium"
          readOnly
          style={{ cursor: "pointer" }}
          onClick={() => setAdvancedOpen(true)}
        />
        <button className="advanced-btn" type="button" onClick={() => setAdvancedOpen(true)}>
          <FiMenu size={18} style={{ marginRight: 6 }} /> Advanced
        </button>
        <AdvancedFilterModal open={advancedOpen} onClose={() => setAdvancedOpen(false)}>
          <AdvancedFilterContent onClose={() => setAdvancedOpen(false)} type={typeParam}  />
        </AdvancedFilterModal>
        <button
          className="search-btn"
          type="button"
          onClick={handleSearch}
        >
          <FiSearch size={22} />
        </button>
      </div>
    </div>
  );
}
