import dynamic from 'next/dynamic';

// ใช้ dynamic import เพื่อแก้ไขปัญหา hydration error
// ตั้งค่า ssr: false เพื่อให้ component ถูกโหลดเฉพาะฝั่ง client เท่านั้น
const ClientWrapper = dynamic(() => import('./ClientWrapper'), { ssr: false });

const Wrapper = ({ children }) => {
  return <ClientWrapper>{children}</ClientWrapper>;
};

export default Wrapper;
