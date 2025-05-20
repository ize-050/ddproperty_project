'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { FaHome, FaStar, FaComment } from 'react-icons/fa';
import Link from 'next/link';

const RecentActivities = () => {
  const t = useTranslations('Backoffice');

  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      type: 'approval',
      property: 'House on the Beverly Hills',
      status: 'been approved',
      icon: <FaHome />,
    },
    {
      id: 2,
      type: 'review',
      user: 'Dallas Horton',
      property: 'House on the Northbridge',
      icon: <FaComment />,
    },
    {
      id: 3,
      type: 'favorite',
      user: 'Someone',
      property: 'Triple Story House for Rent',
      icon: <FaStar />,
    },
    {
      id: 4,
      type: 'approval',
      property: 'House on the Beverly Hills',
      status: 'been approved',
      icon: <FaHome />,
    },
    {
      id: 5,
      type: 'review',
      user: 'Dallas Horton',
      property: 'House on the Northbridge',
      icon: <FaComment />,
    },
    {
      id: 6,
      type: 'favorite',
      user: 'Someone',
      property: 'Triple Story House for Rent',
      icon: <FaStar />,
    },
  ];

  const renderActivityItem = (activity) => {
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

  return (
    <div className="recent-activities">
      <div className="activities-header">
        <h3 className="activities-title">{t('recentActivities')}</h3>
      </div>
      <div className="activities-list">
        {activities.map(activity => renderActivityItem(activity))}
      </div>
      <div className="activities-footer">
        <Link href="/backoffice/activities" className="view-more-link">
          {t('viewMore')} →
        </Link>
      </div>
    </div>
  );
};

export default RecentActivities;
