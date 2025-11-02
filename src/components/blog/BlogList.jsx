'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import blogService from '@/services/blogService'
import ReactPaginate from 'react-paginate'
import HeaderTwo from '@/layouts/headers/HeaderTwo'
import FooterHomeThree from '@/components/homes/home-three/FooterHomeThree'

const BlogList = () => {
  const locale = useLocale()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [itemOffset, setItemOffset] = useState(0)

  const itemsPerPage = 5

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await blogService.getAllBlogs()
        console.log('Blogs fetched:', response)
        setBlogs(response.data || [])
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
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
  }

  // Pagination
  const endOffset = itemOffset + itemsPerPage
  const currentItems = blogs.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(blogs.length / itemsPerPage)

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % blogs.length
    setItemOffset(newOffset)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Latest posts for sidebar
  const latestPosts = blogs.slice(0, 3)

  return (
    <>
      <HeaderTwo style_1={true} style_2={false} />
      
      <div className="blog-section-three mt-150 xl-mt-100 mb-150 xl-mb-100">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <h1 className="page-title" style={{ fontSize: '48px', fontWeight: '700', color: '#1a1a1a' }}>
                Blog List
              </h1>
            </div>
          </div>

          <div className="row gx-xl-5">
            {/* Main Content */}
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : currentItems.length === 0 ? (
                <div className="text-center py-5">
                  <p>No blogs found.</p>
                </div>
              ) : (
                <>
                  {currentItems.map((blog) => {
                    const title = getLocalizedTitle(blog)
                    const content = getLocalizedContent(blog)
                    const excerpt = content?.replace(/<[^>]*>/g, '').substring(0, 200) || ''
                    const blogImage = blog.featuredImage || '/images/blog/default-blog.jpg'
                    const formattedDate = formatDate(blog.createdAt)

                    return (
                      <article key={blog.id} className="blog-meta-three mb-70 lg-mb-40 wow fadeInUp">
                        <figure className="post-img position-relative m0" style={{ 
                          height: '400px', 
                          overflow: 'hidden',
                          borderRadius: '12px',
                          marginBottom: '30px'
                        }}>
                          <Image
                            src={blogImage}
                            alt={title}
                            fill
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/images/blog/default-blog.jpg'
                            }}
                          />
                          <Link 
                            href={`/${locale !== 'th' ? locale + '/' : ''}blog/${blog.slug}`}
                            className="stretched-link fw-500 date tran3s"
                            style={{
                              position: 'absolute',
                              top: '20px',
                              left: '20px',
                              backgroundColor: '#1a1a1a',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '500',
                              zIndex: 2
                            }}
                          >
                            {formattedDate}
                          </Link>
                        </figure>
                        <div className="post-data">
                          <div className="post-info mb-2" style={{ color: '#6c757d', fontSize: '14px' }}>
                            <span>{formattedDate}</span>
                          </div>
                          <Link 
                            href={`/${locale !== 'th' ? locale + '/' : ''}blog/${blog.slug}`}
                            className="blog-title d-block"
                          >
                            <h4 style={{ 
                              fontSize: '28px', 
                              fontWeight: '600', 
                              color: '#1a1a1a',
                              marginBottom: '15px',
                              lineHeight: '1.4'
                            }}>
                              {title}
                            </h4>
                          </Link>
                          <p style={{ 
                            fontSize: '16px', 
                            color: '#6c757d', 
                            lineHeight: '1.8',
                            marginBottom: '20px'
                          }}>
                            {excerpt}...
                          </p>
                          <Link 
                            href={`/${locale !== 'th' ? locale + '/' : ''}blog/${blog.slug}`}
                            className="btn-eight"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '12px 24px',
                              border: '1px solid #e0e0e0',
                              borderRadius: '50px',
                              color: '#1a1a1a',
                              textDecoration: 'none',
                              fontSize: '15px',
                              fontWeight: '500',
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
                            <span>Read More</span>
                            <i className="bi bi-arrow-up-right"></i>
                          </Link>
                        </div>
                      </article>
                    )
                  })}

                  {/* Pagination */}
                  {pageCount > 1 && (
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel={<i className="bi bi-arrow-right"></i>}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      pageCount={pageCount}
                      previousLabel={<i className="bi bi-arrow-left"></i>}
                      renderOnZeroPageCount={null}
                      className="pagination-one square d-flex align-items-center justify-content-center style-none pt-30"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      activeClassName="active"
                    />
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="blog-sidebar md-mt-70">
                {/* Latest Posts */}
                <div className="sidebar-box bg-white border-20 mb-40">
                  <h4 className="sidebar-title" style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#1a1a1a',
                    marginBottom: '25px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    Latest Posts
                  </h4>
                  <ul className="style-none" style={{ listStyle: 'none', padding: 0 }}>
                    {latestPosts.map((post) => {
                      const title = getLocalizedTitle(post)
                      const formattedDate = formatDate(post.createdAt)
                      const postImage = post.featuredImage || '/images/blog/default-blog.jpg'

                      return (
                        <li key={post.id} className="mb-3" style={{ paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                          <Link 
                            href={`/${locale !== 'th' ? locale + '/' : ''}blog/${post.slug}`}
                            className="d-flex align-items-start"
                            style={{ textDecoration: 'none' }}
                          >
                            <div style={{ 
                              width: '80px', 
                              height: '80px', 
                              flexShrink: 0,
                              borderRadius: '8px',
                              overflow: 'hidden',
                              marginRight: '15px',
                              position: 'relative'
                            }}>
                              <Image
                                src={postImage}
                                alt={title}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div>
                              <h6 style={{ 
                                fontSize: '15px', 
                                fontWeight: '600', 
                                color: '#1a1a1a',
                                marginBottom: '5px',
                                lineHeight: '1.4'
                              }}>
                                {title}
                              </h6>
                              <span style={{ fontSize: '13px', color: '#999' }}>
                                {formattedDate}
                              </span>
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterHomeThree />
    </>
  )
}

export default BlogList
