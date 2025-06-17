"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import blogService from '@/services/blogService';
import styles from './LatestBlogs.module.css';

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getLatestBlogs(3);
        console.log('Fetched blogs:', data); // Debug log
        setBlogs(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching latest blogs:', err);
        setError(t('error.fetch'));
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  // Get localized title based on current locale
  const getLocalizedTitle = (blog) => {
    // First try to get title from translatedTitles object based on current locale
    if (blog.translatedTitles && blog.translatedTitles[locale]) {
      return blog.translatedTitles[locale];
    }

    // Fallback to English if current locale not available
    if (blog.translatedTitles && blog.translatedTitles.en) {
      return blog.translatedTitles.en;
    }

    // Fallback to main title field if translations not available
    if (blog.title) {
      return blog.title;
    }

    // Last resort - try any available language
    if (blog.translatedTitles) {
      const availableLanguage = Object.keys(blog.translatedTitles)[0];
      if (availableLanguage) {
        return blog.translatedTitles[availableLanguage];
      }
    }

    // If all else fails
    return 'No title available';
  };

  // Get localized content based on current locale
  const getLocalizedContent = (blog) => {
    // First try to get content from translatedContents object based on current locale
    if (blog.translatedContents && blog.translatedContents[locale]) {
      return blog.translatedContents[locale];
    }

    // Fallback to English if current locale not available
    if (blog.translatedContents && blog.translatedContents.en) {
      return blog.translatedContents.en;
    }

    // Fallback to main content field if translations not available
    if (blog.content) {
      return blog.content;
    }

    // Last resort - try any available language
    if (blog.translatedContents) {
      const availableLanguage = Object.keys(blog.translatedContents)[0];
      if (availableLanguage) {
        return blog.translatedContents[availableLanguage];
      }
    }

    // If all else fails
    return '';
  };

  // Format date to display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Truncate text to a specified length
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    // Remove HTML tags before truncating
    const plainText = text.replace(/<[^>]*>?/gm, '');
    return plainText.length > maxLength ? plainText.slice(0, maxLength) + '...' : plainText;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  if (!blogs.length) {
    return null; // Don't show anything if no blogs
  }

  return (
    <>
      {blogs.map((blog) => (
        <div className="col-sm-6 col-lg-4" key={blog.id}>
          <div className="blog-style1">
            {blog.featuredImage ? (
              <div className="blog-img">
                <Image
                  src={blog.featuredImage}
                  alt={getLocalizedTitle(blog)}
                  width={386}
                  height={271}
                  className="w-100 cover"
                />
              </div>
            ) : (

              <div className={styles.noImage}></div>
            )}
            <div className="blog-content">
              <div className="date">
                <span className="day">
                  {new Date(blog.createdAt).getDate()}
                </span>
                <span className="month">
                  {new Date(blog.createdAt).toLocaleString('default', { month: 'short' })}
                </span>
              </div>
              <a className="tag" href="#">
                {blog.title}
              </a>
              <h6 className="title mt-1">
                <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
              </h6>

            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LatestBlogs;
