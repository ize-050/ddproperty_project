'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Image from 'next/image';

// Import SCSS
import '@/styles/backoffice/message.scss';

//component
import PaginationMessage from '@/components/backoffice/message/PaginationMessage';

// Initial stats data for the dashboard
const initialStatsData = {
  leadsReceived: 0,
  inquiriesReceived: 0,
  new: 0,
  contacted: 0,
  visit: 0,
  proposal: 0,
  won: 0,
  lost: 0
};

const MessagePage = () => {
  const t = useTranslations('Message');

  // State for messages data
  const [messages, setMessages] = useState([]);
  const [statsData, setStatsData] = useState(initialStatsData);
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 3 Month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });

  // Format date from ISO string to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return t('unknownDate');
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Format message object from API to match the table structure
  const formatMessageData = (messageData) => {
    return {
      id: messageData.id,
      status: messageData.status || 'NEW',
      contact: {
        name: messageData.name || t('unknown'),
        email: messageData.email || '',
        phone: messageData.phone || ''
      },
      property: {
        id: messageData.property?.id || 0,
        title: messageData.property?.projectName || t('unknownProperty'),
        location: messageData.property?.district || '',
        images: `${process.env.NEXT_PUBLIC_IMAGE_URL}${messageData.property?.images[0].url}`
      },
      enquiries: 1, // Default value
      lastActivity: {
        action: messageData.message?.substring(0, 30) + '...' || t('sentMessage'),
        date: formatDate(messageData.createdAt)
      }
    };
  };

  // Load messages data from API
  useEffect(() => {
    fetchMessages();
    fetchProperties();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // Get token from localStorage or sessionStorage
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/user?page=1&limit=50`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Format the messages data
        const formattedMessages = data.data.map(formatMessageData);

        // Create a new stats object
        const newStatsData = {
          leadsReceived: data.data.length,
          inquiriesReceived: data.data.length,
          new: data.data.filter(m => m.status === 'NEW').length,
          contacted: data.data.filter(m => m.status === 'CONTACTED').length,
          visit: data.data.filter(m => m.status === 'VISIT').length,
          proposal: data.data.filter(m => m.status === 'PROPOSAL').length,
          won: data.data.filter(m => m.status === 'WON').length,
          lost: data.data.filter(m => m.status === 'LOST').length
        };
        
        // Update the stats state
        setStatsData(newStatsData);

        // Set state
        setMessages(formattedMessages);
        setFilteredMessages(formattedMessages);

        // Set pagination if available
        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            totalCount: data.pagination.totalCount,
            pageSize: data.pagination.pageSize || 10
          });
        }
      } else {
        throw new Error(data.message || t('fetchError'));
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/propertiesBymessage`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterMessages(term, selectedProperty, selectedStatus, selectedTimeframe);
  };

  // Handle property filter
  const handlePropertyFilter = (e) => {
    const property = e.target.value;
    setSelectedProperty(property);
    filterMessages(searchTerm, property, selectedStatus, selectedTimeframe);
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterMessages(searchTerm, selectedProperty, status, selectedTimeframe);
  };

  // Handle timeframe filter
  const handleTimeframeFilter = (e) => {
    const timeframe = e.target.value;
    setSelectedTimeframe(timeframe);
    filterMessages(searchTerm, selectedProperty, selectedStatus, timeframe);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPropertyFilter('all');
    setDateFilter('all');
  };

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}/status`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Show success toast notification
      toast.success(t('updateStatusSuccess', { status: newStatus.charAt(0) + newStatus.slice(1).toLowerCase() }));
      
      // Reload messages to get fresh data from the server
      await fetchMessages();
      
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error(t('updateStatusError'));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: newPage
      }));

      // In a real app, you would fetch the new page data here
      // fetchMessages(newPage);
    }
  };

  // Filter messages based on search term and filters
  const filterMessages = (term, property, status, timeframe) => {
    let filtered = messages;

    // Filter by search term
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(message =>
        message.contact.name.toLowerCase().includes(lowerTerm) ||
        (message.contact.email && message.contact.email.toLowerCase().includes(lowerTerm)) ||
        (message.contact.phone && message.contact.phone.includes(lowerTerm))
      );
    }

    // Filter by property
    if (property) {
      filtered = filtered.filter(message =>
        message.property.title.toLowerCase().includes(property.toLowerCase())
      );
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter(message => message.status === status);
    }

    // Filter by timeframe (in a real app, this would use actual dates)
    if (timeframe) {
      // This is just a placeholder, in a real app you would filter by date
      filtered = filtered;
    }

    setFilteredMessages(filtered);
  };

  return (
    <div className="message-page">
      <div className="row align-items-center pb40">
        <div className="col-xxl-3">
          <div className="dashboard_title_area">
            <h1>{t('messages')}</h1>
            <p>{t('messageDescription')}</p>
          </div>
        </div>
        <div className="col-xxl-9">
          <div className="header-filters">

            <div className="col-xxl-4 search-box header-search">
              <span className="search-icon">
                <FaSearch />
              </span>
              <input
                type="text"
                className="search-input"
                placeholder={t('searchByName')}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="filter-box">
              <select
                className="filter-select"
                value={selectedProperty}
                onChange={handlePropertyFilter}
              >
                <option value="">{t('filterByProperty')}</option>
                {properties.length > 0 && properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-box">
              <select
                className="filter-select"
                value={selectedStatus}
                onChange={handleStatusFilter}
              >
                <option value="">{t('filterByStatus')}</option>
                <option value="NEW">{t('new')}</option>
                <option value="READ">{t('read')}</option>
                <option value="REPLIED">{t('replied')}</option>
                <option value="ARCHIVED">{t('archived')}</option>
                <option value="WON">{t('won')}</option>
                <option value="LOST">{t('lost')}</option>
              </select>
            </div>

            <div className="filter-box">
              <select
                className="filter-select"
                value={selectedTimeframe}
                onChange={handleTimeframeFilter}
              >
                <option value="Last 3 Month">{t('last3Month')}</option>
                <option value="Last 6 Month">{t('last6Month')}</option>
                <option value="Last Year">{t('lastYear')}</option>
                <option value="All Time">{t('allTime')}</option>
              </select>
            </div>

            <button
              className="clear-button"
              onClick={handleClearFilters}
            >
              <FaTimes />
              {t('clear')}
            </button>
          </div>
        </div>
      </div>




      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('loading')}</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{t('error', { error: error })}</p>
          <button onClick={() => window.location.reload()}>{t('tryAgain')}</button>
        </div>
      ) : (
        <div className="row">
          <div className="col-xl-12">

            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">

              <div className="stats-container">
                <div className="stats-section">
                  <div className="row">
                    <div className="col">
                      <div className="stats-box">
                        <div className="stat-value">{statsData.leadsReceived}</div>
                        <div className="stat-label">{t('leadsReceived')}</div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="stats-box">
                        <div className="stat-value">{statsData.inquiriesReceived}</div>
                        <div className="stat-label">{t('inquiriesReceived')}</div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="stats-box">
                        <div className="stat-value">{statsData.new}</div>
                        <div className="stat-label">{t('new')}</div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="stats-box">
                        <div className="stat-value">{statsData.contacted}</div>
                        <div className="stat-label">{t('contacted')}</div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="stats-box">
                        <div className="stat-value">{statsData.visit}</div>
                        <div className="stat-label">{t('visit')}</div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="stats-box">
                        <div className="stat-value">{statsData.proposal}</div>
                        <div className="stat-label">{t('proposal')}</div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="stats-box">
                        <div className="stat-value">{statsData.won}</div>
                        <div className="stat-label">{t('won')}</div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="stats-box">
                        <div className="stat-value">{statsData.lost}</div>
                        <div className="stat-label">{t('lost')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="packages_table table-responsive">
                <div className="messages-table-container">
                  <table className="messages-table">
                    <thead>
                      <tr>
                        <th className="status-column">{t('status')}</th>
                        <th className="contact-column">{t('contact')}</th>
                        <th className="property-column">{t('property')}</th>
                        <th className="enquiries-column">{t('enquiries')}</th>
                        <th className="activity-column">{t('lastActivity')}</th>
                        <th className="activity-column"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMessages.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="no-messages">
                            No messages found
                          </td>
                        </tr>
                      ) : (
                        filteredMessages.map(message => (
                          <tr key={message.id}>
                            <td className="status-column">
                              <div className="status-dropdown-wrapper">
                                <select 
                                  className={`status-dropdown ${message.status.toLowerCase()}`}
                                  value={message.status}
                                  onChange={(e) => handleStatusChange(message.id, e.target.value)}
                                  style={{ 
                                    backgroundColor: message.status === 'NEW' ? '#f8f9fa' : 'white'
                                  }}
                                >
                                  <option value="NEW">New</option>
                                  <option value="CONTACTED">Contacted</option>
                                  <option value="VISIT">Visit</option>
                                  <option value="PROPOSAL">Proposal</option>
                                  <option value="WON">Won</option>
                                  <option value="LOST">Lost</option>
                                </select>
                              </div>
                            </td>
                            <td className="contact-column">
                              <div className="contact-info">
                                <div className="contact-name">{message.contact.name}</div>
                                <div className="contact-details">
                                  {message.contact.email && <div className="contact-email">{message.contact.email}</div>}
                                  <div className="contact-phone">{message.contact.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="property-column">
                              <div className="property-info">
                                <div className="property-image">
                                  <img
                                    src={`${message?.property?.images}`}
                                    alt={message.property.title}
                                    width={60}
                                    height={40}
                                  />
                                </div>
                                <div className="property-details">
                                  <div className="property-title">{message.property.title}</div>
                                  <div className="property-location">{message.property.location}</div>
                                </div>
                              </div>
                            </td>
                            <td className="enquiries-column">
                              <div className="enquiries-count">{message.enquiries}</div>
                            </td>
                            <td className="activity-column">
                              <div className="status-message">
                                Sent you a message
                              </div>
                            </td>
                            <td className="action-column">
                              <div className="activity-info">
                                <div className="activity-action">{message.lastActivity.action}</div>
                                <div className="activity-date">{message.lastActivity.date}</div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <div className="mt30">
                    <PaginationMessage totalCount={pagination.totalCount} totalPages={pagination.totalPages} currentPage={pagination.currentPage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
