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
  const t = useTranslations('Backoffice');
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
        throw new Error('Authentication token not found');
      }

      const response = await fetch(apiUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching properties: ${response.statusText}`);
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
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {

          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }).then((response) => {
            console.log(response);
          }).catch((error) => {
            console.log(error);
          });

        }
        fetchProperties();
      })

    }
    catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong',
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
      ? `${formatter.format(price)}/month`
      : formatter.format(price);
  };

  // Function to duplicate property
  const handleDuplicateProperty = (propertyId) => {
    // Navigate to the duplicate property page in new tab
    window.open(`/${locale}/backoffice/duplicate-property/${propertyId}`, '_blank');
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
        throw new Error('Failed to update property status');
      }

      toast.success(`Property ${newIsPublished ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    }
  }

  return (
    <div className="my-properties-page">
      <div className="page-header">
        <div className="header-title">
          <h2>My Properties</h2>
          <p>Manage your property listings</p>
        </div>

        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search properties..."
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
              <option value="createdAt">Sort by: Date Added</option>
              <option value="price">Sort by: Price</option>
              <option value="viewCount">Sort by: Views</option>
            </select>
          </div>

          {searchTerm && (
            <button className="clear-btn" onClick={clearSearch}>
              <FaTimes />
              <span>Clear</span>
            </button>
          )}

          <a href="/backoffice/add-property" className="add-property-btn " style={{
            borderRadius: '10px'
          }}>
            <span style={{ fontWeight: '500' }}>Add New Property</span>
          </a>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading properties...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
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
                    PROPERTY {getSortIcon('projectName')}
                  </th>
                  <th 
                    className="reference-col sortable-header"
                    onClick={() => handleColumnSort('referenceId')}
                  >
                    REFERENCE {getSortIcon('referenceId')}
                  </th>
                  <th className="operation-col">OPERATION</th>
                  <th 
                    className="price-col sortable-header"
                    onClick={() => handleColumnSort('price')}
                  >
                    PRICE {getSortIcon('price')}
                  </th>
                  <th 
                    className="published-col sortable-header"
                    onClick={() => handleColumnSort('isPublished')}
                  >
                    PUBLISHED {getSortIcon('isPublished')}
                  </th>
                  <th 
                    className="displays-col sortable-header"
                    onClick={() => handleColumnSort('viewCount')}
                  >
                    DISPLAYS {getSortIcon('viewCount')}
                  </th>
                  <th className="visits-col">VISITS</th>
                  <th className="enquiries-col">ENQUIRIES</th>
                  <th 
                    className="date-col sortable-header"
                    onClick={() => handleColumnSort('createdAt')}
                  >
                    DATE {getSortIcon('createdAt')}
                  </th>
                  <th className="actions-col">ACTIONS</th>
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
                              alt={property.projectName || 'Property Image'}
                              width={50}
                              height={50}
                              className="property-image"
                            />
                          ) : (
                            <div className="placeholder-image">No Image</div>
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
                          {property.isPublished ? 'PUBLISHED' : 'UNPUBLISHED'}
                        </span>
                      </td>
                      <td className="displays-col">{property.viewCount || 0}</td>
                      <td className="visits-col">{property.viewCount || 0}</td>
                      <td className="enquiries-col">{property.inquiryCount || 0}</td>
                      <td className="date-col">{property.formattedDate}</td>
                      <td className="actions-col">
                        <div className="action-buttons">
                          <button 
                            className="view-btn"
                            onClick={() => handleViewProperty(property.id)}
                            style={{
                              backgroundColor: 'white',
                              color: '#333',
                              border: '1px solid #ddd',
                              padding: '5px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              marginRight: '8px'
                            }}
                          >
                            View
                          </button>
                          <button className="action-btn edit"
                            onClick={() => handleEditProperty(property.id)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn duplicate"
                            title="Duplicate property"
                            onClick={() => handleDuplicateProperty(property.id)}
                          >
                            <FaCopy />
                          </button>
                          <button className="action-btn delete"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <FaTrash />
                          </button>
                          <button 
                            className={`action-btn status-toggle ${property.isPublished ? 'active' : 'inactive'}`}
                            onClick={() => handleTogglePropertyPublished(property.id, property.isPublished)}
                            title={property.isPublished ? 'Unpublish property' : 'Publish property'}
                          >
                            {property.isPublished ? <FaEye /> : <FaEyeSlash />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="no-properties">
                      <p>No properties found. Add your first property to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            <div className="pagination-info">
              <span>Showing {properties.length} of {totalPages * itemsPerPage} entries</span>
            </div>


            <div className="pagination">
              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <span className="pagination-first">First</span>
              </button>

              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={index}
                      className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <span key={index} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}

              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>

              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <span className="pagination-last">Last</span>
              </button>
            </div>


            <div className="pagination-size">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
};
