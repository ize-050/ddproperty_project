import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * User Service - Handles API requests for user management
 */
class UserService {
  /**
   * Get all users with optional pagination and filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getAllUsers(params = {}) {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.get(`${API_URL}/users`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user by ID
   * @param {Number} id - User ID
   * @returns {Promise} - API response
   */
  async getUserById(id) {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise} - API response
   */
  async createUser(userData) {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.post(`${API_URL}/users`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update user
   * @param {Number} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise} - API response
   */
  async updateUser(id, userData) {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.put(`${API_URL}/users/${id}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Delete user
   * @param {Number} id - User ID
   * @returns {Promise} - API response
   */
  async deleteUser(id) {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.delete(`${API_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
