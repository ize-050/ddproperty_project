'use client';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocale } from "next-intl";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          }
        });
        
        if (response.data && response.data.data) {
          setBlogs(response.data.data);
          console.log('Blog data:', response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ฟังก์ชันสำหรับแสดงข้อมูลตามภาษา
  const getLocalizedContent = (blog, field) => {
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
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: months[date.getMonth()],
      day: date.getDate()
    };
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <>
      {blogs.map((blog) => (
        <div className="blog-style1 large-size bgc-white" key={blog.id}>
          <div className="blog-img">
            <Image
              width={796}
              height={465}
              priority
              className="w-100 h-100 cover"
              src={blog.featuredImage || '/images/placeholder.jpg'}
              alt={getLocalizedContent(blog, 'title')}
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg';
                e.target.onerror = null;
              }}
            />
          </div>
          <div className="blog-content pl30 pb20">
            <div className="date">
              <span className="month">{formatDate(blog.createdAt).month}</span>
              <span className="day">{formatDate(blog.createdAt).day}</span>
            </div>
            <a className="tag" href="#">
              {blog.category || 'General'}
            </a>
            <h4 className="title mt-1 mb20">
              <Link href={`/blogs/${blog.id}`}>{getLocalizedContent(blog, 'title')}</Link>
            </h4>
            <p className="text">
              {getLocalizedContent(blog, 'content').replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Blog;
