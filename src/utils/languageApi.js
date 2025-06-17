
import axios from 'axios';

// Base API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get auth token from localStorage/sessionStorage (client-side only)
 * @param {Object} options - Options for token retrieval
 * @returns {string|null} - Auth token or null
 */
const getAuthToken = (options = {}) => {
  // For SSR context, we'll use the token passed in options if available
  if (options.serverSide) {
    return options.token || null;
  }
  
  // For CSR context
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null;
  }
  
  return null;
};

/**
 * Create headers with auth token if available
 * @param {Object} options - Options for header creation
 * @returns {Object} - Headers object
 */
const createHeaders = (options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken(options);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Language API class for handling UI strings and menu items
 */
class LanguageApi {
  /**
   * Fetch UI strings by section
   * @param {string} section - Section name (header, home, rent, blog, about)
   * @param {Object} options - Fetch options
   * @returns {Promise} - API response
   */
  static async getUiStringsBySection(section, options = {}) {
    const headers = createHeaders(options);
    // Use public endpoint that doesn't require authentication
    const url = `${API_BASE_URL}/ui-strings/public/section/${section}`;
    
    try {
      // Use different fetch methods for SSR and CSR
      if (options.serverSide) {
        // For SSR context
        const response = await fetch(url, {
          method: 'GET',
          headers,
          cache: options.cache || 'no-store',
          next: options.next || { revalidate: 3600 }, // Default cache for 1 hour
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching UI strings: ${response.status}`);
        }
        
        return await response.json();
      } else {
        // For CSR context
        const response = await axios.get(url, { headers });
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching UI strings for section ${section}:`, error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Fetch all UI strings
   * @param {Object} options - Fetch options
   * @returns {Promise} - API response
   */
  static async getAllUiStrings(options = {}) {
    const headers = createHeaders(options);
    // Use public endpoint that doesn't require authentication
    const url = `${API_BASE_URL}/ui-strings/public`;
    
    try {
      if (options.serverSide) {
        const response = await fetch(url, {
          method: 'GET',
          headers,
          cache: options.cache || 'no-store',
          next: options.next || { revalidate: 3600 },
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching all UI strings: ${response.status}`);
        }
        
        return await response.json();
      } else {
        const response = await axios.get(url, { headers });
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching all UI strings:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Fetch active menu items
   * @param {Object} options - Fetch options
   * @returns {Promise} - API response
   */
  static async getActiveMenuItems(options = {}) {
    // Note: This endpoint is already public, no authentication required
    const headers = {
      'Content-Type': 'application/json'
    };
    const url = `${API_BASE_URL}/menu-items/active`;
    
    try {
      if (options.serverSide) {
        const response = await fetch(url, {
          method: 'GET',
          headers,
          cache: options.cache || 'no-store',
          next: options.next || { revalidate: 3600 },
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching active menu items: ${response.status}`);
        }
        
        return await response.json();
      } else {
        const response = await axios.get(url, { headers });
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching active menu items:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Fetch all menu items
   * @param {Object} options - Fetch options
   * @returns {Promise} - API response
   */
  static async getAllMenuItems(options = {}) {
    // This endpoint requires authentication
    const headers = createHeaders(options);
    const url = `${API_BASE_URL}/menu-items`;
    
    try {
      if (options.serverSide) {
        const response = await fetch(url, {
          method: 'GET',
          headers,
          cache: options.cache || 'no-store',
          next: options.next || { revalidate: 3600 },
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching all menu items: ${response.status}`);
        }
        
        return await response.json();
      } else {
        const response = await axios.get(url, { headers });
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching all menu items:', error);
      return { success: false, error: error.message };
    }
  }
}

export default LanguageApi;
