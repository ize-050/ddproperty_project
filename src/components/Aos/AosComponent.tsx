"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";   // <–– เอา CSS เข้ามารันที่ฝั่งไคลเอนต์

/**
 * คอมโพเนนต์นี้ไม่แสดงอะไร เพียงแค่เรียก AOS.init() ครั้งเดียวเมื่อโหลด
 * ใส่ <AOSInit /> ไว้สูง ๆ (เช่น root layout) เพื่อให้มีผลทุกหน้า
 */
export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 1200,   // เวลาอนิเมชัน (ms)
      once: true,       // เล่นครั้งเดียวตอนเลื่อนเห็น
    });

    /**
     * ถ้าใช้ Next.js App Router (client-side routing) ต้อง refresh ทุกครั้งที่เปลี่ยนเส้นทาง
     * ตัวอย่างด้านล่างใช้ usePathname; ถ้าใช้วิธีอื่นอยู่แล้วให้ดัดแปลงตามสะดวก
     */
    const handleRouteChange = () => {
      AOS.refresh();    // รีเฟรชตำแหน่ง element ใหม่
    };
    window.addEventListener("resize", handleRouteChange);
    return () => {
      window.removeEventListener("resize", handleRouteChange);
    };
  }, []);

  return null;   // ไม่ render UI
}
