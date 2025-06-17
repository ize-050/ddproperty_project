'use client';
import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import LoginSignupModal from "@/components/common/login-signup-modal";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from "react";
import LanguageApi from "@/utils/languageApi";

import { useLocale } from "next-intl";

const LanguageSwitcher = dynamic(() => import("@/components/common/LanguageSwitcher"), {
    ssr: false,
});

const CurrencySwitcher = dynamic(() => import("@/components/common/CurrencySwitcher"), {
    ssr: false,
});

/**
 * Enhanced Header component with language support
 * @param {Object} props - Component props
 * @param {Object} props.initialStrings - Initial UI strings from SSR (optional)
 */
const HeaderWithLanguage = ({ initialStrings = {} }) => {
    const [navbar, setNavbar] = useState(false);
    const locale = useLocale();
    const [uiStrings, setUiStrings] = useState(initialStrings);
    const [loading, setLoading] = useState(!Object.keys(initialStrings).length);

    // Get UI string by slug
    const getString = (slug, defaultValue = '') => {
        const datalocale =  locale;
        const string = uiStrings[slug];
        return string ? (string[datalocale] || string.en || defaultValue) : defaultValue;
    };

    // Handle navbar background change on scroll
    const changeBackground = () => {
        if (window.scrollY >= 10) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    // Fetch UI strings for header section
    const fetchHeaderStrings = async () => {
        try {
            setLoading(true);
            const response = await LanguageApi.getUiStringsBySection('header');
            console.log("response",response);
            if (response.success) {
                // Transform array of strings to object with slug as key
                const stringsObj = response.data.reduce((acc, item) => {
                    acc[item.slug] = {
                        en: item.en,
                        th: item.th,
                        zh: item.zhCN,
                        ru: item.ru
                    };
                    return acc;
                }, {});
                
                setUiStrings(stringsObj);
            }
        } catch (error) {
            console.error('Error fetching header strings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Add scroll event listener
        window.addEventListener("scroll", changeBackground);
        
        // Fetch header strings if not provided via SSR
        if (!Object.keys(initialStrings).length) {
            fetchHeaderStrings();
        }
        
        return () => {
            window.removeEventListener("scroll", changeBackground);
        };
    }, [initialStrings]);

    return (
        <>
            <header
                className={`header-nav nav-homepage-style light-header menu-home4 main-menu ${
                    navbar ? "sticky slideInDown animated" : ""
                }`}
            >
                <nav className="posr">
                    <div className="container posr menu_bdrt1">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-auto">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="logos mr40">
                                        <Link className="header-logo logo1" href="/">
                                            <Image
                                                width={138}
                                                height={50}
                                                src="/images/logo/logo.png"
                                                alt={getString('logo_alt', 'Header Logo')}
                                            />
                                        </Link>
                                        <Link className="header-logo logo2" href="/">
                                            <Image
                                                width={138}
                                                height={50}
                                                src="/images/logo/logo.png"
                                                alt={getString('logo_alt', 'Header Logo')}
                                            />
                                        </Link>
                                    </div>
                                    {/* End Logo */}

                                    <MainMenu getString={getString} />
                                    {/* End Main Menu */}
                                </div>
                            </div>
                            {/* End .col-auto */}

                            <div className="col-auto">
                                <div className="d-flex align-items-center">
                                    <LanguageSwitcher />
                                    <CurrencySwitcher />
                                    <Link
                                        className="ud-btn btn-white add-property bdrs60 ms-4"
                                        href="/backoffice/login"
                                    >
                                        {getString('backoffice_button', 'BACKOFFICE')}
                                        <i className="fal fa-arrow-right-long" />
                                    </Link>
                                </div>
                            </div>
                            {/* End .col-auto */}
                        </div>
                        {/* End .row */}
                    </div>
                </nav>
            </header>
            {/* End Header */}

            {/* Signup Modal */}
       
            {/* End Signup Modal */}

            {/* Sidebar Panel */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
            >
                <div className="offcanvas-header">
                    <div className="offcanvas-header-menu d-flex align-items-center">
                        <Link className="offcanvas-logo" href="/">
                            <Image
                                width={138}
                                height={50}
                                src="/images/logo/logo.png"
                                alt={getString('logo_alt', 'Header Logo')}
                            />
                        </Link>
                        <button
                            type="button"
                            className="btn-close text-reset"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <SidebarPanel />
                </div>
            </div>
            {/* End Sidebar Panel */}
        </>
    );
};

export default HeaderWithLanguage;
