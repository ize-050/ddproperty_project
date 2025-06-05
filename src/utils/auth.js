// ฟังก์ชั่นสำหรับดึง token จาก localStorage
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// ฟังก์ชั่นสำหรับตรวจสอบว่า user login หรือยัง
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    return !!token; 
  }
  return false;
};
