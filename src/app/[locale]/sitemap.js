export default async function sitemap() {
  const baseUrl = 'https://www.d-luckproperty.com';
  const locales = ['th', 'en', 'zh', 'ru'];
  
  const urls = [];
  
  // เพิ่ม static pages สำหรับทุกภาษา
  locales.forEach(locale => {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
    
    urls.push({
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    
    urls.push({
      url: `${baseUrl}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    
    urls.push({
      url: `${baseUrl}/${locale}/properties/list`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
    
    // เพิ่ม property listing pages สำหรับ sale และ rent
    urls.push({
      url: `${baseUrl}/${locale}/properties/list?type=sale`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
    
    urls.push({
      url: `${baseUrl}/${locale}/properties/list?type=rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
    
    urls.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    urls.push({
      url: `${baseUrl}/${locale}/blog/[id]`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  
  
  // เพิ่ม property detail pages
  try {
    // ตรวจสอบว่า API URL มีอยู่หรือไม่
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_API_URL not found, skipping property detail pages');
      return urls;
    }
    
    const fullApiUrl = `${apiUrl}/properties?page=1&limit=1000&isPublished=true`;
    
    const response = await fetch(fullApiUrl, {
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
      
      // สร้าง property detail URLs สำหรับทุกภาษา
      properties.forEach(property => {
        if (property.id && property.title) {
          // สร้าง slug จาก title
          const slug = property.title
            .toLowerCase()
            .replace(/[^a-z0-9\u0E00-\u0E7F\u4E00-\u9FFF]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          locales.forEach(locale => {
            urls.push({
              url: `${baseUrl}/${locale}/property_detail/${property.id}/${slug}`,
              lastModified: property.updatedAt ? new Date(property.updatedAt) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          });
        }
      });
    } else {
      console.warn(`API request failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.warn('Could not fetch properties for sitemap:', error.message);
    // ไม่ throw error เพื่อให้ sitemap generation ดำเนินต่อไปได้
  }
  
  return urls;
}
