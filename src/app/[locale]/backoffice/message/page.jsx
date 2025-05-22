'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

// Import SCSS
import '@/styles/backoffice/message.scss';

// Mock message data
const mockMessages = [
  { 
    id: 1, 
    status: 'New', 
    contact: { name: 'John Doe', email: 'customer@email.com', phone: '+66123456175' },
    property: { 
      id: 101, 
      title: 'Aram Wongamat Luxury Condo for Sale', 
      location: 'Wongamat', 
      image: '/images/properties/1.jpg' 
    },
    enquiries: 3,
    lastActivity: { action: 'Sent you a message', date: 'Mar-10-2025' }
  },
  { 
    id: 2, 
    status: 'New', 
    contact: { name: 'John Doe', email: 'customer@email.com', phone: '+66123456178' },
    property: { 
      id: 102, 
      title: 'Aram Wongamat Luxury Condo for Sale', 
      location: 'Wongamat', 
      image: '/images/properties/2.jpg' 
    },
    enquiries: 3,
    lastActivity: { action: 'Sent you a message', date: 'Mar-10-2025' }
  },
  { 
    id: 3, 
    status: 'New', 
    contact: { name: 'John Doe', email: 'customer@email.com', phone: '+66123456175' },
    property: { 
      id: 103, 
      title: 'Aram Wongamat Luxury Condo for Sale', 
      location: 'Wongamat', 
      image: '/images/properties/3.jpg' 
    },
    enquiries: 3,
    lastActivity: { action: 'Sent you a message', date: 'Mar-10-2025' }
  },
  { 
    id: 4, 
    status: 'New', 
    contact: { name: 'John Doe', email: 'customer@email.com', phone: '+66123456178' },
    property: { 
      id: 104, 
      title: 'Aram Wongamat Luxury Condo for Sale', 
      location: 'Wongamat', 
      image: '/images/properties/4.jpg' 
    },
    enquiries: 3,
    lastActivity: { action: 'Sent you a message', date: 'Mar-10-2025' }
  },
  { 
    id: 5, 
    status: 'New', 
    contact: { name: 'John Doe', email: 'customer@email.com', phone: '+66123456175' },
    property: { 
      id: 105, 
      title: 'Aram Wongamat Luxury Condo for Sale', 
      location: 'Wongamat', 
      image: '/images/properties/5.jpg' 
    },
    enquiries: 3,
    lastActivity: { action: 'Sent you a message', date: 'Mar-10-2025' }
  },
  { 
    id: 6, 
    status: 'New', 
    contact: { name: 'John Doe', email: 'customer@email.com', phone: '+66123456178' },
    property: { 
      id: 106, 
      title: 'Aram Wongamat Luxury Condo for Sale', 
      location: 'Wongamat', 
      image: '/images/properties/6.jpg' 
    },
    enquiries: 3,
    lastActivity: { action: 'Sent you a message', date: 'Mar-10-2025' }
  },
  { 
    id: 7, 
    status: 'New', 
    contact: { name: 'John Doe', email: 'customer@email.com', phone: '+66123456175' },
    property: { 
      id: 107, 
      title: 'Aram Wongamat Luxury Condo for Sale', 
      location: 'Wongamat', 
      image: '/images/properties/7.jpg' 
    },
    enquiries: 3,
    lastActivity: { action: 'Sent you a message', date: 'Mar-10-2025' }
  },
];

// Stats data
const statsData = {
  leadsReceived: 53,
  inquiriesReceived: 70,
  new: 48,
  contacted: 7,
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
  
  // Load messages data
  useEffect(() => {
    // In a real app, this would be an API call
    setMessages(mockMessages);
    setFilteredMessages(mockMessages);
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
        message.contact.email.toLowerCase().includes(lowerTerm) ||
        message.contact.phone.includes(lowerTerm)
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
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Visit">Visit</option>
              <option value="Proposal">Proposal</option>
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
              {filteredMessages.map(message => (
                <tr key={message.id}>
                  <td className="status-column">
                    <span className={`status-badge ${message.status.toLowerCase()}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="contact-column">
                    <div className="contact-info">
                      <div className="contact-name">{message.contact.name}</div>
                      <div className="contact-email">{message.contact.email}</div>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default MessagePage;
