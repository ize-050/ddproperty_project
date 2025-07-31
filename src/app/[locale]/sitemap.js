export default function sitemap() {
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
    
    urls.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });
  
  return urls;
}
