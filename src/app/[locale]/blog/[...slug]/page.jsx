import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import MobileMenu from '@/components/common/mobile-menu';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import './page.scss';

// ฟังก์ชันสำหรับแสดงข้อมูลตามภาษา
const getLocalizedContent = (blog, field, locale) => {
  console.log(`Getting ${field} for locale: ${locale} in blog detail`);

  try {
    if (field === 'title' && blog.translatedTitles) {
      // Parse JSON string if needed
      let translatedTitles = blog.translatedTitles;
      if (typeof translatedTitles === 'string') {
        translatedTitles = JSON.parse(translatedTitles);
      }
      
      console.log("translatedTitles[locale]", translatedTitles[locale]);
      return translatedTitles[locale] || blog.title;
    }
    
    if (field === 'content' && blog.translatedContents) {
      // Parse JSON string if needed
      let translatedContents = blog.translatedContents;
      if (typeof translatedContents === 'string') {
        translatedContents = JSON.parse(translatedContents);
      }
      
      return translatedContents[locale] || blog.content;
    }
  } catch (error) {
    console.error(`Error parsing ${field}:`, error);
  }
  
  // Fallback to default fields if parsing fails
  if (field === 'title') return blog.title;
  if (field === 'content') return blog.content;
  
  return '';
};

// ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบที่ต้องการ
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
};

async function fetchBlogDetail(slug) {
  try {
    console.log('Fetching blog with slug:', slug);
    console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/blogs/slug/${slug}`);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/slug/${slug}`, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      },
      cache: 'no-store'
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch blog detail: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Blog detail data:', data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    return null;
  }
}

// Generate dynamic metadata for blog detail page
export async function generateMetadata({ params }) {
  console.log('generateMetadata params:', params);
  // Handle both single slug and array slug
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  console.log('Extracted slug:', slug);
  const blog = await fetchBlogDetail(slug);
  const locale = params.locale;
  
  if (!blog) {
    return {
      title: 'Blog Not Found | DD Property',
      description: 'The requested blog post could not be found.'
    };
  }

  // Always use English title for meta title
  const englishTitle = blog.title; // Default title is already in English
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.d-luckproperty.com';
  
  // Generate canonical URL based on locale
  const getCanonicalUrl = (locale) => {
    if (locale === 'th') {
      return `${baseUrl}/blog/${slug}`;
    }
    return `${baseUrl}/${locale}/blog/${slug}`;
  };

  const canonicalUrl = getCanonicalUrl(locale);

  // Generate alternate URLs for all languages
  const alternates = {
    canonical: canonicalUrl,
    languages: {
      'th': `${baseUrl}/blog/${slug}`,
      'en': `${baseUrl}/en/blog/${slug}`,
      'zh': `${baseUrl}/zh/blog/${slug}`,
      'ru': `${baseUrl}/ru/blog/${slug}`
    }
  };

  return {
    title: `${englishTitle} | DD Property`,
    description: blog.excerpt || `Read ${englishTitle} on DD Property blog`,
    alternates,
    openGraph: {
      title: `${englishTitle} | DD Property`,
      description: blog.excerpt || `Read ${englishTitle} on DD Property blog`,
      url: canonicalUrl,
      siteName: 'DD Property',
      images: [
        {
          url: blog.featuredImage || '/images/placeholder.jpg',
          width: 1200,
          height: 630,
          alt: englishTitle,
        },
      ],
      locale: locale,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${englishTitle} | DD Property`,
      description: blog.excerpt || `Read ${englishTitle} on DD Property blog`,
      images: [blog.featuredImage || '/images/placeholder.jpg'],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  console.log('BlogDetailPage params:', params);
  // Handle both single slug and array slug
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  console.log('BlogDetailPage extracted slug:', slug);
  const blog = await fetchBlogDetail(slug);
  const locale = params.locale;
  
  if (!blog) {
    return (
      <div className="wrapper">
        <div className="container py-5 text-center">
          <p>Blog not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="blog-detail-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="blog-header">
                <h1>{getLocalizedContent(blog, 'title', locale)}</h1>
                <div className="blog-meta">
                  <span className="date">{formatDate(blog.createdAt)}</span>
                  {blog.category && <span className="category">{blog.category}</span>}
                  {blog.author && <span className="author">By {blog.author}</span>}
                </div>
              </div>
              
              <div className="featured-image">
                <Image
                  src={blog.featuredImage || '/images/placeholder.jpg'}
                  alt={getLocalizedContent(blog, 'title', locale)}
                  width={1200}
                  height={600}
                  className="img-fluid rounded"
                />
              </div>
              
              <div className="blog-content">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: getLocalizedContent(blog, 'content', locale) 
                  }} 
                />
              </div>
              
              {/* <div className="blog-footer">
                <div className="back-to-blog">
                  <Link href="/blog" className="btn btn-outline-primary">
                    ← Back to Blog
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
