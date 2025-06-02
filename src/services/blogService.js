import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * Blog Service - Handles API requests for blog management
 */
class BlogService {
  /**
   * Get latest blogs
   * @param {number} limit - Number of blogs to return
   * @returns {Promise} - API response
   */
  async getLatestBlogs(limit = 3) {
    try {
      const response = await axios.get(`${API_URL}/blogs/latest`, {
        params: { limit },
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
      throw error;
    }
  }

  /**
   * Get random blogs
   * @param {number} limit - Number of random blogs to return
   * @returns {Promise} - API response
   */
  async getRandomBlogs(limit = 3) {
    try {
      const response = await axios.get(`${API_URL}/blogs/random`, {
        params: { limit },
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching random blogs:', error);
      throw error;
    }
  }

  /**
   * Get all blogs
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getAllBlogs(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/blogs`, {
        params,
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  /**
   * Get blog by ID
   * @param {string} id - Blog ID
   * @returns {Promise} - API response
   */
  async getBlogById(id) {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog ${id}:`, error);
      throw error;
    }
  }
}

export default new BlogService();
