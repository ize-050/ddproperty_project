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
    
    // Fallback to default fields
    if (field === 'title') return blog.title;
    if (field === 'content') return blog.content;
    
  } catch (error) {
    console.error('Error parsing translated content:', error);
    // Fallback to default fields if parsing fails
    if (field === 'title') return blog.title;
    if (field === 'content') return blog.content;
  }
  
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

async function fetchBlogDetail(id) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
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

export const metadata = {
  title: 'Blog Detail | DD Property',
};

export default async function BlogDetailPage({ params }) {
  const blog = await fetchBlogDetail(params.id);
  const locale =  params.locale
  if (!blog) {
    return (
      <div className="wrapper">
        <MobileMenu />
        <div className="container py-5 text-center">
          <p>Blog not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <MobileMenu />
      
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
                  priority
                />
              </div>
              
              <div className="blog-content">
                <div dangerouslySetInnerHTML={{ __html: getLocalizedContent(blog, 'content', locale) }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
