'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaEye, FaPencilAlt, FaTrash as FaTrashIcon, FaSort, FaSortUp, FaSortDown, FaCopy, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useLocale } from "next-intl";
import { useRouter } from 'next/navigation';
import createSlug from '@/utils/slugify';
import axios from 'axios';



function MyPropertiesPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('backoffice.myProperties');
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch properties from API
  useEffect(() => {
    console.log('Fetching with params:', { currentPage, searchTerm, sortBy, sortOrder, itemsPerPage });
    fetchProperties();
  }, [currentPage, searchTerm, sortBy, sortOrder, itemsPerPage]);


  const fetchProperties = async () => {
    try {
      setLoading(true);

      // API endpoint with pagination and search parameters
      const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/properties/backoffice/my-properties`);
      apiUrl.searchParams.append('page', currentPage);
      apiUrl.searchParams.append('limit', itemsPerPage);
      apiUrl.searchParams.append('sortBy', sortBy);
      apiUrl.searchParams.append('sortOrder', sortOrder);

      if (searchTerm) {
        apiUrl.searchParams.append('search', searchTerm);
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error(t('errors.authTokenNotFound'));
      }

      const response = await fetch(apiUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t('errors.fetchError', { error: response.statusText }));
      }

      const data = await response.json();

      // Debug logging for pagination
      console.log('API Response data:', {
        properties: data.properties?.length || 0,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        hasNext: data.hasNext,
        hasPrev: data.hasPrev
      });

      // Set default isPublished for properties that don't have this field yet
      const propertiesWithDefaults = (data.properties || []).map(property => ({
        ...property,
        isPublished: property.isPublished !== undefined ? property.isPublished : true
      }));

      setProperties(propertiesWithDefaults);
      
      // Calculate totalPages from total and itemsPerPage
      const calculatedTotalPages = Math.ceil((data.total || 0) / itemsPerPage);
      setTotalPages(data.totalPages || calculatedTotalPages || 1);
      setTotalItems(data.total || 0);

      // Debug current pagination state
      console.log('Updated pagination state:', {
        currentPage,
        totalPages: data.totalPages || calculatedTotalPages || 1,
        totalItems: data.total || 0,
        itemsPerPage,
        calculatedTotalPages
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };



  const handleDeleteProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('auth_token');

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

          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }).then((response) => {
            toast.success(t('toast.deleteSuccess'));
            fetchProperties();
          }).catch((error) => {
            console.log(error);
            toast.error(t('toast.deleteError'));
          });

        }
      })

    }
    catch (err) {
      Swal.fire({
        icon: 'error',
        title: t('errorDialog.title'),
        text: t('errorDialog.text'),
      })
    }
  }
  // Handle pagination - Blog style
  const handlePageChange = (page) => {
    console.log('handlePageChange called:', {
      requestedPage: page,
      currentPage,
      totalPages,
      totalItems,
      isValidPage: page >= 1 && page <= totalPages
    });

    if (page < 1 || page > totalPages || totalPages === 0) {
      console.log('Page change rejected: out of range or no pages');
      return;
    }

    console.log('Setting current page to:', page);
    setCurrentPage(page);

    // Scroll to table for better UX
    const tableContainer = document.querySelector('.properties-table-container');
    if (tableContainer) {
      tableContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Add loading effect
    const tableBody = document.querySelector('.properties-table tbody');
    if (tableBody) {
      tableBody.style.opacity = '0.5';
      tableBody.style.transition = 'opacity 0.3s';

      // Restore opacity after data loads
      setTimeout(() => {
        if (tableBody) {
          tableBody.style.opacity = '1';
        }
      }, 500);
    }
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle column header click for sorting
  const handleColumnSort = (column) => {
    if (sortBy === column) {
      // If clicking the same column, toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new column, set it as sortBy and default to desc
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Get sort icon for column headers
  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <FaSort className="sort-icon neutral" />;
    }
    return sortOrder === 'asc'
      ? <FaSortUp className="sort-icon asc" />
      : <FaSortDown className="sort-icon desc" />;
  };

  // Format price based on whether it's for rent or sale
  const formatPrice = (price, isRent = false) => {
    const formatter = new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    });

    return isRent
      ? `${formatter.format(price)}${t('priceUnit')}`
      : formatter.format(price);
  };

  // Function to duplicate property
  const handleDuplicateProperty = (propertyId) => {
    // Navigate to the duplicate property page in new tab
    window.open(`/${locale}/backoffice/duplicate-property/${propertyId}`, '_blank');

    // Refresh current page after opening new tab
    setTimeout(() => {
      window.location.reload();
    }, 500); // รอ 500ms เพื่อให้ new tab เปิดก่อน
  };

  const handleEditProperty = (propertyId) => {
    window.location.href = `/${locale}/backoffice/edit-property/${propertyId}/`;
  }

  const handleViewProperty = (property) => {
    const slug = createSlug(property.title);
    window.open(`/${locale}/property_detail/${property.id}/${slug}`, '_blank');
  }

  const handleTogglePropertyPublished = async (propertyId, currentIsPublished) => {
    try {
      const newIsPublished = !currentIsPublished;
      const token = localStorage.getItem('auth_token');

      // Optimistically update UI first (no reload needed)
      setProperties(prevProperties =>
        prevProperties.map(property =>
          property.id === propertyId
            ? { ...property, isPublished: newIsPublished }
            : property
        )
      );

      // Use dedicated status update endpoint
      const requestBody = { status: newIsPublished ? 'ACTIVE' : 'INACTIVE' };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Revert the optimistic update if API call fails
        setProperties(prevProperties =>
          prevProperties.map(property =>
            property.id === propertyId
              ? { ...property, isPublished: currentIsPublished }
              : property
          )
        );
        throw new Error(t('toast.updateStatusError'));
      }

      const status = newIsPublished ? t('status.published') : t('status.unpublished');
      toast.success(t('toast.updateStatusSuccess', { status: status.toLowerCase() }));
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error(t('toast.updateStatusError'));
    }
  }

  return (
    <>
      <style jsx>{`
        .pointer {
          cursor: pointer !important;
        }
        .mbp_pagination {
          margin-top: 20px;
        }
        .mbp_pagination ul {
          margin: 0;
          padding: 0;
        }
        .mbp_pagination .page_navigation {
          margin-bottom: 0;
          text-align: center;
          width: 100%;
        }
        .mbp_pagination .page-item {
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
          transition: all 0.4s ease;
        }
        .mbp_pagination .page-item:hover {
          background-color: #ededed;
        }
        .mbp_pagination .page-item:first-child,
        .mbp_pagination .page-item:last-child {
          background-color: #ffffff;
          box-shadow: 0px 1px 4px rgba(24, 26, 32, 0.07);
        }
        .mbp_pagination .page-item.active .page-link {
          background-color: #ff6b35;
          color: #ffffff;
          box-shadow: none;
        }
        .mbp_pagination .page-link {
          background-color: transparent;
          border: none;
          border-radius: 50%;
          color: #333;
          font-weight: 400;
          font-size: 15px;
          height: 40px;
          line-height: 40px;
          overflow: hidden;
          padding: 0;
          text-align: center;
          width: 40px;
          display: inline-block;
        }
        .mbp_pagination .ellipsis {
          display: inline-block;
          margin-right: 6px;
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #666;
        }
        .mt10 {
          margin-top: 10px;
        }
        .pagination_page_count {
          color: #666;
          font-size: 14px;
          margin: 0;
        }
        .text-center {
          text-align: center;
        }
        .property-code-col {
          width: 120px;
          min-width: 120px;
          text-align: center;
          font-weight: 500;
          color: #666;
        }
      `}</style>
      <div className="my-properties-page">
        <div className="page-header">
          <div className="header-title">
            <h2>{t('title')}</h2>
            <p>{t('subtitle')}</p>
          </div>

          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <button className="search-icon">
                <FaSearch />
              </button>
            </div>

            <div className="sort-container">
              <select
                className="sort-select"
                onChange={handleSortChange}
                value={sortBy}
              >
                <option value="createdAt">{t('sortBy.date')}</option>
                <option value="price">{t('sortBy.price')}</option>
              </select>
            </div>

            {searchTerm && (
              <button className="clear-btn" onClick={clearSearch}>
                <FaTimes />
                <span>{t('clear')}</span>
              </button>
            )}

            <a href="/backoffice/add-property" className="add-property-btn " style={{
              borderRadius: '10px'
            }}>
              <span style={{ fontWeight: '500' }}>{t('addNew')}</span>
            </a>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              {t('retry')}
            </button>
          </div>
        ) : (
          <>

            <div className="properties-table-container"
              style={{ overflowX: 'auto' }}
            >
              <table className="properties-table">
                <thead>
                  <tr>
                    <th
                      className="property-col sortable-header"
                      onClick={() => handleColumnSort('title')}
                    >
                      {t('tableHeaders.property')} {getSortIcon('title')}
                    </th>
                    <th
                      className="property-code-col sortable-header"
                      onClick={() => handleColumnSort('propertyCode')}
                    >
                      {t('tableHeaders.propertyCode')} {getSortIcon('propertyCode')}
                    </th>
                    <th
                      className="reference-col sortable-header"
                      onClick={() => handleColumnSort('referenceId')}
                    >
                      {t('tableHeaders.reference')} {getSortIcon('referenceId')}
                    </th>
                    <th className="operation-col">{t('tableHeaders.operation')}</th>
                    <th
                      className="price-col sortable-header"
                      onClick={() => handleColumnSort('price')}
                    >
                      {t('tableHeaders.price')} {getSortIcon('price')}
                    </th>
                    <th
                      className="published-col sortable-header"
                      onClick={() => handleColumnSort('isPublished')}
                    >
                      {t('tableHeaders.published')} {getSortIcon('isPublished')}
                    </th>
                    <th
                      className="displays-col sortable-header"
                      onClick={() => handleColumnSort('viewCount')}
                    >
                      {t('tableHeaders.displays')} {getSortIcon('viewCount')}
                    </th>
                    <th className="visits-col">{t('tableHeaders.visits')}</th>
                    <th className="enquiries-col">{t('tableHeaders.enquiries')}</th>
                    <th
                      className="date-col sortable-header"
                      onClick={() => handleColumnSort('createdAt')}
                    >
                      {t('tableHeaders.date')} {getSortIcon('createdAt')}
                    </th>
                    <th className="actions-col">{t('tableHeaders.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length > 0 ? (
                    properties.map((property, index) => (
                      <tr key={property.id} className={index % 2 === 0 ? 'odd-row' : 'even-row'}>
                        <td className="property-col">
                          <div className="property-image-container">
                            {(() => {
                              // เรียงรูปภาพตาม sortOrder ก่อนแสดงรูปแรก
                              const sortedImages = property.images?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                              const firstImage = sortedImages?.[0];

                              return firstImage ? (
                                <Image
                                  src={process.env.NEXT_PUBLIC_IMAGE_URL + firstImage.url}
                                  alt={t('propertyImageAlt')}
                                  width={50}
                                  height={50}
                                  className="property-image"
                                />
                              ) : (
                                <div className="placeholder-image">{t('noImage')}</div>
                              );
                            })()}
                          </div>
                          <div className="property-info">
                            <p className="property-type">{property.listings?.map((listing) => listing.listingType).join(', ')}</p>
                            <p className="property-title">{property.title}</p>
                          </div>
                        </td>
                        <td className="property-code-col">{property.property_code || property.propertyCode || '-'}</td>
                        <td className="reference-col">{property.referenceId}</td>
                        <td className="operation-col">{property.listings?.map((listing) => listing.listingType).join(', ')}</td>
                        <td className="price-col">{property.listings?.map((listing) => formatPrice(listing.price, listing.isRent)).join(', ')}</td>
                        <td className="published-col">
                          <span className={`status-badge ${property.isPublished ? 'active' : 'inactive'}`}>
                            {property.isPublished ? t('status.published') : t('status.unpublished')}
                          </span>
                        </td>
                        <td className="displays-col">{property.viewCount || 0}</td>
                        <td className="visits-col">{property.viewCount || 0}</td>
                        <td className="enquiries-col">{property.inquiryCount || 0}</td>
                        <td className="date-col">{property.formattedDate}</td>
                        <td className="actions-col">
                          <div className="action-buttons">
                            <button className="action-btn view-btn" onClick={() => handleViewProperty(property)}>
                              <FaEye />
                            </button>
                            <button className="action-btn duplicate-btn" onClick={() => handleDuplicateProperty(property.id)}>
                              <FaCopy />
                            </button>
                            <button className="action-btn edit-btn" onClick={() => handleEditProperty(property.id)}>
                              <FaEdit />
                            </button>
                            <button className="action-btn delete-btn" onClick={() => handleDeleteProperty(property.id)}>
                              <FaTrash />
                            </button>
                            <button
                              className={`action-btn toggle-publish-btn ${property.isPublished ? 'unpublish' : 'publish'}`}
                              onClick={() => handleTogglePropertyPublished(property.id, property.isPublished)}
                            >
                              {property.isPublished ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="no-properties-found">
                        <h2>{t('noProperties.title')}</h2>
                        <p>{t('noProperties.subtitle')}</p>
                        <a href="/backoffice/add-property" className="add-property-btn">
                          <FaPlus />
                          <span>{t('addNew')}</span>
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {properties.length > 0 && (
              <div className="mbp_pagination text-center">
                <ul className="page_navigation">
                  {/* Previous button */}
                  <li className="page-item">
                    <span
                      className="page-link pointer"
                      onClick={() => {
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                      <span className="fas fa-angle-left" />
                    </span>
                  </li>

                  {/* Always show page 1 */}
                  <li 
                    className={currentPage === 1 ? "active page-item" : "page-item"} 
                    onClick={() => handlePageChange(1)}
                  >
                    <span className="page-link pointer">1</span>
                  </li>

                  {/* Show page 2 if total pages > 1 */}
                  {totalPages > 1 && (
                    <li 
                      className={currentPage === 2 ? "active page-item" : "page-item"} 
                      onClick={() => handlePageChange(2)}
                    >
                      <span className="page-link pointer">2</span>
                    </li>
                  )}

                  {/* Show page 3 if total pages > 2 */}
                  {totalPages > 2 && (
                    <li 
                      className={currentPage === 3 ? "active page-item" : "page-item"} 
                      onClick={() => handlePageChange(3)}
                    >
                      <span className="page-link pointer">3</span>
                    </li>
                  )}

                  {/* Show ellipsis if there are more than 4 pages */}
                  {totalPages > 4 && (
                    <li className="ellipsis"><span>...</span></li>
                  )}

                  {/* Show last page if total pages > 3 */}
                  {totalPages > 3 && (
                    <li 
                      className={currentPage === totalPages ? "active page-item" : "page-item"} 
                      onClick={() => handlePageChange(totalPages)}
                    >
                      <span className="page-link pointer">{totalPages}</span>
                    </li>
                  )}

                  {/* Next button */}
                  <li className="page-item">
                    <span
                      className="page-link pointer"
                      onClick={() => {
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                      <span className="fas fa-angle-right" />
                    </span>
                  </li>
                </ul>
                
                <p className="mt10 pagination_page_count text-center">
                  แสดงผลลัพธ์ {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)}, หน้า {currentPage} จากทั้งหมด {totalPages} หน้า
                </p>
              </div>
            )}
          
        </>
      )}
    </div>
    </>
  );
}

export default MyPropertiesPage;
