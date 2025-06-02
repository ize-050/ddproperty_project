'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FaHome, FaStar, FaComment, FaEnvelope, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';

const RecentActivities = () => {
  const t = useTranslations('backoffice');
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage or sessionStorage
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        
        // Make API request
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
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
          // Transform recent messages into activity format
          const recentMessages = data.data.recentMessages || [];
          
          const formattedActivities = recentMessages.map((message, index) => ({
            id: message.id || index,
            type: 'message',
            name: message.name || 'Anonymous',
            email: message.email || 'No email provided',
            phone: message.phone || 'No phone provided',
            message: message.message || 'No message content',
            status: message.status || 'NEW',
            property: message.property?.projectName || 'Unknown Property',
            date: message.createdAt ? format(new Date(message.createdAt), 'dd MMM yyyy') : 'Unknown date',
            icon: <FaEnvelope />
          }));
          
          setActivities(formattedActivities);
        } else {
          throw new Error(data.message || 'Failed to fetch recent activities');
        }
      } catch (err) {
        console.error('Error fetching recent activities:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentActivities();
  }, []);

  const renderActivityItem = (activity) => {
    // Handle messages (which is what we'll mainly get from the API)
    if (activity.type === 'message') {
      let statusClass = 'new';
      if (activity.status === 'READ') statusClass = 'read';
      if (activity.status === 'REPLIED') statusClass = 'replied';
      if (activity.status === 'ARCHIVED') statusClass = 'archived';
      
      return (
        <div className="activity-item" key={activity.id}>
          <div className={`activity-icon message ${statusClass}`}>
            {activity.icon}
          </div>
          <div className="activity-content">
            <p>
              <span className="highlight">{activity.name}</span> sent a message about <span className="highlight">{activity.property}</span>
            </p>
            <p className="activity-message-preview">
              {activity.message.length > 50 ? `${activity.message.substring(0, 50)}...` : activity.message}
            </p>
            <p className="activity-date">{activity.date}</p>
          </div>
        </div>
      );
    }
    
    // Keep the original activity rendering for fallback
    switch (activity.type) {
      case 'approval':
        return (
          <div className="activity-item" key={activity.id}>
            <div className="activity-icon approval">
              {activity.icon}
            </div>
            <div className="activity-content">
              <p>
                <span className="highlight">Your listing</span> {activity.property} <span className="highlight">has {activity.status}</span>
              </p>
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="activity-item" key={activity.id}>
            <div className="activity-icon review">
              {activity.icon}
            </div>
            <div className="activity-content">
              <p>
                <span className="highlight">{activity.user}</span> left a review on <span className="highlight">{activity.property}</span>
              </p>
            </div>
          </div>
        );
      case 'favorite':
        return (
          <div className="activity-item" key={activity.id}>
            <div className="activity-icon favorite">
              {activity.icon}
            </div>
            <div className="activity-content">
              <p>
                <span className="highlight">{activity.user}</span> favourites your <span className="highlight">{activity.property}</span> listing
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="recent-activities">
        <div className="activities-header">
          <h3 className="activities-title">{t('recentActivities')}</h3>
        </div>
        <div className="activities-list loading">
          <FaSpinner className="spinner" />
          <p>{t('loadingActivities')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-activities">
        <div className="activities-header">
          <h3 className="activities-title">{t('recentActivities')}</h3>
        </div>
        <div className="activities-list error">
          <p>{t('errorLoadingActivities')}: {error}</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="recent-activities">
        <div className="activities-header">
          <h3 className="activities-title">{t('recentActivities')}</h3>
        </div>
        <div className="activities-list empty">
          <p>{t('noRecentActivities')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activities">
      <div className="activities-header">
        <h3 className="activities-title">{t('recentMessages')}</h3>
      </div>
      <div className="activities-list">
        {activities.map(activity => renderActivityItem(activity))}
      </div>
      <div className="activities-footer">
        <Link href="/backoffice/message" className="view-more-link">
          {t('viewAllMessages')} →
        </Link>
      </div>
    </div>
  );
};

export default RecentActivities;
