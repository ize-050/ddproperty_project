// Next.js App Router Dynamic Robots.txt
export default function robots() {
  const baseUrl = "https://www.d-luckproperty.com";
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/backoffice/',
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/backoffice/',
          '/api/',
          '/admin/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
