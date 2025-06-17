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
const HeaderBackoffice = () => {
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
                className={`header-nav nav-homepage-style light-header position-fixed menu-home4 main-menu`}
            >
                <nav className="posr">
                    <div className="container-fluid pr30 pr15-xs pl30 posr menu_bdrt1">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-6 col-lg-auto">
                                <div className="text-center text-lg-start d-flex align-items-center">
                                    <div className="dashboard_header_logo position-relative me-2 me-xl-5">
                                        <Link className="header-logo logo1" href="/backoffice">
                                            <Image
                                                width={138}
                                                height={50}
                                                src="/images/logo/logo.png"
                                                alt="Header Logo"
                                            />
                                        </Link>
                                    </div>

                                    <a
                                        className="dashboard_sidebar_toggle_icon text-thm1 vam"
                                        href="#"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#SidebarPanel"
                                        aria-controls="SidebarPanelLabel"
                                    >
                                        <Image
                                            width={25}
                                            height={9}
                                            className="img-1"
                                            src="/images/dark-nav-icon.svg"
                                            alt="humberger menu"
                                        />
                                    </a>

                                    {/* End Logo */}

                                    {/* End Main Menu */}
                                </div>

                            </div>

                            <div className="d-none d-lg-block col-lg-auto">
                                {/* <MainMenu /> */}
                            </div>
                            {/* End .col-auto */}

                            <div className="col-6 col-lg-auto">
                                <div className="d-flex align-items-center">
                                    <LanguageSwitcher />
                                    <a
                                        className="ud-btn btn-white add-property bdrs60 ms-4"
                                        href="/"
                                    >
                                        FRONTEND
                                        <i className="fal fa-arrow-right-long" />
                                    </a>
                                </div>
                            </div>
                            {/* End .col-auto */}
                        </div>
                    </div>
                    {/* End .row */}
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

export default HeaderBackoffice;
