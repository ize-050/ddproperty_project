"use client";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import LoginSignupModal from "@/components/common/login-signup-modal";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from "react";

const LanguageSwitcher = dynamic(() => import("@/components/common/LanguageSwitcher"), {
    ssr: false,
});

const CurrencySwitcher = dynamic(() => import("@/components/common/CurrencySwitcher"), {
    ssr: false,
});
const Header = () => {
    const [navbar, setNavbar] = useState(false);

    const changeBackground = () => {
        if (window.scrollY >= 10) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", changeBackground);
        return () => {
            window.removeEventListener("scroll", changeBackground);
        };
    }, []);

    return (
        <>
            <header
                className={`header-nav nav-homepage-style light-header menu-home4 main-menu ${navbar ? "sticky slideInDown animated" : ""
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
                                                alt="Header Logo"
                                            />
                                        </Link>
                                        <Link className="header-logo logo2" href="/">
                                            <Image
                                                width={138}
                                                height={50}
                                                src="/images/logo/logo.png"
                                                alt="Header Logo"
                                            />
                                        </Link>
                                    </div>
                                    {/* End Logo */}

                                    <MainMenu />
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
                                        BACKOFFICE
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
            <div className="signup-modal">
                <div
                    className="modal fade"
                    id="loginSignupModal"
                    tabIndex={-1}
                    aria-labelledby="loginSignupModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog  modal-dialog-scrollable modal-dialog-centered">
                        <LoginSignupModal />
                    </div>
                </div>
            </div>
            {/* End Signup Modal */}

            {/* DesktopSidebarMenu */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="SidebarPanel"
                aria-labelledby="SidebarPanelLabel"
            >
                <SidebarPanel />
            </div>
            {/* Sidebar Panel End */}
        </>
    );
};

export default Header;
