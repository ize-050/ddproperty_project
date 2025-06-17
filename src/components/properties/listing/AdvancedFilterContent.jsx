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
import { useLocale } from 'next-intl';

const PROPERTY_TYPES = [
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







export default function AdvancedFilterContent({ onClose, type }) {
    const zones = useZoneStore((s) => s.zones);

    const [priceRange, setPriceRange] = useState([0, 15000000]);
    const [zone_id, zoneIdHandler] = useState(null);
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



    const handleSearch = () => {
        // Build query params string
        const params = new URLSearchParams();
        if (propertyType) params.set('propertyType', propertyType);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (zoneId) params.set('zoneId', zoneId);
        if (bedrooms) params.set('bedrooms', bedrooms);
        if (bathrooms) params.set('bathrooms', bathrooms);

        if (type) params.set('type', type);



        // Update URL params WITHOUT reload
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);

        // Call API as before
        const Request = {
            propertyType: propertyType,
            minPrice: minPrice,
            maxPrice: maxPrice,
            zoneId: zoneId,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
        }

        getProperties(Request).then((res) => {
            setPropertyItems(res.data);
            setPaginationItems(res.pagination);
            onClose();
        });
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
                                    defaultValue={[PROPERTY_TYPES[0]]}
                                    name="colors"
                                    options={PROPERTY_TYPES}
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
                                    defaultValue={[dataZone[0]]}
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
