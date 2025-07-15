/**
 * Messaging Settings API Service
 * Handles fetching messaging/social platform settings from backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'your-api-key-here';

/**
 * Fetch all messaging settings from backend
 * @returns {Promise<Object>} API response with settings data
 */
export const getMessagingSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/messaging-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch messaging settings');
    }

    return data;
  } catch (error) {
    console.error('Error fetching messaging settings:', error);
    throw error;
  }
};

/**
 * Transform settings array to object for easier access
 * @param {Array} settings - Array of settings from API
 * @returns {Object} Settings object keyed by platform
 */
export const transformSettingsToObject = (settings) => {
  const settingsObj = {};
  
  settings.forEach(setting => {
    if (setting.isEnabled && setting.platformValue) {
      settingsObj[setting.platform] = setting.platformValue;
    }
  });
  
  return settingsObj;
};

/**
 * Generate appropriate link URL based on platform and value
 * @param {string} platform - Platform name (email, line, whatsapp, etc.)
 * @param {string} value - Platform value from settings
 * @returns {string} Formatted URL for the platform
 */
export const generatePlatformLink = (platform, value) => {
  if (!value) return '#';
  
  switch (platform.toLowerCase()) {
    case 'email':
      return `mailto:${value}`;
    
    case 'line':
      // Handle both @username and full URL formats
      if (value.startsWith('http')) {
        return value;
      } else if (value.startsWith('@')) {
        return `https://line.me/ti/p/${value}`;
      } else {
        return `https://line.me/ti/p/@${value}`;
      }
    
    case 'whatsapp':
      // Handle both phone number and full URL formats
      if (value.startsWith('http')) {
        return value;
      } else {
        // Remove any non-numeric characters except +
        const cleanNumber = value.replace(/[^\d+]/g, '');
        return `https://wa.me/${cleanNumber}`;
      }
    
    case 'wechat':
      // WeChat typically uses QR codes, but we can link to profile if available
      if (value.startsWith('http')) {
        return value;
      } else {
        return `weixin://dl/profile/${value}`;
      }
    
    case 'messenger':
    case 'facebook_messenger':
      // Handle both @username and full URL formats
      if (value.startsWith('http')) {
        return value;
      } else if (value.startsWith('@')) {
        return `https://m.me/${value.substring(1)}`;
      } else {
        return `https://m.me/${value}`;
      }
    
    case 'instagram':
      // Handle both @username and full URL formats
      if (value.startsWith('http')) {
        return value;
      } else if (value.startsWith('@')) {
        return `https://instagram.com/${value.substring(1)}`;
      } else {
        return `https://instagram.com/${value}`;
      }
    
    default:
      return value.startsWith('http') ? value : `https://${value}`;
  }
};

/**
 * Get default fallback values for platforms (for development/testing)
 * @returns {Object} Default settings object
 */
export const getDefaultSettings = () => ({
  email: 'contact@dluckproperty.com',
  line: '@dluckproperty',
  whatsapp: '+66865559999',
  wechat: 'dluckproperty',
  messenger: 'dluckproperty',
  instagram: '@dluck_property'
});
