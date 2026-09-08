/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.js');

// ⚠️ ชั่วคราว: backend (Cloudways) ยังไม่ได้ผูก domain/SSL จริง ใบ cert เป็น self-signed
// ทำให้ทุก request ฝั่ง SSR (blog, zones, properties ฯลฯ) ที่ยิงผ่าน axios/fetch
// เจอ error SELF_SIGNED_CERT_IN_CHAIN. ตั้งค่านี้ที่ระดับ process เพื่อยอมรับ cert
// ครอบคลุมทุก service โดยไม่ต้องแก้ทีละไฟล์.
// จำกัดเฉพาะ non-production เท่านั้น
// TODO: เมื่อผูก domain + Let's Encrypt เรียบร้อยแล้ว ให้ลบบล็อกนี้ออก
//       และลบ httpsAgent ใน src/utils/serverApi.js ด้วย
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1', 'via.placeholder.com', 'localhost:5001'],
    unoptimized: true, // ปิดการ optimize รูปภาพเพื่อแก้ไขปัญหารูปภาพไม่แสดง
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
  // Remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      {
        // Cache static assets (images, icons, fonts)
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      {
        // Cache favicon and other root assets
        source: '/(favicon.ico|robots.txt|sitemap.xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 1 day
          },
        ],
      },
      {
        // Cache API responses with shorter duration
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300', // 5 minutes
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:locale/properties/random',
        destination: '/:locale/properties/list',
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
