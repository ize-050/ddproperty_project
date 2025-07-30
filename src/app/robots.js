// Next.js App Router Dynamic Robots.txt
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ddproperty.com';
  
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
