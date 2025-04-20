/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'via.placeholder.com'],
    unoptimized: true, // ปิดการ optimize รูปภาพเพื่อแก้ไขปัญหารูปภาพไม่แสดง
  },
  // สำหรับ App Router ใน Next.js 14 เราต้องใช้ i18n ผ่าน route segments แทน
  // การตั้งค่าจะอยู่ในไฟล์ middleware.js
  reactStrictMode: false, // ปิด strict mode เพื่อป้องกันการ render ซ้ำ
};

module.exports = nextConfig;
