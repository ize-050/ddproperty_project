'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaPlus, FaSearch, FaEye, FaEyeSlash, FaEdit, FaTrash, FaTimes, FaChevronLeft, FaChevronRight, FaCopy, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useLocale } from "next-intl";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

//axios
import axios from 'axios';

//router
import { useRouter } from 'next/navigation';


export default function MyPropertiesPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('backoffice.myProperties');
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch properties from API
  useEffect(() => {

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

      // Set default isPublished for properties that don't have this field yet
      const propertiesWithDefaults = (data.properties || []).map(property => ({
        ...property,
        isPublished: property.isPublished !== undefined ? property.isPublished : true
      }));

      setProperties(propertiesWithDefaults);
      setTotalPages(data.totalPages || 1);
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
  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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

  const handleViewProperty = (propertyId) => {
    window.open(`/${locale}/property_detail/${propertyId}`, '_blank');
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
              <option value="viewCount">{t('sortBy.views')}</option>
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
                    onClick={() => handleColumnSort('projectName')}
                  >
                    {t('tableHeaders.property')} {getSortIcon('projectName')}
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
                          {property.images?.[0] ? (
                            <Image
                              src={process.env.NEXT_PUBLIC_IMAGE_URL + property.images?.[0]?.url}
                              alt={t('propertyImageAlt')}
                              width={50}
                              height={50}
                              className="property-image"
                            />
                          ) : (
                            <div className="placeholder-image">{t('noImage')}</div>
                          )}
                        </div>
                        <div className="property-info">
                          <p className="property-type">{property.listings?.map((listing) => listing.listingType).join(', ')}</p>
                          <p className="property-title">{property.projectName}</p>
                        </div>
                      </td>
                      <td className="reference-col">{property.reference}</td>
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
                          <button className="action-btn view-btn" onClick={() => handleViewProperty(property.id)}>
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

          {properties.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                <span>{t('pagination.page', { currentPage, totalPages })}</span>
              </div>

              <div className="pagination">
                <button className="pagination-arrow" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  <FaChevronLeft />
                </button>
                {/* Placeholder for page numbers if they are to be added later */}
                <button className="pagination-arrow" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  <FaChevronRight />
                </button>
              </div>

              <div className="pagination-size">
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page
                  }}
                >
                  {[10, 20, 50].map(n => (
                    <option key={n} value={n}>{t('pagination.itemsPerPage', { count: n })}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
};
