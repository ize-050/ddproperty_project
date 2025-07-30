// Next.js App Router Dynamic Sitemap
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ddproperty.com';
  const locales = ['en', 'th', 'zh', 'ru'];
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/properties/sale',
    '/properties/rent',
    '/blog'
  ];

  // Generate static page URLs for all locales
  const staticUrls = [];
  locales.forEach(locale => {
    staticPages.forEach(page => {
      staticUrls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    });
  });

  // Fetch dynamic content
  let propertyUrls = [];
  let blogUrls = [];

  try {
    // Fetch properties
    const propertiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
      cache: 'no-store'
    });
    
    if (propertiesResponse.ok) {
      const properties = await propertiesResponse.json();
      
      locales.forEach(locale => {
        properties.forEach(property => {
          propertyUrls.push({
            url: `${baseUrl}/${locale}/properties/${property.id}`,
            lastModified: new Date(property.updatedAt || property.createdAt),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      });
    }

    // Fetch blogs
    const blogsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
      cache: 'no-store'
    });
    
    if (blogsResponse.ok) {
      const blogs = await blogsResponse.json();
      
      locales.forEach(locale => {
        blogs.forEach(blog => {
          blogUrls.push({
            url: `${baseUrl}/${locale}/blog/${blog.id}`,
            lastModified: new Date(blog.updatedAt || blog.createdAt),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        });
      });
    }
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
  }

  // Combine all URLs
  return [
    ...staticUrls,
    ...propertyUrls,
    ...blogUrls,
  ];
}
