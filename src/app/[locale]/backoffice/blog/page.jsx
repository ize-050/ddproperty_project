'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaChevronDown, FaTimes, FaAngleLeft, FaAngleRight, FaChevronLeft, FaChevronRight, FaEye, FaPencilAlt, FaTrash as FaTrashIcon } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import axios from 'axios';
import {format} from 'date-fns';
import Swal from 'sweetalert2';

// Import SCSS
import '@/styles/backoffice/blog.scss';

// Pagination Component
const BlogPagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, total, perPage } = pagination;

  // ฟังก์ชันสำหรับไปหน้าก่อนหน้า
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // ฟังก์ชันสำหรับไปหน้าถัดไป
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // สร้างรายการปุ่มสำหรับหน้าต่างๆ
  const renderPaginationItems = () => {
    const items = [];

    // ปุ่มย้อนกลับ
    items.push(
      <li className="page-item" key="prev">
        <span
          className="page-link pointer"
          onClick={handlePrevious}
          style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          <span className="fas fa-angle-left" />
        </span>
      </li>
    );

    // แสดงหน้าแรก
    items.push(
      <li 
        className={currentPage === 1 ? "active page-item" : "page-item"} 
        key={1}
        onClick={() => onPageChange(1)}
      >
        <span className="page-link pointer">1</span>
      </li>
    );

    // หน้าที่ 2 (ถ้ามี)
    if (totalPages > 1) {
      items.push(
        <li 
          className={currentPage === 2 ? "active page-item" : "page-item"} 
          key={2}
          onClick={() => onPageChange(2)}
        >
          <span className="page-link pointer">2</span>
        </li>
      );
    }

    // หน้าที่ 3 (ถ้ามี)
    if (totalPages > 2) {
      items.push(
        <li 
          className={currentPage === 3 ? "active page-item" : "page-item"} 
          key={3}
          onClick={() => onPageChange(3)}
        >
          <span className="page-link pointer">3</span>
        </li>
      );
    }

    // แสดงจุดไข่ปลาถ้ามีหน้ามากกว่า 4 หน้าและหน้าปัจจุบันไม่ใช่ 4
    if (totalPages > 4 && currentPage !== 4) {
      items.push(<li key="ellipsis" className="ellipsis"><span>...</span></li>);
    }

    // แสดงหน้าปัจจุบันถ้ามากกว่า 3
    if (currentPage > 3 && currentPage !== totalPages) {
      items.push(
        <li 
          className="active page-item" 
          key={currentPage}
        >
          <span className="page-link pointer">{currentPage}</span>
        </li>
      );
    }

    // แสดงหน้าสุดท้ายถ้ามีมากกว่า 3 หน้า
    if (totalPages > 3) {
      items.push(
        <li 
          className={currentPage === totalPages ? "active page-item" : "page-item"} 
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <span className="page-link pointer">{totalPages}</span>
        </li>
      );
    }

    // ปุ่มถัดไป
    items.push(
      <li className="page-item" key="next">
        <span
          className="page-link pointer"
          onClick={handleNext}
          style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
        >
          <span className="fas fa-angle-right" />
        </span>
      </li>
    );

    return items;
  };

  // คำนวณจำนวนรายการที่แสดงในหน้าปัจจุบัน
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, total);

  const t = useTranslations('Blog');

  return (
    <div className="mbp_pagination text-center">
      <ul className="page_navigation">
        {renderPaginationItems()}
      </ul>
      <p className="mt10 pagination_page_count text-center">
        {t('pagination', { start: startItem, end: endItem, total: total })}
      </p>
    </div>
  );
};

const BlogPage = () => {
  const router = useRouter();
  const t = useTranslations('Blog');
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        perPage: 10,
        totalPages: 0
    });
  

  
  // โหลดข้อมูลใหม่เมื่อมีการค้นหาหรือเปลี่ยนการเรียงลำดับ
  useEffect(() => {
    getPosts(pagination.currentPage);
  }, [searchQuery, sortBy]);
  
  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    // อัปเดตหน้าปัจจุบัน
    setPagination({
      ...pagination,
      currentPage: newPage
    });
    
    // เลื่อนขึ้นไปที่ตารางบทความ
    document.querySelector('.posts-table-container').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    // แสดง loading effect
    const tableBody = document.querySelector('.posts-table tbody');
    if (tableBody) {
      tableBody.style.opacity = '0.5';
      tableBody.style.transition = 'opacity 0.3s';
      
      setTimeout(() => {
        // เรียกข้อมูลบทความสำหรับหน้านี้
        fetchPosts(newPage);
        
        // คืนค่า opacity หลังจากโหลดข้อมูลเสร็จ
        setTimeout(() => {
          tableBody.style.opacity = '1';
        }, 300);
      }, 300);
    } else {
      // ถ้าไม่พบ tableBody ให้เรียก API ทันที
      fetchPosts(newPage);
    }
  };
  const getPosts = async () => {

    // In a real application, you would fetch this data from an API
    //create axios
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs`,
        {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
    );
    if (response.status === 200) {
      setPosts(response.data.data);
      setPagination({
        total: response.data.pagination.total,
        currentPage: response.data.pagination.page,
        perPage: response.data.pagination.limit,
        totalPages: Math.ceil(response.data.pagination.total / response.data.pagination.limit)
      })
    }
  }


  useEffect(() => {
    getPosts();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleAddPost = () => {
    router.push('/backoffice/blog/add');
  };

  // ฟังก์ชันสำหรับแก้ไขบทความ
  const handleEdit = (id) => {
    router.push(`/backoffice/blog/edit?id=${id}`);
  };

  // ฟังก์ชันสำหรับดูรายละเอียดบทความ - เปิด tab ใหม่ไปยังหน้า frontend
  const handleView = (slug) => {
    // เปิด tab ใหม่ไปยังหน้า frontend blog detail
    window.open(`/blog/${slug}`, '_blank');
  };

  const handleDelete = async (id) => {
    // ใช้ SweetAlert2 แทน window.confirm
    Swal.fire({
      title: t('deleteDialog.title'),
      text: t('deleteDialog.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('deleteDialog.confirmButton'),
      cancelButtonText: t('deleteDialog.cancelButton')
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // เรียกใช้ API เพื่อลบบทความ
          const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`, {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (response.status === 200 || response.status === 204) {
            // แสดงข้อความแจ้งเตือนว่าลบสำเร็จด้วย SweetAlert2
            Swal.fire(
              t('toast.successDeleteTitle'),
              t('toast.successDelete'),
              'success'
            );
            
            // โหลดข้อมูลใหม่จาก API
            getPosts();
          } else {
            Swal.fire(
              t('toast.errorDeleteTitle'),
              t('toast.errorDelete'),
              'error'
            );
          }
        } catch (error) {
          console.error('Error deleting post:', error);
          Swal.fire(
            t('toast.errorDeleteTitle'),
            error.response?.data?.message || t('toast.errorDelete'),
            'error'
          );
        }
      }
    });
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort posts based on sort option
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.publishedDate) - new Date(a.publishedDate);
    }
    return 0;
  });

  return (
      <div className="blog-page">
        <div className="blog-container">
          <div className="page-header">
            <h1>{t('viewAll')}</h1>
            <p>{t('viewAllSubtitle')}</p>
          </div>
          
          <div className="actions-bar">
            <div className="search-container">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearch}
              />
              <FaSearch className="search-icon" />
              {searchQuery && (
                <button 
                  className="clear-button"
                  onClick={handleClear}
                >
                  <FaTimes />
                  {t('clearButton')}
                </button>
              )}
            </div>
            
            <div className="actions-right">
              <div className="sort-container">
                <select
                  value={sortBy}
                  onChange={handleSort}
                >
                  <option value="date">{t('sortBy.date')}</option>
                  <option value="title">{t('sortBy.title')}</option>
                  <option value="category">{t('sortBy.category')}</option>
                </select>
                <FaChevronDown className="select-arrow" />
              </div>
              
              <button
                onClick={handleAddPost}
                className="add-button"
              >
                <FaPlus />
                <span>{t('createNew')}</span>
              </button>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="blog-table">
              <thead>
                <tr>
                  <th>{t('table.title')}</th>
                  <th>{t('table.date')}</th>
                  <th>{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedPosts.map((post) => (
                  <tr key={post.id}>

                    <td>
                      <div className="title-cell">
                        <img 
                          src={post.featuredImage}
                          alt={post.title} 
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                        <span className="post-title">{post.title}</span>
                      </div>
                    </td>
                    <td className="date-cell">{post?.createdAt ? format(new Date(post.createdAt), 'dd/MM/yyyy') : 'N/A'}</td>
                    <td className="actions-cell">
                      <div className="flex space-x-2">
                        <a
                          onClick={() => handleView(post.slug)}
                          className="mr-5"
                          style={{  marginRight:'5px', cursor:'pointer'}}
                          title="View"
                        >
                          <FaEye class={"dark-color mr-5"} />
                        </a>
                        <a
                          onClick={() => handleEdit(post.id)}
                          className="mr-5"
                          style={{  marginRight:'5px' , cursor:'pointer'}}
                          title="Edit"
                        >
                          <FaPencilAlt class={"dark-color mr-5"} />
                        </a>
                        <a
                          onClick={() => handleDelete(post.id)}
                          className="mr-5 "
                          title="Delete"
                          style={{  marginRight:'5px', cursor:'pointer'}}
                        >
                          <FaTrashIcon  class={"dark-color mr-5"}/>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {posts.length > 0 && (
                <div className="pagination-container">
                  <BlogPagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                  />
                </div>
            )}
          </div>
        </div>
      </div> 
  );
};

export default BlogPage;
