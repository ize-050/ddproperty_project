import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * Zone Service - Handles API requests for zone/location management
 */
class ZoneService {
  /**
   * Get random zones for Explore Locations section
   * @param {number} limit - Number of random zones to return (default: 3)
   * @returns {Promise} - API response
   */
  async getExploreLocations(limit = 3) {
    try {
      const response = await axios.get(`${API_URL}/zones/explore`, {
        params: { limit },
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching explore locations:', error);
      throw error;
    }
  }

  /**
   * Get all zones
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getAllZones(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/zones`, {
        params,
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching zones:', error);
      throw error;
    }
  }

  /**
   * Get zone by ID
   * @param {number} id - Zone ID
   * @returns {Promise} - API response
   */
  async getZoneById(id) {
    try {
      const response = await axios.get(`${API_URL}/zones/${id}`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching zone ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get properties by zone ID
   * @param {number} zoneId - Zone ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getPropertiesByZone(zoneId, params = {}) {
    try {
      const response = await axios.get(`${API_URL}/zones/${zoneId}/properties`, {
        params,
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching properties for zone ${zoneId}:`, error);
      throw error;
    }
  }
}

export default new ZoneService();
