"use client";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import LoginSignupModal from "@/components/common/login-signup-modal";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import userService from '@/services/userService';

const LanguageSwitcher = dynamic(() => import("@/components/common/LanguageSwitcher"), {
    ssr: false,
});

const HeaderBackoffice = () => {
    const [navbar, setNavbar] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const t = useTranslations('backoffice');

    const changeBackground = () => {
        if (window.scrollY >= 10) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    // Fetch user profile data
    const fetchUserProfile = async () => {
        try {
            const profile = await userService.getMyProfile()
            console.log("profile",profile.data)
            setUserProfile(profile.data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // Set default profile if fetch fails
            setUserProfile({
                firstname: t('admin'),
                lastname: t('user'),
                email: 'admin@dluckproperty.com',
                picture: null
            });
        }finally{
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/backoffice/login';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-dropdown-container')) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Get profile image URL
    const getProfileImageUrl = () => {
        if (userProfile?.picture) {
            return `${process.env.NEXT_PUBLIC_IMAGE_URL}${userProfile.picture}`;
        }
        return '/images/team/default-avatar.jpg';
    };

    // Get user display name
    const getUserDisplayName = () => {
        if (userProfile?.firstname && userProfile?.lastname) {
            return `${userProfile.firstname} ${userProfile.lastname}`;
        }
        return userProfile?.firstname || t('adminUser');
    };

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
                                    
                                    {/* Profile Dropdown */}
                                    <div className="profile-dropdown-container position-relative ms-3">
                                        <button
                                            className="profile-avatar-btn"
                                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="profile-avatar-loading">
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">{t('loading')}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Image
                                                    width={40}
                                                    height={40}
                                                    src={getProfileImageUrl()}
                                                    alt="Profile"
                                                    className="profile-avatar"
                                                />
                                            )}
                                        </button>
                                        
                                        {showProfileDropdown && !loading && (
                                            <div className="profile-dropdown-menu">
                                                <div className="dropdown-header">
                                                    <div className="user-info">
                                                        <Image
                                                            width={50}
                                                            height={50}
                                                            src={getProfileImageUrl()}
                                                            alt="Profile"
                                                            className="dropdown-avatar"
                                                        />
                                                        <div className="user-details">
                                                            <h6>{getUserDisplayName()}</h6>
                                                            <p>{userProfile?.email || 'admin@dluckproperty.com'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="dropdown-divider"></div>
                                                <ul className="dropdown-menu-list">
                                                    <li>
                                                        <Link href="/backoffice/my-profile" className="dropdown-item">
                                                            <i className="flaticon-user me-2"></i>
                                                            {t('menu.myprofile')}
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <button onClick={handleLogout} className="dropdown-item logout-btn">
                                                            <i className="flaticon-logout me-2"></i>
                                                            {t('menu.logout')}
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <a
                                        className="ud-btn btn-white add-property bdrs60 ms-4"
                                        href="/"
                                    >
                                        {t('frontend')}
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
