import { redirect } from 'next/navigation';

// ภาษาเริ่มต้นคือไทย
export const defaultLocale = 'th';

// หน้านี้จะทำการ redirect ไปยังภาษาเริ่มต้น
export default function RootPage() {
  // ทำการ redirect ไปยังภาษาเริ่มต้น
  redirect(`/${defaultLocale}`);
}
