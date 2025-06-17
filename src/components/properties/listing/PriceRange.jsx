"use client";
import React, { useState } from "react";
import Slider, { Range } from "rc-slider";

const PriceRange = ({ filterFunctions }) => {
    const [price, setPrice] = useState([0, 150000000]);

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
                    max={60000000}
                    min={0}
                    defaultValue={[
                        filterFunctions?.priceRange[0],
                        filterFunctions?.priceRange[1],
                    ]}
                    onChange={(value) => handleOnChange(value)}
                    id="slider"
                />
                <div className="d-flex align-items-center">
                    <div id="slider-range-value1" className="d-flex justify-content-between" style={{ minWidth: '120px' }}>
                        <span>{price[0]}</span>
                        <span className="fs12 ms-auto">THB</span>
                    </div>
                    <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
                    <div id="slider-range-value2" className="d-flex justify-content-between" style={{ minWidth: '120px' }}>
                        <span>{price[1]}</span>
                        <span className="fs12 ms-auto">THB</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PriceRange;
