import serverApi from './serverApi';

/**
 * ฟังก์ชันกลางดึง Property ที่มี query params
 * @returns {Promise<Array>} zones
 */
export default async function getProperties(Request) {
    console.log("Request", Request)
    const { propertyType, minPrice, maxPrice, zoneId, bedrooms, bathrooms } = Request;
    try {
        const response = await serverApi.get('/search/properties', {
            headers: { 'x-api-key': 'dd-property-api-key-2025' },
            params: {
                propertyType: propertyType,
                minPrice: minPrice,
                maxPrice: maxPrice,
                zoneId: zoneId,
                bedrooms: bedrooms,
                bathrooms: bathrooms,
            }
        });
        if (response && response.data) {
            return response;
        }
        return [];
    } catch (error) {
        console.error('Error fetching zones (SSR):', error);
        return [];
    }
}
