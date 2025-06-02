'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocale } from 'next-intl';

export default function Details({ id }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          }
        });
        
        if (response.data && response.data.data) {
          setBlog(response.data.data);
          console.log('Blog detail:', response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog details:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  // ฟังก์ชันสำหรับแสดงข้อมูลตามภาษา
  const getLocalizedContent = (field) => {
    if (!blog) return '';

    // ถ้าเป็นภาษาอังกฤษ ใช้ฟิลด์หลัก
    if (locale === 'en') {
      return blog[field];
    }

    // สำหรับภาษาอื่นๆ ดึงจาก translated fields
    try {
      if (field === 'title' && blog.translated_titles) {
        const translatedTitles = typeof blog.translated_titles === 'string' 
          ? JSON.parse(blog.translated_titles) 
          : blog.translated_titles;
        
        return translatedTitles[locale] || blog[field];
      }
      
      if (field === 'content' && blog.translated_contents) {
        const translatedContents = typeof blog.translated_contents === 'string' 
          ? JSON.parse(blog.translated_contents) 
          : blog.translated_contents;
        
        return translatedContents[locale] || blog[field];
      }
    } catch (error) {
      console.error('Error parsing translated content:', error);
    }

    // ถ้าไม่มีข้อมูลแปล ใช้ข้อมูลภาษาอังกฤษ
    return blog[field];
  };

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบที่ต้องการ
  const formatDate = (dateString) => {
    if (!dateString) return { day: '', month: '', year: '' };
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: months[date.getMonth()],
      day: date.getDate(),
      year: date.getFullYear()
    };
  };

  if (loading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center py-5">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center py-5">
            <p>Blog not found</p>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = formatDate(blog.createdAt);

  return (
    <>
     <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-12">
              <h2 className="blog-title">
                {getLocalizedContent('title')}
              </h2>
              <div className="blog-single-meta">
                <div className="post-author d-sm-flex align-items-center">
                  <Image
                    width={40}
                    height={40}
                    className="mr10"
                    src={blog.authorImage || '/images/blog/author-1.png'}
                    alt={blog.author || 'Admin'}
                    onError={(e) => {
                      e.target.src = '/images/blog/author-1.png';
                      e.target.onerror = null;
                    }}
                  />
                  <a className="pr15 bdrr1" href="#">
                    {blog.author || 'Admin'}
                  </a>
                  <a className="ml15 pr15 bdrr1" href="#">
                    {blog.category || 'General'}
                  </a>
                  <a className="ml15" href="#">
                    {formattedDate.month} {formattedDate.day}, {formattedDate.year}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End .container */}

        <div
          className="mx-auto maxw1600 mt60"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="large-thumb">
                <Image
                  width={1200}
                  height={600}
                  className="w-100 h-100 cover"
                  src={blog.featuredImage || '/images/placeholder.jpg'}
                  alt={getLocalizedContent('title')}
                  priority
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                    e.target.onerror = null;
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="roww" data-aos="fade-up" data-aos-delay="500">
            <div className="col-xl-8 offset-xl-2">
              <div className="ui-content mt40 mb60 blog-content">
                <div dangerouslySetInnerHTML={{ __html: getLocalizedContent('content') }} />
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
