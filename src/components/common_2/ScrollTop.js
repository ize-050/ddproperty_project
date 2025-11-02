"use client";
import React, { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // เพิ่ม state เพื่อตรวจสอบว่า component ถูก mount แล้วหรือยัง
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [isMounted]);

  // ไม่แสดงอะไรเลยถ้ายังไม่ได้ mount เพื่อป้องกัน hydration error
  if (!isMounted) return null;
  
  return (
    <>
      {isVisible && (
        <div
          className="scrollToHome"
          style={{ cursor: "pointer" }}
          onClick={scrollToTop}
        >
          <i className="fas fa-angle-up"></i>
        </div>
      )}
    </>
  );
}
