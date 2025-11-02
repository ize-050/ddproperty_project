'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import blogService from '@/services/blogService'

const OurBlog = () => {
  const locale = useLocale()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const data = await blogService.getLatestBlogs(2) // Get 2 latest blogs
        console.log('OurBlog - Fetched blogs:', data)
        setBlogs(data.data || [])
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Get localized title
  const getLocalizedTitle = (blog) => {
    if (blog.translatedTitles) {
      try {
        const translatedTitles = typeof blog.translatedTitles === 'string'
          ? JSON.parse(blog.translatedTitles)
          : blog.translatedTitles
        
        return translatedTitles[locale] || blog.title
      } catch (error) {
        console.error('Error parsing translatedTitles:', error)
      }
    }
    return blog.title || 'Untitled'
  }

  // Get localized content
  const getLocalizedContent = (blog) => {
    if (blog.translatedContents) {
      try {
        const translatedContents = typeof blog.translatedContents === 'string'
          ? JSON.parse(blog.translatedContents)
          : blog.translatedContents
        
        return translatedContents[locale] || blog.content
      } catch (error) {
        console.error('Error parsing translatedContents:', error)
      }
    }
    return blog.content || ''
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString(locale, { month: 'short' })
    return { day, month }
  }

  if (loading) {
    return null
  }

  if (!blogs || blogs.length === 0) {
    return null
  }

  return (
    <>
      <section className="pb90 pb20-md pt90 pt60-md">
        <div className="container">
          <div className="row align-items-center mb-5" data-aos="fade-up">
            <div className="col-lg-9">
              <div className="main-title2">
                <h2 className="title">
                  Our <span style={{ color: '#AF1A1E' }}>Blog</span>
                </h2>
                <p className="paragraph">
                  {(() => {
                    const translations = {
                      'en': 'Explore latest & featured properties for sale.',
                      'th': 'สำรวจอสังหาริมทรัพย์ล่าสุดและแนะนำสำหรับขาย',
                      'zh': '探索最新和精选待售房产',
                      'ru': 'Изучите последние и избранные объекты недвижимости на продажу'
                    }
                    return translations[locale] || translations['en']
                  })()}
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-start text-lg-end mb-3">
                <Link 
                  href={`/${locale !== 'th' ? locale + '/' : ''}blog`}
                  className="ud-btn2"
                  style={{
                    color: '#1a1a1a',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '50px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#AF1A1E'
                    e.currentTarget.style.color = '#AF1A1E'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                    e.currentTarget.style.color = '#1a1a1a'
                  }}
                >
                  {(() => {
                    const translations = {
                      'en': 'Explore All',
                      'th': 'ดูทั้งหมด',
                      'zh': '查看全部',
                      'ru': 'Посмотреть все'
                    }
                    return translations[locale] || translations['en']
                  })()}
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>

          <div className="row" data-aos="fade-up" data-aos-delay="200">
            {blogs.map((blog) => {
              const { day, month } = formatDate(blog.createdAt)
              const title = getLocalizedTitle(blog)
              const content = getLocalizedContent(blog)
              const excerpt = content?.replace(/<[^>]*>/g, '').substring(0, 150) || ''
              const blogImage = blog.featuredImage || '/images/blog/default-blog.jpg'

              return (
                <div className="col-md-6" key={blog.id}>
                  <div className="blog-style1 large-size mb30">
                    <div className="blog-img" style={{ position: 'relative', height: '400px', overflow: 'hidden', borderRadius: '12px' }}>
                      <Image
                        src={blogImage}
                        alt={title}
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/images/blog/default-blog.jpg'
                        }}
                      />
                    </div>
                    <div className="blog-content mt-3">
                      <div className="date mb-2">
                        <span className="day" style={{ 
                          fontSize: '24px', 
                          fontWeight: '700',
                          color: '#AF1A1E',
                          marginRight: '8px'
                        }}>
                          {day}
                        </span>
                        <span className="month" style={{ 
                          fontSize: '16px',
                          color: '#666'
                        }}>
                          {month}
                        </span>
                      </div>
                      <h4 className="title mb-2">
                        <Link 
                          href={`/${locale !== 'th' ? locale + '/' : ''}blog/${blog.slug}`}
                          style={{ 
                            color: '#1a1a1a',
                            textDecoration: 'none',
                            fontSize: '24px',
                            fontWeight: '600',
                            lineHeight: '1.4'
                          }}
                        >
                          {title}
                        </Link>
                      </h4>
                      <p className="text mb-3" style={{ 
                        color: '#666',
                        fontSize: '16px',
                        lineHeight: '1.6'
                      }}>
                        {excerpt}...
                      </p>
                      <Link 
                        href={`/${locale !== 'th' ? locale + '/' : ''}blog/${blog.slug}`}
                        className="ud-btn2"
                        style={{
                          color: '#AF1A1E',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {(() => {
                          const translations = {
                            'en': 'Read More',
                            'th': 'อ่านเพิ่มเติม',
                            'zh': '阅读更多',
                            'ru': 'Читать далее'
                          }
                          return translations[locale] || translations['en']
                        })()}
                        <i className="fal fa-arrow-right-long" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default OurBlog
