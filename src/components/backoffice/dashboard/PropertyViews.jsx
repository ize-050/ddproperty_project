'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Bar } from 'react-chartjs-2';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/components/backoffice/auth/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PropertyViews = () => {
  const t = useTranslations('backoffice.dashboard');
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: t('properties'),
        data: [],
        backgroundColor: '#8884d8',
        borderRadius: 4,
      },
      {
        label: t('messages'),
        data: [],
        backgroundColor: '#82ca9d',
        borderRadius: 4,
      },
    ],
  });

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage or sessionStorage
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        
        // Determine API endpoint based on user role
        const isAdmin = user?.role === 'ADMIN';
        const apiEndpoint = isAdmin 
          ? `${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats` // Admin sees all data
          : `${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats/user/${user?.id}`; // Non-admin sees only own data
        
        // Make API request
        const response = await fetch(apiEndpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(t('apiRequestFailed', { status: response.status }));
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Format data for chart based on property types
          const propertyTypes = data.data.propertiesByType || [];
          const messagesByType = data.data.messagesByType || [];
          const messageStatus = data.data.messagesByStatus || [];
          
          // Create labels and data for the chart using property type names
          const labels = propertyTypes.map(item => item.propertyTypeName || item.propertyType || t('other'));
          const propertyData = propertyTypes.map(item => item.count);
          
          // Map message counts to property types
          const messageData = labels.map(propertyTypeName => {
            const matchingType = messagesByType.find(item => 
              item.propertyTypeName === propertyTypeName || item.propertyType === propertyTypeName
            );
            return matchingType ? matchingType.count : 0;
          });
          
          // Group message status into categories for reference
          const newMessages = messageStatus.find(item => item.status === 'NEW')?.count || 0;
          const readMessages = messageStatus.find(item => item.status === 'READ')?.count || 0;
          const repliedMessages = messageStatus.find(item => item.status === 'REPLIED')?.count || 0;
          const archivedMessages = messageStatus.find(item => item.status === 'ARCHIVED')?.count || 0;
          
          setChartData({
            labels: labels.length > 0 ? labels : [t('noData')],
            datasets: [
              {
                label: t('properties'),
                data: propertyData.length > 0 ? propertyData : [0],
                backgroundColor: '#8884d8',
                borderRadius: 4,
              },
              {
                label: t('messages'),
                data: messageData.length > 0 ? messageData : [0],
                backgroundColor: '#82ca9d',
                borderRadius: 4,
              },
            ],
          });
        } else {
          throw new Error(data.message || t('errorLoadingData'));
        }
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPropertyData();
  }, [t, timeRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="property-views-chart">
        <div className="chart-header">
          <h3 className="chart-title">{t('propertyViews')}</h3>
        </div>
        <div className="chart-container loading">
          <FaSpinner className="spinner" />
          <p>{t('loadingData')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-views-chart">
        <div className="chart-header">
          <h3 className="chart-title">{t('propertyViews')}</h3>
        </div>
        <div className="chart-container error">
          <p>{t('errorLoadingData')}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="property-views-chart">
      <div className="chart-header">
        <h3 className="chart-title">{t('propertyOverview')}</h3>
        <div className="chart-filters">
          <button 
            className={`time-filter ${timeRange === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeRange('weekly')}
          >
            {t('weekly')}
          </button>
          <button 
            className={`time-filter ${timeRange === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeRange('monthly')}
          >
            {t('monthly')}
          </button>
          <button 
            className={`time-filter ${timeRange === 'yearly' ? 'active' : ''}`}
            onClick={() => setTimeRange('yearly')}
          >
            {t('yearly')}
          </button>
        </div>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={options} height={300} />
      </div>
    </div>
  );
};

export default PropertyViews;
