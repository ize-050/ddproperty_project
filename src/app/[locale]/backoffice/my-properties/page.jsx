'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes, FaChevronLeft, FaChevronRight, FaCopy } from 'react-icons/fa';
import {useLocale} from "next-intl";

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

        setProperties(data.properties || []);
        setTotalPages(data.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message);

        // Fallback to mock data in case of API error
        setMockData();
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage, searchTerm, sortBy, sortOrder, itemsPerPage]);

  // Set mock data as fallback


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
  const handleDuplicateProperty = async (propertyId) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading(t('duplicatingProperty') || 'Duplicating property...');
      
      // Get token from storage
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('token');
      
      // Call API to duplicate property
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to duplicate property');
      }
      
      // Parse response
      const result = await response.json();
      
      // Close loading toast and show success message
      toast.dismiss(loadingToast);
      toast.success(t('propertyDuplicated') || 'Property duplicated successfully');
      
      // Refresh property list
      fetchProperties();
    } catch (error) {
      console.error('Error duplicating property:', error);
      toast.error(t('errorDuplicatingProperty') || 'Failed to duplicate property');
    }
  };

  const handleEditProperty = (propertyId) => {
    router.push(`/${locale}/backoffice/edit-property/${propertyId}/`);
  }

  return (
    <BackofficeLayout>
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
                placeholder="Search by name"
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

            <Link href="/backoffice/add-property" className="add-property-btn">
              <span>Add New Property</span>
            </Link>
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

                    <th className="property-col">PROPERTY</th>
                    <th className="reference-col">REFERENCE</th>
                    <th className="operation-col">OPERATION</th>
                    <th className="price-col">PRICE</th>
                    <th className="displays-col">DISPLAYS</th>
                    <th className="visits-col">VISITS</th>
                    <th className="enquiries-col">ENQUIRIES</th>
                    <th className="date-col">DATE</th>
                    <th className="actions-col">ACTIONS</th>
                    <th className="view-col">VIEW</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length > 0 ? (
                    properties.map((property, index) => (
                      <tr key={property.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
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
                        <td className="displays-col">{property.viewCount || 0}</td>
                        <td className="visits-col">{property.viewCount || 0}</td>
                        <td className="enquiries-col">{property.inquiryCount || 0}</td>
                        <td className="date-col">{property.formattedDate}</td>
                        <td className="actions-col">
                          <div className="action-buttons">
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
                            <button className="action-btn delete">
                              <FaTrash />
                            </button>
                            <button className="action-btn view">
                              <FaEye />
                            </button>
                          </div>
                        </td>
                        <td className="view-col">
                          <button className="view-btn">VIEW</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="no-properties">
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
    </BackofficeLayout>
  )
};
