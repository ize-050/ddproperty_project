/**
 * API Configuration
 * This file contains configuration for API calls in both SSR and CSR contexts
 */

// Base API URL - change this to match your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// API Endpoints
const ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Properties
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: (id) => `/properties/${id}`,
  PROPERTY_SEARCH: '/properties/search',
  PROPERTY_FEATURED: '/properties/featured',
  PROPERTY_LATEST: '/properties/latest',
  
  // Property Listings
  LISTINGS: '/listings',
  LISTING_DETAIL: (id) => `/listings/${id}`,
  
  // User
  USER_PROFILE: '/users/profile',
  USER_PROPERTIES: '/users/properties',
  USER_FAVORITES: '/users/favorites',
  
  // Other
  CONTACT: '/contact',
};

// Default headers for API requests
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Axios config
const AXIOS_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: DEFAULT_HEADERS,
};

// Axios config for SSR
const AXIOS_SSR_CONFIG = {
  ...AXIOS_CONFIG,
  // Add any SSR-specific config here
};

export {
  API_BASE_URL,
  ENDPOINTS,
  DEFAULT_HEADERS,
  AXIOS_CONFIG,
  AXIOS_SSR_CONFIG,
};
