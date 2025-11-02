import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Get all active menu items (public endpoint)
 * @returns {Promise} Menu items data
 */
export const getActiveMenuItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/menu-items/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active menu items:', error);
    throw error;
  }
};

/**
 * Get all menu items (requires authentication)
 * @param {string} token - Authentication token
 * @returns {Promise} Menu items data
 */
export const getAllMenuItems = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/menu-items`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all menu items:', error);
    throw error;
  }
};

/**
 * Get menu item by ID
 * @param {number} id - Menu item ID
 * @param {string} token - Authentication token
 * @returns {Promise} Menu item data
 */
export const getMenuItemById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/menu-items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
};

/**
 * Create a new menu item
 * @param {Object} menuData - Menu item data
 * @param {string} token - Authentication token
 * @returns {Promise} Created menu item
 */
export const createMenuItem = async (menuData, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/menu-items`, menuData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

/**
 * Update a menu item
 * @param {number} id - Menu item ID
 * @param {Object} menuData - Updated menu item data
 * @param {string} token - Authentication token
 * @returns {Promise} Updated menu item
 */
export const updateMenuItem = async (id, menuData, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/menu-items/${id}`, menuData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

/**
 * Delete a menu item
 * @param {number} id - Menu item ID
 * @param {string} token - Authentication token
 * @returns {Promise} Deletion result
 */
export const deleteMenuItem = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/api/menu-items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};
