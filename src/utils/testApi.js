import { getIconsByPrefix } from '@/services/iconService';

// ฟังก์ชันสำหรับทดสอบ API เรียก icons แต่ละ prefix
export async function testAllIconPrefixes() {
  console.log('===== เริ่มทดสอบ Icon API =====');
  
  const prefixes = [
    'facility', 
    'amenity',
    'highlight',
    'property-label',
    'nearby',
    'views', 
    'view',  // ทดสอบเพิ่มในกรณีที่อาจจะผิดจากหลายหรือเอกพจน์
    'property-highlight', 
    'label'
  ];
  
  const results = {};
  
  for (const prefix of prefixes) {
    try {
      console.log(`กำลังทดสอบ prefix: ${prefix}`);
      const response = await getIconsByPrefix(prefix);
      
      if (response.success) {
        console.log(`✅ prefix "${prefix}" ทำงานได้! จำนวนข้อมูล:`, 
          Object.keys(response.data).map(key => `${key}: ${response.data[key]?.length || 0} รายการ`).join(', '));
        results[prefix] = {
          success: true,
          dataKeys: Object.keys(response.data),
          counts: Object.keys(response.data).map(key => ({
            category: key,
            count: response.data[key]?.length || 0
          }))
        };
      } else {
        console.log(`❌ prefix "${prefix}" ไม่ทำงาน: ${response.message || 'ไม่ระบุสาเหตุ'}`);
        results[prefix] = {
          success: false,
          error: response.message || 'API ส่งคืน success: false โดยไม่ระบุสาเหตุ'
        };
      }
    } catch (error) {
      console.error(`❌ prefix "${prefix}" เกิด error:`, error.message);
      results[prefix] = {
        success: false,
        error: error.message
      };
    }
  }
  
  console.log('===== สรุปผลการทดสอบ =====');
  console.table(Object.keys(results).map(prefix => ({
    prefix,
    success: results[prefix].success,
    error: results[prefix].error || '',
    categories: results[prefix].dataKeys?.join(', ') || '',
  })));
  
  console.log('===== สิ้นสุดการทดสอบ =====');
  return results;
}

// สำหรับทดสอบเฉพาะ prefix ที่ระบุ
export async function testSpecificPrefix(prefix) {
  try {
    console.log(`กำลังทดสอบ prefix: ${prefix}`);
    const response = await getIconsByPrefix(prefix);
    
    if (response.success) {
      console.log(`✅ prefix "${prefix}" ทำงานได้!`);
      console.log('ข้อมูลที่ได้:', response.data);
      return { success: true, data: response.data };
    } else {
      console.log(`❌ prefix "${prefix}" ไม่ทำงาน:`, response.message || 'ไม่ระบุสาเหตุ');
      return { success: false, error: response.message || 'API ส่งคืน success: false โดยไม่ระบุสาเหตุ' };
    }
  } catch (error) {
    console.error(`❌ prefix "${prefix}" เกิด error:`, error.message);
    return { success: false, error: error.message };
  }
}
