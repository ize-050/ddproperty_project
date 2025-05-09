
import { AXIOS_SSR_CONFIG } from '@/config/api.config';

import axios from 'axios';

/**
 * Get auth token from cookies (server-side only)
 * @returns {string|null} - Auth token or null
 */

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
// Create axios instance with server-side config
const serverApi = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'dd-property-api-key-2025'
  }
});

// Add request interceptor for authentication
serverApi.interceptors.request.use(
  (config) => {
    // ถ้ามี token ค่อยเพิ่ม header นี้
    // const token = getServerToken();
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    config.next = config.next || { revalidate: 0 };
    config.cache = config.cache || 'no-store';
    return config;
  },
  (error) => Promise.reject(error)
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

// /**
//  * Server-side GET request
//  * @param {string} endpoint - API endpoint
//  * @param {Object} params - Query parameters
//  * @param {Object} options - Additional axios options
//  * @returns {Promise} - API response
//  */
// export const serverGet = (endpoint, params = {}, options = {}) => {
//   return serverApi.get(endpoint, { ...options, params });
// };

// /**
//  * Server-side POST request
//  * @param {string} endpoint - API endpoint
//  * @param {Object} data - Request body
//  * @param {Object} options - Additional axios options
//  * @returns {Promise} - API response
//  */
// export const serverPost = (endpoint, data = {}, options = {}) => {
//   return serverApi.post(endpoint, data, options);
// };

// /**
//  * Server-side PUT request
//  * @param {string} endpoint - API endpoint
//  * @param {Object} data - Request body
//  * @param {Object} options - Additional axios options
//  * @returns {Promise} - API response
//  */
// export const serverPut = (endpoint, data = {}, options = {}) => {
//   return serverApi.put(endpoint, data, options);
// };

// /**
//  * Server-side PATCH request
//  * @param {string} endpoint - API endpoint
//  * @param {Object} data - Request body
//  * @param {Object} options - Additional axios options
//  * @returns {Promise} - API response
//  */
// export const serverPatch = (endpoint, data = {}, options = {}) => {
//   return serverApi.patch(endpoint, data, options);
// };

// /**
//  * Server-side DELETE request
//  * @param {string} endpoint - API endpoint
//  * @param {Object} options - Additional axios options
//  * @returns {Promise} - API response
//  */
// export const serverDelete = (endpoint, options = {}) => {
//   return serverApi.delete(`${NEXT_PUBLIC_API_URL}${endpoint}`, options);
// };

// /**
//  * Server-side upload file(s)
//  * @param {string} endpoint - API endpoint
//  * @param {FormData} formData - Form data with files
//  * @param {Object} options - Additional axios options
//  * @returns {Promise} - API response
//  */
// export const serverUpload = (endpoint, formData, options = {}) => {
//   return serverApi.post(endpoint, formData, {
//     ...options,
//     headers: {
//       ...options.headers,
//       'Content-Type': 'multipart/form-data'
//     }
//   });
// };

// // Export the axios instance for advanced usage
export default serverApi;
