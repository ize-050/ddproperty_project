"use client";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import LoginSignupModal from "@/components/common/login-signup-modal";
import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// นำเข้าไฟล์ SCSS
import "@/styles/components/header.scss";
import "@/styles/components/side-elements.scss";

// ใช้ dynamic import เพื่อแก้ปัญหา hydration
const LanguageSwitcher = dynamic(() => import("@/components/common/LanguageSwitcher"), {
  ssr: false,
});

const Header = () => {
  // ใช้ usePathname hook เพื่อติดตามการเปลี่ยนแปลงของ path
  const pathname = usePathname();
  const [navbar, setNavbar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // เมนูหลักตามที่เห็นในรูปภาพ
  const menuItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "forSale", label: "For Sale", href: "/for-sale" },
    { id: "forRent", label: "For Rent", href: "/for-rent" },
    { id: "blog", label: "Blog", href: "/blog" },
    { id: "about", label: "About", href: "/about" },
    { id: "contact", label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`header-nav dluck-header ${navbar ? "sticky slideInDown animated" : ""}`}
      >
        <div className="container-fluid px-lg-5">
          <div className="header-inner">
            {/* Hamburger Menu - Left Side */}
            <div className="hamburger-menu-left d-lg-none">
              <button 
                className={`hamburger-btn ${isMobileMenuOpen ? 'active' : ''}`} 
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

            {/* Main Navigation - Desktop */}
            <div className="main-nav d-none d-lg-flex">
              <ul className="main-menu">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <Link 
                      href={item.href}
                      className={pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href)) ? 'active' : ''}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side Actions */}
            <div className="header-actions">
              {/* Language Switcher */}
              <div className="language-switch-wrapper">
                <LanguageSwitcher />
              </div>

              {/* Backend Button */}
              <div className="login-button">
                <Link
                  href="/login"
                  className="login-btn"
                >
                  <span className="d-none d-md-inline">Backend</span>
                </Link>
              </div>

              {/* Mobile Menu Toggle - Removed as we moved it to the left */}
            </div>
          </div>

          {/* Mobile Menu - Shown when toggle is clicked */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-menu-inner">
              <ul className="mobile-menu-list">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <Link 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
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
