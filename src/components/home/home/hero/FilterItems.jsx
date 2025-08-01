"use client";
import SelectWithInstanceId from "@/components/common/SelectWithInstanceId";
import Slider, { Range } from "rc-slider";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useRouter, usePathname } from "next/navigation";
import useZoneStore from "@/store/useZoneStore";
import Select from "react-select";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const catOptions = [
  { value: "CONDO", label: "Condominium" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "HOUSE", label: "House" },
];

const FilterItems = forwardRef(({ listingType = "sale", propertyTypes }, ref) => {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('home');
  const { zones } = useZoneStore();
  
  // Helper function to format numbers with commas (display only)
  const formatNumberWithCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // กำหนดช่วงราคาแยกตาม listingType
  const getPriceRangeByType = (type) => {
    if (type === 'rent') {
      return {
        min: 5000,      // 5,000 บาท
        max: 1000000,    // 100,000 บาท
        default: [5000, 300000]  // 10,000 - 30,000 บาท
      };
    } else {
      // sale หรือ default
      return {
        min: 700000,    // 500,000 บาท
        max: 400000000,  // 20,000,000 บาท
        default: [700000, 20000000]  // 1,000,000 - 5,000,000 บาท
      };
    }
  };
  
  const currentPriceRange = getPriceRangeByType(listingType);
  const [price, setPrice] = useState(currentPriceRange.default);
  const [minPrice, setMinPrice] = useState(currentPriceRange.default[0]);
  const [maxPrice, setMaxPrice] = useState(currentPriceRange.default[1]);
  

  // สร้าง state สำหรับควบคุมการแสดง/ซ่อน dropdown
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isPropertyTypeDropdownOpen, setIsPropertyTypeDropdownOpen] = useState(false);

  // สร้าง state สำหรับเก็บค่าที่เลือก
  const [selectedPropertyType, setSelectedPropertyType] = useState(catOptions[0]);
  const [selectedZone, setSelectedZone] = useState(null);
  
  // useEffect เพื่อ reset ราคาเมื่อ listingType เปลี่ยน
  useEffect(() => {
    const newPriceRange = getPriceRangeByType(listingType);
    setPrice(newPriceRange.default);
    setMinPrice(newPriceRange.default[0]);
    setMaxPrice(newPriceRange.default[1]);
  }, [listingType]);

  // price range handler
  const handleOnChange = (value) => {
    setPrice(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };

  // ฟังก์ชันปิด dropdown อื่นๆ เมื่อเปิด dropdown ใหม่
  const handlePriceDropdownToggle = () => {
    setIsPriceDropdownOpen(!isPriceDropdownOpen);
    setIsPropertyTypeDropdownOpen(false); // ปิด property type dropdown
  };

  const handlePropertyTypeDropdownToggle = () => {
    setIsPropertyTypeDropdownOpen(!isPropertyTypeDropdownOpen);
    setIsPriceDropdownOpen(false); // ปิด price dropdown
  };




  // property type options

  const propertyTypeOptions = propertyTypes.map((propertyType) => {
    // Map locale to correct field name for property types
    let fieldName = 'nameEn'; // default fallback
    switch (locale) {
      case 'th':
        fieldName = 'nameTh';
        break;
      case 'zh':
        fieldName = 'nameCh'; // จีนใช้ nameCh ไม่ใช่ nameZh
        break;
      case 'ru':
        fieldName = 'nameRu';
        break;
      default:
        fieldName = 'nameEn';
    }
    
    return {
      value: propertyType.name,
      label: propertyType[fieldName] || propertyType.nameEn || propertyType.name,
    };
  });

  const locationOptions = zones.map((zone) => {
    // Map locale to correct field name for zones
    let fieldName = 'name_en'; // default fallback
    switch (locale) {
      case 'th':
        fieldName = 'name_th';
        break;
      case 'zh':
        fieldName = 'name_ch'; // จีนใช้ name_ch ไม่ใช่ name_zh
        break;
      case 'ru':
        fieldName = 'name_ru';
        break;
      default:
        fieldName = 'name_en';
    }
    
    return {
      value: zone.id,
      label: zone[fieldName] || zone.name_en || zone.name_th,
    };
  });

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: '#6b7280',
      cursor: 'pointer',
      backgroundColor: state.isSelected ? '#eb6753' : state.isFocused ? '#f3f4f6' : 'white',
      ':hover': {
        backgroundColor: '#f3f4f6',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 99999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 99999,
    }),
  };

  // ฟังก์ชันสำหรับการค้นหา
  const handleSearch = () => {
    // สร้าง query parameters สำหรับการค้นหา
    const queryParams = new URLSearchParams();

    // เพิ่มพารามิเตอร์ต่างๆ
    if (selectedPropertyType) {
      queryParams.append('propertyType', selectedPropertyType.value);
    }

    queryParams.append('minPrice', price[0]);
    queryParams.append('maxPrice', price[1]);

    if (selectedZone) {
      queryParams.append('zoneId', selectedZone.value);
    }

    // เพิ่ม listingType ตามแท็บที่เลือก (SALE หรือ RENT)
    queryParams.append('type', listingType);

    // นำทางไปยังหน้า properties/list พร้อมกับพารามิเตอร์การค้นหา
    // ใช้ locale จาก URL path ปัจจุบัน
    router.push(`/${locale}/properties/list?${queryParams.toString()}`);
  };

  // เปิดเผยฟังก์ชัน handleSearch ให้สามารถเรียกใช้จากภายนอกได้
  useImperativeHandle(ref, () => ({
    handleSearch
  }));

  return (
    <div className="filter-items-container">
      <div className="col-md-12">
        <div className="bootselect-multiselect mb20" style={{ position: 'relative', zIndex: isPropertyTypeDropdownOpen ? 9998 : 1 }}>
          <SelectWithInstanceId
            defaultValue={propertyTypeOptions[0]}
            name="propertyType"
            options={propertyTypeOptions}
            styles={customStyles}
            className="text-start with_border"
            classNamePrefix="select"
            instanceId="property-type-select"
            required
            isSearchable={false}
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            menuPosition="fixed"
            onChange={(option) => setSelectedPropertyType(option)}
            onMenuOpen={() => {
              setIsPropertyTypeDropdownOpen(true);
              setIsPriceDropdownOpen(false); // ปิด price dropdown
            }}
            onMenuClose={() => {
              setIsPropertyTypeDropdownOpen(false);
            }}
          />
        </div>
      </div>
      {/* End .col-12 */}
      <div className="col-md-12">
        <div className="dropdown-lists at-home8 mb20" style={{ position: 'relative', zIndex: isPriceDropdownOpen ? 9999 : 1 }}>
          <div
            className="btn open-btn drop_btn3 text-start dropdown-toggle"
            onClick={handlePriceDropdownToggle}
            style={{ cursor: 'pointer' }}
          >
            {t('price')}: {formatNumberWithCommas(price[0])} ฿ - {formatNumberWithCommas(price[1])} ฿ <i className="fas fa-caret-down float-end fz11" />
          </div>
          {isPriceDropdownOpen && (
            <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', width: '100%', zIndex: 10000, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', top: '100%', left: 0 }}>
              <div className="widget-wrapper pb20 mb0 pl20 pr20">
                {/* Range Slider Mobile Version */}
                <div className="range-slider-style2">
                  <div className="range-wrapper at-home10">
                    <Slider
                      range
                      max={currentPriceRange.max}
                      min={currentPriceRange.min}
                      value={price}
                      onChange={(value) => handleOnChange(value)}
                      id="slider"
                      step={listingType === 'rent' ? 5000 : 1000000} // ขั้นการเลื่อน: เช่า 1,000 บาท, ขาย 100,000 บาท
                    />
                    <div className="d-flex align-items-center mt-2">
                      <span id="slider-range-value1">{formatNumberWithCommas(price[0])} ฿</span>
                      <span className="mx-0 mx-2">-</span>
                      <span id="slider-range-value2">{formatNumberWithCommas(price[1])} ฿</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* End .col-12 */}
      <div className="col-md-12">
        <div className="bootselect-multiselect mb15" style={{ position: 'relative', zIndex: isPropertyTypeDropdownOpen ? 9998 : 1 }}>
          <SelectWithInstanceId
            defaultValue={locationOptions[0]}
            name="propertyType"
            options={locationOptions}
            styles={customStyles}
            className="text-start with_border"
            classNamePrefix="select"
            instanceId="property-type-select"
            required
            isSearchable={false}
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            menuPosition="fixed"
            onChange={(option) => setSelectedZone(option)}
            onMenuOpen={() => {
              setIsPropertyTypeDropdownOpen(true);
              setIsPriceDropdownOpen(false); // ปิด price dropdown
            }}
            onMenuClose={() => {
              setIsPropertyTypeDropdownOpen(false);
            }}
          />
        </div>
      </div>

      {/* Search Button */}

      {/* End .col-12 */}

      {/* ซ่อนปุ่มค้นหาไว้เพื่อใช้ในการเรียกจาก HeroContent */}

    </div>
  );
});

// Add display name to the forwardRef component
FilterItems.displayName = 'FilterItems';

export default FilterItems;
