/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.d-luckproperty.com',
  generateRobotsTxt: true, // สร้าง robots.txt อัตโนมัติ
  exclude: [
    '/backoffice/*', // exclude backoffice pages
    '/api/*', // exclude API routes
    '/_next/*', // exclude Next.js internal files
  ],
  // รองรับหลายภาษา
  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en', 'zh', 'ru'],
  },
  // กำหนด changefreq และ priority
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,

  // Transform URLs สำหรับ custom logic
  transform: async (config, path) => {
    // กำหนด priority และ changefreq ตาม path
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/properties/list')) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.includes('/blog')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.includes('/about') || path.includes('/contact')) {
      priority = 0.8;
      changefreq = 'monthly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
