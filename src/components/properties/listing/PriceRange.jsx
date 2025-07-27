"use client";
import React, { useState } from "react";
import Slider, { Range } from "rc-slider";

const PriceRange = ({ filterFunctions, listingType = 'sale' }) => {
    // Helper function to format numbers with commas (display only)
    const formatNumberWithCommas = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    // กำหนดช่วงราคาตาม listingType
    const getPriceRangeByType = (type) => {
        if (type === 'rent') {
            return {
                min: 5000,      // 5,000 บาท
                max: 100000,    // 100,000 บาท (ลดจาก 200,000)
                default: [10000, 30000],  // 10,000 - 30,000 บาท
                step: 1000      // ขั้น 1,000 บาท
            };
        } else {
            return {
                min: 500000,    // 500,000 บาท
                max: 20000000,  // 20,000,000 บาท (ลดจาก 60,000,000)
                default: [1000000, 5000000], // 1,000,000 - 5,000,000 บาท
                step: 100000    // ขั้น 100,000 บาท
            };
        }
    };
    
    const currentPriceRange = getPriceRangeByType(listingType);
    const [price, setPrice] = useState(filterFunctions?.priceRange || currentPriceRange.default);

    // price range handler
    const handleOnChange = (value) => {
        setPrice(value);
        filterFunctions?.setPriceRange(value);
    };
    


    return (
        <>
            <div className="range-wrapper">
                <Slider
                    range
                    max={currentPriceRange.max}
                    min={currentPriceRange.min}
                    defaultValue={[
                        filterFunctions?.priceRange[0] || currentPriceRange.default[0],
                        filterFunctions?.priceRange[1] || currentPriceRange.default[1],
                    ]}
                    onChange={(value) => handleOnChange(value)}
                    id="slider"
                    step={currentPriceRange.step}
                />
                <div className="d-flex align-items-center">
                    <div id="slider-range-value1" className="d-flex justify-content-between" style={{ minWidth: '120px' }}>
                        <span>{formatNumberWithCommas(price[0])}</span>
                        <span className="fs12 ms-auto">THB</span>
                    </div>
                    <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
                    <div id="slider-range-value2" className="d-flex justify-content-between" style={{ minWidth: '120px' }}>
                        <span>{formatNumberWithCommas(price[1])}</span>
                        <span className="fs12 ms-auto">THB</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PriceRange;
