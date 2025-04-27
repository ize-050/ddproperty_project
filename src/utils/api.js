/**
 * API Utility Functions
 * Provides functions for making API calls in both SSR and CSR contexts using Axios
 */

import { AXIOS_CONFIG, ENDPOINTS } from '@/config/api.config';


const axios = {
  create: (config) => {
    const instance = {
      defaults: { ...config },
      interceptors: {
        request: { use: () => {} },
        response: { use: () => {} }
      },
      get: (url, config) => {
        console.warn('Using placeholder axios. Please install axios package.');
        return fetch(`${config?.baseURL || ''}${url}`, {
          method: 'GET',
          headers: config?.headers || {}
        }).then(res => res.json());
      },
      post: (url, data, config) => {
        console.warn('Using placeholder axios. Please install axios package.');
        return fetch(`${config?.baseURL || ''}${url}`, {
          method: 'POST',
          headers: config?.headers || {},
          body: JSON.stringify(data)
        }).then(res => res.json());
      },
      put: (url, data, config) => {
        console.warn('Using placeholder axios. Please install axios package.');
        return fetch(`${config?.baseURL || ''}${url}`, {
          method: 'PUT',
          headers: config?.headers || {},
          body: JSON.stringify(data)
        }).then(res => res.json());
      },
      patch: (url, data, config) => {
        console.warn('Using placeholder axios. Please install axios package.');
        return fetch(`${config?.baseURL || ''}${url}`, {
          method: 'PATCH',
          headers: config?.headers || {},
          body: JSON.stringify(data)
        }).then(res => res.json());
      },
      delete: (url, config) => {
        console.warn('Using placeholder axios. Please install axios package.');
        return fetch(`${config?.baseURL || ''}${url}`, {
          method: 'DELETE',
          headers: config?.headers || {}
        }).then(res => res.json());
      }
    };
    return instance;
  }
};

// Create axios instance with default config
const api = axios.create(AXIOS_CONFIG);

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
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
    
    // Handle authentication errors
    if (customError.status === 401) {
      // Clear token and redirect to login if on client side
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Optional: redirect to login page
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(customError);
  }
);

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} - API response
 */
export const get = (endpoint, params = {}) => {
  return api.get(endpoint, { params });
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} - API response
 */
export const post = (endpoint, data = {}) => {
  return api.post(endpoint, data);
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} - API response
 */
export const put = (endpoint, data = {}) => {
  return api.put(endpoint, data);
};

/**
 * PATCH request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} - API response
 */
export const patch = (endpoint, data = {}) => {
  return api.patch(endpoint, data);
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - API response
 */
export const del = (endpoint) => {
  return api.delete(endpoint);
};

/**
 * Upload file(s)
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with files
 * @returns {Promise} - API response
 */
export const upload = (endpoint, formData) => {
  return api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Export the axios instance for advanced usage
export default api;
