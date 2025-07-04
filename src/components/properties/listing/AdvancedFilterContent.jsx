import React, { useEffect, useState } from "react";

// import { FiX } from "react-icons/fi";
import Slider, { Range } from "rc-slider";
import Select from "react-select";

//store
import useZoneStore from '@/store/useZoneStore';
import usePropertyFilterStore from '@/store/usePropertyFilterStore';

//component
import Bedroom from './Bedroom';
import Bathroom from './Bathroom';
import PriceRange from './PriceRange';

//service
import getProperties from '@/utils/properties';
import propertyTypeService from '@/services/propertyTypeService';
import { useLocale } from 'next-intl';

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

export default function AdvancedFilterContent({ onClose, onSearch, type }) {
    const zones = useZoneStore((s) => s.zones);

    const [priceRange, setPriceRange] = useState([0, 15000000]);
    const [zone_id, zoneIdHandler] = useState(null);
    const [propertyTypesOptions, setPropertyTypesOptions] = useState([]);
    const locale = useLocale();
    const setPropertyItems = usePropertyFilterStore((s) => s.setPropertyItems);
    const setPaginationItems = usePropertyFilterStore((s) => s.setPaginationItems);
    const [dataZone, setDataZone] = useState([{
        value: null,
        label: null,
    }])
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

    const filterFunctions = {
        priceRange,
        setPriceRange,
        bedrooms,
        bathrooms,
        setBedrooms,
        setBathrooms,

    }

    // Helper for rendering options
    const bedroomOptions = ["", "1", "2", "3", "4", "5"];
    const bathroomOptions = ["", "1", "2", "3", "4", "5"];


    useEffect(() => {
        setMinPrice(priceRange[0]);
        setMaxPrice(priceRange[1]);
    }, [priceRange])



    useEffect(() => {
        setDataZone(zones.map((zone) => {
            return {
                value: zone.id,
                label: zone[`name_${locale}`],
            }
        }))
    }, [zones])

    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const response = await propertyTypeService.getPropertyTypesForFilter();
                const propertyTypes = response.data.map((propertyType) => {
                    // เลือก label ตามภาษาปัจจุบัน
                    let label = propertyType.name; // fallback
                    
                    switch (locale) {
                        case 'th':
                            label = propertyType.nameTh || propertyType.nameEn || propertyType.name;
                            break;
                        case 'en':
                            label = propertyType.nameEn || propertyType.name;
                            break;
                        case 'zh':
                            label = propertyType.nameCh || propertyType.nameEn || propertyType.name;
                            break;
                        case 'ru':
                            label = propertyType.nameRu || propertyType.nameEn || propertyType.name;
                            break;
                        default:
                            label = propertyType.nameEn || propertyType.name;
                    }
                    
                    return {
                        value: propertyType.name,
                        label: label,
                    };
                });
                setPropertyTypesOptions(propertyTypes);
            } catch (error) {
                console.error('Error fetching property types:', error);
                // Fallback to default options if API fails
                setPropertyTypesOptions([
                    { value: 'CONDO', label: locale === 'th' ? 'คอนโดมิเนียม' : 'Condominium' },
                    { value: 'HOUSE', label: locale === 'th' ? 'บ้าน' : 'House' },
                    { value: 'VILLA', label: locale === 'th' ? 'วิลล่า' : 'Villa' },
                    { value: 'TOWNHOUSE', label: locale === 'th' ? 'ทาวน์เฮาส์' : 'Townhouse' },
                ]);
            }
        };
        fetchPropertyTypes();
    }, [locale]); // เพิ่ม locale เป็น dependency

    const handleSearch = () => {
        console.log('AdvancedFilterContent handleSearch called with:', {
            propertyType,
            minPrice,
            maxPrice,
            zoneId,
            bedrooms,
            bathrooms,
            type
        });

        // Convert type prop to proper listingType format
        let currentListingType;
        if (type === 'rent') {
            currentListingType = 'RENT';
        } else if (type === 'sale') {
            currentListingType = 'SALE';
        } else {
            // Default to current listingType if type prop is invalid
            currentListingType = type;
        }

        // Call parent's onSearch function with filter values
        onSearch({
            propertyType: propertyType,
            minPrice: minPrice,
            maxPrice: maxPrice,
            zoneId: zoneId,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            listingType: currentListingType
        });
        
        // Close the modal
        onClose();
    };

    return (
        <>
            <div className="modal-header pl30 pr30">
                <h5 className="modal-title" id="exampleModalLabel">
                    More Filter
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={onClose}
                />
            </div>
            {/* End modal-header */}

            <div className="modal-body pb-0">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="widget-wrapper">
                            <h6 className="list-title mb20">Price Range</h6>
                            <div className="range-slider-style modal-version">
                                <PriceRange filterFunctions={filterFunctions} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* End .row */}

                <div className="row">
                    <div className="col-sm-6">
                        <div className="widget-wrapper">
                            <h6 className="list-title">Type</h6>
                            <div className="form-style2 input-group">
                                <Select
                                    defaultValue={propertyTypesOptions[0]}
                                    name="colors"
                                    options={propertyTypesOptions}
                                    styles={customStyles}
                                    onChange={(e) =>
                                        setPropertyType(e.value)
                                    }
                                    className="select-custom"
                                    classNamePrefix="select"
                                    required
                                />
                            </div>
                        </div>
                    </div>


                    {/* End .col-6 */}
                    <div className="col-sm-6">
                        <div className="widget-wrapper">
                            <h6 className="list-title">Location</h6>
                            <div className="form-style2 input-group">
                                <Select
                                    defaultValue={dataZone[0]}
                                    name="colors"
                                    styles={customStyles}
                                    options={dataZone}
                                    className="select-custom filterSelect"
                                    classNamePrefix="select"
                                    onChange={(e) => {
                                        setZoneId(e.value)

                                    }}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    {/* End .col-6 */}
                </div>
                {/* End .row */}

                <div className="row">
                    <div className="col-sm-6">
                        <div className="widget-wrapper">
                            <h6 className="list-title">Bedrooms</h6>
                            <div className="d-flex">
                                <Bedroom filterFunctions={filterFunctions} />
                            </div>
                        </div>
                    </div>
                    {/* End .col-md-6 */}

                    <div className="col-sm-6">
                        <div className="widget-wrapper">
                            <h6 className="list-title">Bathrooms</h6>
                            <div className="d-flex">
                                <Bathroom filterFunctions={filterFunctions} />
                            </div>
                        </div>
                    </div>
                    {/* End .col-md-6 */}
                </div>


            </div>
            {/* End modal body */}

            <div className="modal-footer justify-content-between">
                <button
                    className="reset-button"
                    onClick={() => resetFilters()}
                >
                    <span className="flaticon-turn-back" />
                    <u>Reset all filters</u>
                </button>
                <div className="btn-area">
                    <button type="submit" onClick={handleSearch}
                        style={{
                            backgroundColor: '#922014',
                            color: '#fff',
                        }}
                        className="ud-btn btn-thm">
                        <span className="flaticon-search align-text-top pr10" />
                        Search
                    </button>
                </div>
            </div>
            {/* End modal-footer */}
        </>
    );
}
