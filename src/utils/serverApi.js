/**
 * Server-side API Utility Functions
 * Provides functions for making API calls in SSR context using Axios
 */

import { AXIOS_SSR_CONFIG } from '@/config/api.config';
import { cookies } from 'next/headers';
import axios from 'axios';

/**
 * Get auth token from cookies (server-side only)
 * @returns {string|null} - Auth token or null
 */
const getServerToken = () => {
  const cookieStore = cookies();
  return cookieStore.get('auth_token')?.value || null;
};

// Create axios instance with server-side config
const serverApi = axios.create(AXIOS_SSR_CONFIG);

// Add request interceptor for authentication
serverApi.interceptors.request.use(
  (config) => {
    // Get token from cookies (server-side)
    const token = getServerToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add Next.js cache settings for SSR
    config.next = config.next || { revalidate: 0 };
    config.cache = config.cache || 'no-store';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
serverApi.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response.data;
  },
  (error) => {
    // Handle errors
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Something went wrong',
      data: error.response?.data || {}
    };
    
    return Promise.reject(customError);
  }
);

/**
 * Server-side GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @param {Object} options - Additional axios options
 * @returns {Promise} - API response
 */
export const serverGet = (endpoint, params = {}, options = {}) => {
  return serverApi.get(endpoint, { ...options, params });
};

/**
 * Server-side POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Additional axios options
 * @returns {Promise} - API response
 */
export const serverPost = (endpoint, data = {}, options = {}) => {
  return serverApi.post(endpoint, data, options);
};

/**
 * Server-side PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Additional axios options
 * @returns {Promise} - API response
 */
export const serverPut = (endpoint, data = {}, options = {}) => {
  return serverApi.put(endpoint, data, options);
};

/**
 * Server-side PATCH request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Additional axios options
 * @returns {Promise} - API response
 */
export const serverPatch = (endpoint, data = {}, options = {}) => {
  return serverApi.patch(endpoint, data, options);
};

/**
 * Server-side DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional axios options
 * @returns {Promise} - API response
 */
export const serverDelete = (endpoint, options = {}) => {
  return serverApi.delete(endpoint, options);
};

/**
 * Server-side upload file(s)
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with files
 * @param {Object} options - Additional axios options
 * @returns {Promise} - API response
 */
export const serverUpload = (endpoint, formData, options = {}) => {
  return serverApi.post(endpoint, formData, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Export the axios instance for advanced usage
export default serverApi;
