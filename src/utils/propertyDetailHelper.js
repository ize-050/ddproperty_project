/**
 * Helper functions for property detail page
 */

/**
 * เพิ่มข้อมูลที่จำเป็นสำหรับหน้า property detail ในกรณีที่ API ไม่มีข้อมูลเหล่านี้
 * @param {Object} property ข้อมูล property จาก API
 * @returns {Object} ข้อมูล property ที่เพิ่มเติมแล้ว
 */
export const enhancePropertyData = (property) => {
  if (!property) return null;
  
  // สร้างข้อมูลจำลองตามประเภทของอสังหาริมทรัพย์
  const propertyType = property.propertyType || 'condo';
  
  // ข้อมูลสถานที่ใกล้เคียง
  const nearby = property.nearby || generateNearbyData(propertyType);
  
  // ข้อมูลวิว
  const views = property.views || generateViewData(propertyType);
  
  // ข้อมูลสิ่งอำนวยความสะดวกส่วนกลาง
  const facilities = property.facilities || generateFacilitiesData(propertyType);
  
  // ข้อมูลสิ่งอำนวยความสะดวกภายในห้อง
  const amenities = property.amenities || generateAmenitiesData(propertyType);
  
  // ข้อมูลตัวแทนขาย
  const user = property.user || {
    name: 'John Doe',
    phone: '095 143 2345',
    email: 'info@d-luckproperty.com',
    line: '@dluck',
    wechat: 'dluckproperty',
    whatsapp: '+66951432345',
    facebook: 'facebook.com/dluckproperty',
    instagram: '@dluckproperty',
    avatar: '/images/team/agent.jpg'
  };
  
  return {
    ...property,
    nearby,
    views,
    facilities,
    amenities,
    user
  };
};

/**
 * สร้างข้อมูลจำลองสำหรับสถานที่ใกล้เคียง
 * @param {string} propertyType ประเภทของอสังหาริมทรัพย์
 * @returns {Array} ข้อมูลสถานที่ใกล้เคียง
 */
const generateNearbyData = (propertyType) => {
  const commonNearby = [
    { name: 'Shopping Mall', icon: 'shopping-bag', distance: '500m' },
    { name: 'Train Station', icon: 'train', distance: '300m' },
    { name: 'Hospital', icon: 'hospital', distance: '1.2km' },
    { name: 'School', icon: 'school', distance: '800m' },
    { name: 'Market', icon: 'store', distance: '400m' }
  ];
  
  if (propertyType === 'house') {
    return [
      ...commonNearby,
      { name: 'Park', icon: 'tree', distance: '600m' }
    ];
  }
  
  return commonNearby;
};

/**
 * สร้างข้อมูลจำลองสำหรับวิว
 * @param {string} propertyType ประเภทของอสังหาริมทรัพย์
 * @returns {Array} ข้อมูลวิว
 */
const generateViewData = (propertyType) => {
  if (propertyType === 'condo') {
    return [
      { name: 'City View', icon: 'city' },
      { name: 'Garden View', icon: 'tree' }
    ];
  } else if (propertyType === 'house') {
    return [
      { name: 'Garden View', icon: 'tree' }
    ];
  }
  
  return [
    { name: 'Garden View', icon: 'tree' }
  ];
};

/**
 * สร้างข้อมูลจำลองสำหรับสิ่งอำนวยความสะดวกส่วนกลาง
 * @param {string} propertyType ประเภทของอสังหาริมทรัพย์
 * @returns {Array} ข้อมูลสิ่งอำนวยความสะดวกส่วนกลาง
 */
const generateFacilitiesData = (propertyType) => {
  if (propertyType === 'condo') {
    return [
      { name: 'Fitness', icon: 'dumbbell' },
      { name: 'Co-working Space', icon: 'briefcase' },
      { name: 'Garden', icon: 'tree' },
      { name: 'Swimming Pool', icon: 'swimming-pool' },
      { name: 'Security', icon: 'shield-alt' }
    ];
  } else if (propertyType === 'house') {
    return [
      { name: 'Garden', icon: 'tree' },
      { name: 'Security', icon: 'shield-alt' },
      { name: 'Parking', icon: 'car' }
    ];
  }
  
  return [
    { name: 'Fitness', icon: 'dumbbell' },
    { name: 'Garden', icon: 'tree' },
    { name: 'Security', icon: 'shield-alt' }
  ];
};

/**
 * สร้างข้อมูลจำลองสำหรับสิ่งอำนวยความสะดวกภายในห้อง
 * @param {string} propertyType ประเภทของอสังหาริมทรัพย์
 * @returns {Array} ข้อมูลสิ่งอำนวยความสะดวกภายในห้อง
 */
const generateAmenitiesData = (propertyType) => {
  const commonAmenities = [
    { name: 'Kitchen Appliances', icon: 'blender' },
    { name: 'TV', icon: 'tv' },
    { name: 'Refrigerator', icon: 'snowflake' },
    { name: 'Washing Machine', icon: 'tshirt' },
    { name: 'Water Heater', icon: 'fire' },
    { name: 'Air Conditioner', icon: 'wind' }
  ];
  
  if (propertyType === 'house') {
    return [
      ...commonAmenities,
      { name: 'Furniture', icon: 'couch' }
    ];
  }
  
  return commonAmenities;
};
