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

  // เพิ่ม static URLs สำหรับ property listing pages
  additionalPaths: async (config) => {
    const result = [];
    
    // เพิ่ม static pages สำหรับทุกภาษา
    config.i18n.locales.forEach(locale => {
      // Homepage
      result.push(`/${locale}`);
      
      // Static pages
      result.push(`/${locale}/about`);
      result.push(`/${locale}/contact`);
      result.push(`/${locale}/blog`);
      
      // Property listing pages
      result.push(`/${locale}/properties/list`);
      result.push(`/${locale}/properties/list?type=sale`);
      result.push(`/${locale}/properties/list?type=rent`);
    });
    
    try {
      // ตรวจสอบว่า API URL มีอยู่หรือไม่
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.warn('NEXT_PUBLIC_API_URL not found, skipping property detail pages');
        return result;
      }
      
      // ดึงข้อมูล properties จาก API
      const response = await fetch(`${apiUrl}/properties?page=1&limit=1000&isPublished=true`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        // เพิ่ม timeout เพื่อไม่ให้ sitemap generation ช้าเกินไป
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        const properties = data.properties || [];
        
        // สร้าง URLs สำหรับ property detail pages
        properties.forEach(property => {
          if (property.id && property.title) {
            // สร้าง slug จาก title
            const slug = property.title
              .toLowerCase()
              .replace(/[^a-z0-9\u0E00-\u0E7F\u4E00-\u9FFF]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');
            
            // เพิ่ม property detail URL สำหรับทุกภาษา
            config.i18n.locales.forEach(locale => {
              result.push(`/${locale}/property_detail/${property.id}/${slug}`);
            });
          }
        });
      } else {
        return result;
      }
    } catch (error) {
      return result;
    }
    
    return result;
  },

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
