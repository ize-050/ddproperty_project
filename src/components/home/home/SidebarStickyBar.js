"use client";

import React from "react";
import "@/styles/components/side-elements.scss";

const SidebarStickyBar = () => {
  return (
    <>
      {/* Left Side Elements */}
      <div className="left-side-elements">
        <div className="vertical-text">
          <span>info@d-luckproperty.com</span>
        </div>
        
        <div className="social-icons">
          <ul>
            <li><a href="https://www.facebook.com/dluckproperty/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a></li>
          </ul>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span className="scroll-text">Scroll</span>
        <div className="scroll-dot"></div>
        <div className="scroll-line"></div>
      </div>
    </>
  );
};

export default SidebarStickyBar;
