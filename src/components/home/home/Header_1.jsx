"use client";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import LoginSignupModal from "@/components/common/login-signup-modal";
import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

// นำเข้าไฟล์ SCSS
import "@/styles/components/header.scss";
import "@/styles/components/side-elements.scss";

const LanguageSwitcher = dynamic(() => import("@/components/common/LanguageSwitcher"), {
  ssr: false,
});

const Header = () => {
  // ใช้ usePathname hook เพื่อติดตามการเปลี่ยนแปลงของ path
  const t = useTranslations('header');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navbar, setNavbar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ดึงค่า type จาก query parameters
  const typeParam = searchParams.get('type');
  
  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  // เช็คว่าเมนูไหนกำลัง active
  const isActive = (href) => {
    if (pathname === href) return true;
    
    // ถ้าอยู่ที่หน้า properties/list ให้เช็ค type parameter
    if (pathname.includes('/properties/list')) {
      if (href.includes('type=sale') && typeParam === 'sale') return true;
      if (href.includes('type=rent') && typeParam === 'rent') return true;
    }
    
    return false;
  };

  // เมนูหลักตามที่เห็นในรูปภาพ
  const menuItems = [
    { id: "home", label: t("home"), href: "/" },
    { id: "forSale", label: t('buy'), href: "/properties/list?type=sale" },
    { id: "forRent", label: t('rent'), href: "/properties/list?type=rent" },
    { id: "blog", label: t('blog'), href: "/blog" },
    { id: "about", label: t('about'), href: "/about" },
    { id: "contact", label: t('contact'), href: "/contact" },
  ];

  return (
    <>
      <header
        className={`header-nav dluck-header ${navbar ? "sticky slideInDown animated" : ""}`}
      >
        <div className="container">
          <nav className="navbar navbar-expand-lg d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {/* Hamburger Menu - Left Side */}
              <div className="d-block d-lg-none">
                <button
                  className={`hamburger-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                  onClick={toggleMobileMenu}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>

              {/* Logo */}
              <div className="logo-wrapper">
                <Link className="header-logo" href="/">
                  <Image
                    width={150}
                    height={50}
                    src="/images/logo/logo.png"
                    alt="D-Luck Property"
                  />
                </Link>
              </div>
              
              {/* Main Navigation - Desktop - ย้ายมาอยู่ใกล้ logo */}
              <div className="main-nav d-none d-lg-flex">
                <ul className="main-menu">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={isActive(item.href) ? 'active' : ''}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="header-actions">
              {/* Language Switcher */}
              <div className="language-switch-wrapper">
                <LanguageSwitcher />
              </div>

              {/* Backend Button */}

            </div>
          </nav>
          <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
            <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
            <div className="mobile-menu-content">

              <div className="mobile-nav-wrapper">
                <ul className="mobile-menu-nav">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <Link 
                        href={item.href} 
                        className={isActive(item.href) ? 'active' : ''}
                        onClick={toggleMobileMenu}
                      >
                        {item.label}
                        <span className="menu-arrow">
                          <i className="fa fa-angle-right"></i>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              

            </div>
          </div>
        </div>
      </header>
      
      {/* Side elements moved to SidebarStickyBar component */}
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
          <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
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
      
      {/* Sidebar Sticky Bar for Quick Contact */}
    
    </>
  );
};

export default Header;
