import { getAuthToken } from '@/utils/auth';

// ตัวแปรเก็บ API URL และ API Key
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// ฟังก์ชั่นสำหรับดึงข้อมูล Icons ทั้งหมด
export const getAllIcons = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/icons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch icons');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching icons:', error);
    throw error;
  }
};

// ฟังก์ชั่นสำหรับดึงข้อมูล Icons ตาม prefix (เช่น facility, property-type)
export const getIconsByPrefix = async (prefix) => {
  try {
    // ไม่ใช้ token สำหรับ icons API
    // const token = getAuthToken();
    
    console.log(`Fetching icons with prefix: ${prefix}`);
    console.log(`URL: ${API_URL}/icons/prefix/${prefix}`);
    
    const response = await fetch(`${API_URL}/icons/prefix/${prefix}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
        // ไม่ใส่ Authorization header เพื่อเป็น public API
        // 'Authorization': `Bearer ${token}`
      }
    });

    console.log(`Response status for ${prefix}:`, response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error for prefix ${prefix}:`, errorText);
      throw new Error(`Failed to fetch ${prefix} icons: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log(`Received data for ${prefix}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${prefix} icons:`, error);
    // ส่งคืน empty data แทนที่จะ throw error
    return {
      success: false,
      message: error.message,
      data: {}
    };
  }
};

// ฟังก์ชั่นสำหรับดึงข้อมูล Icon จาก ID
export const getIconById = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/icons/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch icon with id: ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching icon with id ${id}:`, error);
    throw error;
  }
};
