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
  const [price, setPrice] = useState([500000, 20000000]); // ปรับค่าเริ่มต้นเป็น 500,000 - 20,000,000 บาท
  const { zones } = useZoneStore();
  // ดึง locale จาก URL path โดยตรง

  // กำหนดช่วงราคาเริ่มต้น (500,000 - 20,000,000 บาท)
  const [minPrice, setMinPrice] = useState(500000);
  const [maxPrice, setMaxPrice] = useState(20000000);

  // สร้าง state สำหรับควบคุมการแสดง/ซ่อน dropdown
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);

  // สร้าง state สำหรับเก็บค่าที่เลือก
  const [selectedPropertyType, setSelectedPropertyType] = useState(catOptions[0]);
  const [selectedZone, setSelectedZone] = useState(null);

  // price range handler
  const handleOnChange = (value) => {
    setPrice(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };

  // ฟังก์ชันสำหรับแปลงราคาให้อยู่ในรูปแบบที่อ่านง่าย
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M ฿`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K ฿`;
    }
    return `${price} ฿`;
  };


  // property type options

  const propertyTypeOptions = propertyTypes.map((propertyType) => ({
    value: propertyType.name,
    label: propertyType[`name${locale.charAt(0).toUpperCase()}${locale.slice(1)}`],
  }));

  const locationOptions = zones.map((zone) => ({
    value: zone.id,
    label: zone[`name${locale.charAt(0).toUpperCase()}${locale.slice(1)}`],
  }));

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isHovered
            ? "#eb675312"
            : isFocused
              ? "#eb675312"
              : undefined,
      };
    },
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
        <div className="bootselect-multiselect mb20">
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
            onChange={(option) => setSelectedPropertyType(option)}
          />
        </div>
      </div>
      {/* End .col-12 */}
      <div className="col-md-12">
        <div className="dropdown-lists at-home8 mb20">
          <div
            className="btn open-btn drop_btn3 text-start dropdown-toggle"
            onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
            style={{ cursor: 'pointer' }}
          >
            {t('price')}: {formatPrice(price[0])} - {formatPrice(price[1])} <i className="fas fa-caret-down float-end fz11" />
          </div>
          {isPriceDropdownOpen && (
            <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', width: '100%', zIndex: 1000 }}>
              <div className="widget-wrapper pb20 mb0 pl20 pr20">
                {/* Range Slider Mobile Version */}
                <div className="range-slider-style2">
                  <div className="range-wrapper at-home10">
                    <Slider
                      range
                      max={50000000} // ปรับค่าสูงสุดเป็น 50 ล้านบาท
                      min={0}
                      value={price}
                      onChange={(value) => handleOnChange(value)}
                      id="slider"
                      step={100000} // ปรับขั้นการเลื่อนเป็น 100,000 บาท
                    />
                    <div className="d-flex align-items-center mt-2">
                      <span id="slider-range-value1">{formatPrice(price[0])}</span>
                      <span className="mx-0 mx-2">-</span>
                      <span id="slider-range-value2">{formatPrice(price[1])}</span>
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
        <div className="bootselect-multiselect mb15 z-index-1">
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
            onChange={(option) => setSelectedZone(option)}
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
