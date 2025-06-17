/**
 * ฟังก์ชันสำหรับตรวจสอบว่าอยู่ในหน้า backoffice หรือไม่
 * ทำงานได้ทั้งใน server และ client side
 */
export function isBackofficePath() {
  // ตรวจสอบว่าอยู่ใน client side หรือไม่
  if (typeof window !== 'undefined') {
    // วิธีที่ 1: ตรวจสอบจากข้อมูลที่ส่งมาจาก server
    try {
      const layoutDataScript = document.getElementById('layout-data');
      if (layoutDataScript) {
        const layoutData = JSON.parse(layoutDataScript.textContent);
        if (layoutData && typeof layoutData.isBackoffice === 'boolean') {
          return layoutData.isBackoffice;
        }
      }
    } catch (error) {
      console.error('Error parsing layout data:', error);
    }
    
    // วิธีที่ 2: ตรวจสอบจาก window.location.pathname
    return window.location.pathname.includes('/backoffice');
  }
  
  // ถ้าอยู่ใน server side จะไม่สามารถตรวจสอบได้จากฟังก์ชันนี้
  // ควรใช้ headers() จาก next/headers แทน
  return false;
}

/**
 * ฟังก์ชันสำหรับดึง pathname ปัจจุบัน
 * ทำงานได้ทั้งใน server และ client side
 */
export function getCurrentPathname() {
  // ตรวจสอบว่าอยู่ใน client side หรือไม่
  if (typeof window !== 'undefined') {
    // วิธีที่ 1: ตรวจสอบจากข้อมูลที่ส่งมาจาก server
    try {
      const layoutDataScript = document.getElementById('layout-data');
      if (layoutDataScript) {
        const layoutData = JSON.parse(layoutDataScript.textContent);
        if (layoutData && layoutData.pathname) {
          return layoutData.pathname;
        }
      }
    } catch (error) {
      console.error('Error parsing layout data:', error);
    }
    
    // วิธีที่ 2: ใช้ window.location.pathname
    return window.location.pathname;
  }
  
  // ถ้าอยู่ใน server side จะไม่สามารถตรวจสอบได้จากฟังก์ชันนี้
  return '';
}
