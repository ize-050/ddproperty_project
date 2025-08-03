"use client";

import useSimpleTranslations from '@/hooks/useDynamicTranslations';

const DynamicBlogContent = ({ children, blogs, currentPageBlogs, latestPosts, totalPages, page, locale }) => {
  const { t, loading, error } = useSimpleTranslations('blog');

  if (loading) {
    return (
      <div className="wrapper">
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Translation error:', error);
  }

  // ฟังก์ชันสำหรับแสดงข้อมูลตามภาษา
  const getLocalizedContent = (blog, field, locale) => {
    try {
      if (field === 'title' && blog.translatedTitles) {
        let translatedTitles = blog.translatedTitles;
        if (typeof translatedTitles === 'string') {
          translatedTitles = JSON.parse(translatedTitles);
        }
        return translatedTitles[locale] || blog.title;
      }
      
      if (field === 'content' && blog.translatedContents) {
        let translatedContents = blog.translatedContents;
        if (typeof translatedContents === 'string') {
          translatedContents = JSON.parse(translatedContents);
        }
        return translatedContents[locale] || blog.content;
      }
      
      if (field === 'title') return blog.title;
      if (field === 'content') return blog.content;
      
    } catch (error) {
      console.error('Error parsing translated content:', error);
      if (field === 'title') return blog.title;
      if (field === 'content') return blog.content;
    }
    
    return '';
  };

  // ฟังก์ชันสำหรับแปลงวันที่
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    
    return { day, month };
  };

  if (!blogs || blogs.length === 0) {
    return (
      <div className="wrapper">
        <div className="container py-5 text-center">
          <p>{t('no-blogs-found', 'No blogs found')}</p>
        </div>
      </div>
    );
  }

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
                        <img
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
                          <a href={`/blog/${blog.slug}`}>{getLocalizedContent(blog, 'title', locale)}</a>
                        </h5>
                        <p className="excerpt">
                          {getLocalizedContent(blog, 'content', locale)?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Smart Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <ul className="page_navigation">
                    {/* Previous button */}
                    <li className="page-item">
                      <a 
                        href={page > 1 ? `/blog?page=${page - 1}` : '#'} 
                        className={`page-link page-nav ${page === 1 ? 'disabled' : ''}`}
                      >
                        <i className="fas fa-chevron-left" />
                      </a>
                    </li>

                    {/* Smart pagination with ellipsis */}
                    {(() => {
                      const pages = [];
                      
                      if (totalPages <= 7) {
                        // แสดงทุกหน้าถ้าไม่เกิน 7 หน้า
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(
                            <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                              <a href={`/blog?page=${i}`} className="page-link page-number">
                                {i}
                              </a>
                            </li>
                          );
                        }
                      } else {
                        // Smart pagination สำหรับหน้าเยอะ
                        // หน้าแรก
                        pages.push(
                          <li key={1} className={`page-item ${page === 1 ? 'active' : ''}`}>
                            <a href="/blog?page=1" className="page-link page-number">
                              1
                            </a>
                          </li>
                        );
                        
                        // Ellipsis ซ้าย
                        if (page > 4) {
                          pages.push(
                            <li key="ellipsis-left" className="ellipsis">
                              <span className="page-ellipsis">...</span>
                            </li>
                          );
                        }
                        
                        // หน้าปัจจุบันและข้างเคียง
                        const start = Math.max(2, page - 1);
                        const end = Math.min(totalPages - 1, page + 1);
                        
                        for (let i = start; i <= end; i++) {
                          if (i !== 1 && i !== totalPages) {
                            pages.push(
                              <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                                <a href={`/blog?page=${i}`} className="page-link page-number">
                                  {i}
                                </a>
                              </li>
                            );
                          }
                        }
                        
                        // Ellipsis ขวา
                        if (page < totalPages - 3) {
                          pages.push(
                            <li key="ellipsis-right" className="ellipsis">
                              <span className="page-ellipsis">...</span>
                            </li>
                          );
                        }
                        
                        // หน้าสุดท้าย
                        if (totalPages > 1) {
                          pages.push(
                            <li key={totalPages} className={`page-item ${page === totalPages ? 'active' : ''}`}>
                              <a href={`/blog?page=${totalPages}`} className="page-link page-number">
                                {totalPages}
                              </a>
                            </li>
                          );
                        }
                      }
                      
                      return pages;
                    })()}

                    {/* Next button */}
                    <li className="page-item">
                      <a 
                        href={page < totalPages ? `/blog?page=${page + 1}` : '#'} 
                        className={`page-link page-nav ${page === totalPages ? 'disabled' : ''}`}
                      >
                        <i className="fas fa-chevron-right" />
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="col-lg-4">
              {/* Latest Posts Sidebar */}
              <div className="latest-posts">
                <h4>{t('latest-posts', 'Latest Posts')}</h4>
                {latestPosts.map((post) => {
                  const postDate = formatDate(post.createdAt);
                  return (
                    <div className="post-item" key={post.id}>
                      <a href={`/blog/${post.slug}`}>
                        <img
                          width={90}
                          height={80}
                          className="mr-3 rounded"
                          src={post.featuredImage ? `${post.featuredImage}` : '/images/placeholder.jpg'}
                          alt={getLocalizedContent(post, 'title', locale)}
                        />
                      </a>
                      <div className="media-body">
                        <h6>
                          <a href={`/blog/${post.slug}`}>{getLocalizedContent(post, 'title', locale)}</a>
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
};

export default DynamicBlogContent;
