/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.js');

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
