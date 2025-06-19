import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import MobileMenu from '@/components/common/mobile-menu';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import '@/styles/blog.scss';

export const metadata = {
  title: 'Blog | DD Property',
};

// ฟังก์ชันสำหรับแสดงข้อมูลตามภาษา
const getLocalizedContent = (blog, field, locale) => {
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
  
  return { day, month };
};

async function fetchBlogs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Blog data:', data.data);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogPage({ searchParams , params }) {
  const blogs = await fetchBlogs();
console.log('Fetched blogs:', params);
const locale =  params.locale;
  if (!blogs || blogs.length === 0) {
    return (
      <div className="wrapper">
        <div className="container py-5 text-center">
          <p>No blogs found</p>
        </div>
      </div>
    );
  }

  // จัดการ pagination
  const ITEMS_PER_PAGE = 10;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  
  // แยกบทความที่จะแสดงในส่วนต่างๆ
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageBlogs = blogs.slice(startIndex, endIndex);
  
  // 3 บทความล่าสุดสำหรับ sidebar
  const latestPosts = blogs.slice(0, 3);

  return (
    <div className="wrapper">

      
      <div className="blog-main-page">
        <div className="container">

          <div className="row">
            <div className="col-lg-8">
              {/* Blog List */}
              <div className="blog-list">
                {currentPageBlogs.map((blog, index) => {
                  const blogDate = formatDate(blog.createdAt);
                  return (
                    <div className="blog-card" key={blog.id}>
                      <div className="blog-image">
                        <Image
                          width={800}
                          height={450}
                          src={blog.featuredImage || '/images/placeholder.jpg'}
                          alt={getLocalizedContent(blog, 'title', locale)}
                        />
                        <div className="date-badge">
                          <span className="month">{blogDate.month}</span>
                          <span className="day">{blogDate.day}</span>
                        </div>
                      </div>
                      <div className="blog-content">
                        <h5 className="title">
                          <Link href={`/blog/${blog.id}`}>{getLocalizedContent(blog, 'title', locale)}</Link>
                        </h5>
                        <p className="excerpt">
                          {getLocalizedContent(blog, 'content', locale)?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <ul className="pagination">
                    {page > 1 && (
                      <li className="page-item">
                        <Link href={`/blog?page=${page - 1}`} className="page-link">Previous</Link>
                      </li>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                        <Link href={`/blog?page=${pageNum}`} className="page-link">
                          {pageNum}
                        </Link>
                      </li>
                    ))}
                    
                    {page < totalPages && (
                      <li className="page-item">
                        <Link href={`/blog?page=${page + 1}`} className="page-link">Next</Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="col-lg-4">
              {/* Latest Posts Sidebar */}
              <div className="latest-posts">
                <h4>Latest Posts</h4>
                {latestPosts.map((post) => {
                  const postDate = formatDate(post.createdAt);
                  return (
                    <div className="post-item" key={post.id}>
                      <Link href={`/blog/${post.id}`}>
                        <Image
                          width={90}
                          height={80}
                          className="mr-3 rounded"
                          src={post.featuredImage ? `${post.featuredImage}` : '/images/placeholder.jpg'}
                          alt={getLocalizedContent(post, 'title', locale)}
                        />
                      </Link>
                      <div className="media-body">
                        <h6>
                          <Link href={`/blog/${post.id}`}>{getLocalizedContent(post, 'title', locale)}</Link>
                        </h6>
                        <p>{postDate.month} {postDate.day}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
}
