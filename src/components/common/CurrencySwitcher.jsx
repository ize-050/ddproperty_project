"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import { getSelectedCurrency, currencySymbols } from "@/utils/currencyUtils";

const CurrencySwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("THB");
    const router = useRouter();
    const pathname = usePathname();

    const currencies = [
        { code: "THB", name: "Thai Baht", symbol: currencySymbols.THB },
        { code: "USD", name: "US Dollar", symbol: currencySymbols.USD },
        { code: "CNY", name: "Chinese Yuan", symbol: currencySymbols.CNY },
        { code: "RUB", name: "Russian Ruble", symbol: currencySymbols.RUB },
        { code: "GBP", name: "British Pound", symbol: currencySymbols.GBP },
        { code: "EUR", name: "Euro", symbol: currencySymbols.EUR }
    ];

    useEffect(() => {
        // Get currency from the utility function (checks cookie or falls back to locale)
        const currentCurrency = getSelectedCurrency();
        setSelectedCurrency(currentCurrency);
    }, []);

    const handleCurrencyChange = (currencyCode) => {
        setSelectedCurrency(currencyCode);
        setCookie("currency", currencyCode, { maxAge: 30 * 24 * 60 * 60 });
        setIsOpen(false);

        // Refresh the page to apply currency changes immediately
        router.refresh();
    };

    return (
        <div className="currency-selector position-relative">
            <button
                className="dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="currency-icon">
                    <Image
                        width={20}
                        height={20}
                        src="/images/currency/currency.svg"
                        alt="currency"
                    />
                </span>
                <span className="currency-text">{selectedCurrency}</span>
            </button>

            <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
                {currencies.map((currency) => (
                    <li key={currency.code}>
                        <button
                            className={`dropdown-item ${selectedCurrency === currency.code ? "active" : ""
                                }`}
                            onClick={() => handleCurrencyChange(currency.code)}
                        >
                            <span className="currency-symbol">{currency.symbol}</span>
                            <span className="currency-code">{currency.code}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrencySwitcher;
