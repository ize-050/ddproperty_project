/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1', 'via.placeholder.com'],
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
  async redirects() {
    return [
      {
        source: '/:locale/properties/random',
        destination: '/:locale/properties/list',
        permanent: true,
      },
      // ไม่จำเป็นต้องมี redirects สำหรับ /properties/list อีกต่อไป
      // เนื่องจากเราจัดการด้วย middleware แล้ว
    ];
  },
};

module.exports = withNextIntl(nextConfig);
