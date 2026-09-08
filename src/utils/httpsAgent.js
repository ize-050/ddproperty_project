/**
 * ⚠️ ชั่วคราว: backend (Cloudways) ยังไม่ได้ผูก domain/SSL จริง ใบ cert เป็น self-signed
 * ทำให้การเรียก HTTPS ฝั่ง SSR เจอ error SELF_SIGNED_CERT_IN_CHAIN
 *
 * ไฟล์นี้รวม helper สำหรับ "ยอมรับ self-signed cert" ให้ใช้ร่วมกัน เหมือนที่ serverApi.js ทำ
 * ใช้ได้เฉพาะฝั่ง server เท่านั้น (guard ด้วย typeof window === 'undefined')
 *
 * - getHttpsAgent()  -> https.Agent สำหรับ axios (option: httpsAgent)
 * - getFetchDispatcher() -> undici Agent สำหรับ fetch ของ Node (option: dispatcher)
 *
 * TODO: เมื่อผูก domain + Let's Encrypt เรียบร้อยแล้ว ให้ลบไฟล์นี้และการเรียกใช้ทั้งหมดออก
 */

// สร้างครั้งเดียว reuse (module-level cache)
let _httpsAgent;
let _fetchDispatcher;

/**
 * https.Agent สำหรับ axios (serverApi ใช้ตัวนี้ได้)
 */
export function getHttpsAgent() {
  if (typeof window !== 'undefined') return undefined;
  if (_httpsAgent) return _httpsAgent;

  // require แบบ dynamic เพื่อไม่ให้ถูก bundle เข้า client
  const https = require('https');
  _httpsAgent = new https.Agent({ rejectUnauthorized: false });
  return _httpsAgent;
}

/**
 * dispatcher สำหรับ fetch ของ Node (undici)
 * fetch ไม่รับ httpsAgent ต้องส่งผ่าน option `dispatcher`
 * คืน undefined ถ้าอยู่ฝั่ง client หรือ undici ไม่พร้อมใช้
 */
export function getFetchDispatcher() {
  if (typeof window !== 'undefined') return undefined;
  if (_fetchDispatcher) return _fetchDispatcher;

  try {
    // undici มาพร้อม Node 18+ (ตัวที่อยู่เบื้องหลัง global fetch)
    const { Agent } = require('undici');
    _fetchDispatcher = new Agent({
      connect: { rejectUnauthorized: false },
    });
    return _fetchDispatcher;
  } catch (e) {
    // เผื่อ environment ไม่มี undici ให้ fallback เป็น undefined
    console.warn('[httpsAgent] undici Agent ไม่พร้อมใช้งาน, fetch อาจยัง reject self-signed cert:', e?.message);
    return undefined;
  }
}
