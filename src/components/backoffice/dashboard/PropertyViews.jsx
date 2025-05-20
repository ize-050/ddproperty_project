'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bar } from 'react-chartjs-2';
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
  const t = useTranslations('Backoffice');
  const [timeRange, setTimeRange] = useState('hourly');

  // Mock data for the chart
  const chartData = {
    labels: ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Page 6', 'Page 7'],
    datasets: [
      {
        label: t('views'),
        data: [2000, 1500, 10000, 3500, 5000, 3000, 4000],
        backgroundColor: '#8884d8',
        borderRadius: 4,
      },
      {
        label: t('inquiries'),
        data: [3000, 2500, 2000, 2500, 2000, 2500, 3000],
        backgroundColor: '#82ca9d',
        borderRadius: 4,
      },
    ],
  };

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
        max: 10000,
        ticks: {
          stepSize: 2500,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="property-views-chart">
      <div className="chart-header">
        <h3 className="chart-title">{t('propertyViews')}</h3>
        <div className="chart-filters">
          <button 
            className={`time-filter ${timeRange === 'hourly' ? 'active' : ''}`}
            onClick={() => setTimeRange('hourly')}
          >
            {t('hourly')}
          </button>
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
        </div>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={options} height={300} />
      </div>
    </div>
  );
};

export default PropertyViews;
