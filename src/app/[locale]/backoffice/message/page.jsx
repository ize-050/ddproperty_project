'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

// Import SCSS
import '@/styles/backoffice/message.scss';

// Stats data for the dashboard
const statsData = {
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
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 3 Month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });
  
  // Format date from ISO string to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
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
        name: messageData.name || 'Unknown', 
        email: messageData.email || '', 
        phone: messageData.phone || ''
      },
      property: { 
        id: messageData.property?.id || 0, 
        title: messageData.property?.projectName || 'Unknown Property', 
        location: messageData.property?.district || '', 
        image: `/images/properties/${messageData.property?.id || 1}.jpg` 
      },
      enquiries: 1, // Default value
      lastActivity: { 
        action: messageData.message?.substring(0, 30) + '...' || 'Sent a message', 
        date: formatDate(messageData.createdAt) 
      }
    };
  };
  
  // Load messages data from API
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // Get token from localStorage or sessionStorage
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        
        // Make API request to get only messages for properties added by this user
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
          
          // Update stats data
          statsData.leadsReceived = data.data.length;
          statsData.inquiriesReceived = data.data.length;
          statsData.new = data.data.filter(m => m.status === 'NEW').length;
          statsData.contacted = data.data.filter(m => m.status === 'READ').length;
          statsData.visit = data.data.filter(m => m.status === 'REPLIED').length;
          statsData.proposal = data.data.filter(m => m.status === 'ARCHIVED').length;
          
          // Set state
          setMessages(formattedMessages);
          setFilteredMessages(formattedMessages);
          
          // Set pagination if available
          if (data.pagination) {
            setPagination({
              currentPage: data.pagination.currentPage,
              totalPages: data.pagination.totalPages,
              totalCount: data.pagination.totalCount
            });
          }
        } else {
          throw new Error(data.message || 'Failed to fetch messages');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, []);
  
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
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedProperty('');
    setSelectedStatus('');
    setSelectedTimeframe('Last 3 Month');
    setFilteredMessages(messages);
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
    <BackofficeLayout>
      <div className="message-page">
        <div className="page-header">
          <h1>{t('message')}</h1>
          <p>{t('messageSubtitle')}</p>
        </div>
        
        <div className="filters-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={t('searchByName')} 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="filter-box">
            <select 
              value={selectedProperty} 
              onChange={handlePropertyFilter}
            >
              <option value="">{t('filterByProperty')}</option>
              {/* Dynamic property options would go here in a real app */}
              <option value="Aram">Aram Wongamat</option>
              <option value="Condo">Luxury Condo</option>
            </select>
          </div>
          
          <div className="filter-box">
            <select 
              value={selectedStatus} 
              onChange={handleStatusFilter}
            >
              <option value="">{t('filterByStatus')}</option>
              <option value="NEW">New</option>
              <option value="READ">Read</option>
              <option value="REPLIED">Replied</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          
          <div className="filter-box">
            <select 
              value={selectedTimeframe} 
              onChange={handleTimeframeFilter}
            >
              <option value="Last 3 Month">{t('last3Month')}</option>
              <option value="Last 6 Month">{t('last6Month')}</option>
              <option value="Last Year">{t('lastYear')}</option>
            </select>
          </div>
          
          <button 
            className="clear-button"
            onClick={clearFilters}
          >
            <FaTimes /> {t('clear')}
          </button>
        </div>
        
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-value">{statsData.leadsReceived}</div>
            <div className="stat-label">{t('leadsReceived')}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{statsData.inquiriesReceived}</div>
            <div className="stat-label">{t('inquiriesReceived')}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{statsData.new}</div>
            <div className="stat-label">{t('new')}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{statsData.contacted}</div>
            <div className="stat-label">{t('contacted')}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{statsData.visit}</div>
            <div className="stat-label">{t('visit')}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{statsData.proposal}</div>
            <div className="stat-label">{t('proposal')}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{statsData.won}</div>
            <div className="stat-label">{t('won')}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{statsData.lost}</div>
            <div className="stat-label">{t('lost')}</div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className="messages-table-container">
            <table className="messages-table">
              <thead>
                <tr>
                  <th className="status-column">{t('status')}</th>
                  <th className="contact-column">{t('contact')}</th>
                  <th className="property-column">{t('property')}</th>
                  <th className="enquiries-column">{t('enquiries')}</th>
                  <th className="activity-column">{t('lastActivity')}</th>
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
                        <span className={`status-badge ${message.status.toLowerCase()}`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="contact-column">
                        <div className="contact-info">
                          <div className="contact-name">{message.contact.name}</div>
                          {message.contact.email && <div className="contact-email">{message.contact.email}</div>}
                          <div className="contact-phone">{message.contact.phone}</div>
                        </div>
                      </td>
                      <td className="property-column">
                        <div className="property-info">
                          <div className="property-image">
                            <img 
                              src={message.property.image} 
                              alt={message.property.title}
                              width={60}
                              height={40}
                              onError={(e) => {
                                e.target.src = '/images/properties/default.jpg';
                              }}
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
            
            {pagination.totalPages > 1 && (
              <div className="pagination-controls">
                <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                <span>Total: {pagination.totalCount} messages</span>
              </div>
            )}
          </div>
        )}
      </div>
    </BackofficeLayout>
  );
};

export default MessagePage;
