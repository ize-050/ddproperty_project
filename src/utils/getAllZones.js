import serverApi from './serverApi';

/**
 * ฟังก์ชันกลางสำหรับดึงข้อมูล Zone ทั้งหมด (SSR/CSR)
 * @returns {Promise<Array>} zones
 */
export default async function getAllZones() {
  try {
    const response = await serverApi.get('/zones', {
      headers: { 'x-api-key': 'dd-property-api-key-2025' }
    });
    if (response && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching zones (SSR):', error);
    return [];
  }
}
