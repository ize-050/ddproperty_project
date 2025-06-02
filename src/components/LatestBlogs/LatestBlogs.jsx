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
  const t = useTranslations('blogs');
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
  }, [t]);

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
    <div className={styles.blogGrid}>
      {blogs.map(blog => (
        <Link href={`/blog/${blog.slug || blog.id}`} key={blog.id} className={styles.blogCard}>
          <div className={styles.imageContainer}>
            {blog.featuredImage ? (
              <Image
                src={blog.featuredImage}
                alt={getLocalizedTitle(blog)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image}
              />
            ) : (
              <div className={styles.noImage}></div>
            )}
            <div className={styles.dateOverlay}>
              <span className={styles.day}>
                {new Date(blog.createdAt).getDate()}
              </span>
              <span className={styles.month}>
                {new Date(blog.createdAt).toLocaleString('default', { month: 'short' })}
              </span>
            </div>
          </div>
          <div className={styles.contentContainer}>
            <h3 className={styles.title}>{getLocalizedTitle(blog)}</h3>
            <p className={styles.excerpt}>
              {truncateText(getLocalizedContent(blog), 100)}
            </p>
            <div className={styles.meta}>
              <span className={styles.date}>{formatDate(blog.createdAt)}</span>
              {blog.user && (
                <span className={styles.author}>
                  <span className={styles.authorBy}>By</span> {blog.user.name}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LatestBlogs;
