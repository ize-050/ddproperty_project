import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * Property Type Service - Handles API requests for property types
 */
class PropertyTypeService {
  /**
   * Get property types with counts and images
   * @returns {Promise} - API response with property types data
   */
  async getPropertyTypes() {
    try {
      const response = await axios.get(`${API_URL}/properties/price-types`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching property types:', error);
      throw error;
    }
  }

  /**
   * Get a random property for each property type
   * @returns {Promise} - API response with random properties for each type
   */
  async getRandomPropertiesByType() {
    try {
      const response = await axios.get(`${API_URL}/properties/random?limit=10`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching random properties:', error);
      throw error;
    }
  }
}

export default new PropertyTypeService();
