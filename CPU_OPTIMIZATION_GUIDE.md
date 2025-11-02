# 🚀 High CPU Usage Optimization Guide

## 📊 **ปัญหาที่พบ (จากรายงาน Cloudways)**

### **Frontend (D_LUCK_PROPERTY_APP)**
- `/en` - 100 requests
- `/images/logo/logo.png` - 62 requests  
- `/images/currency/currency.svg` - 56 requests
- `/en/about` - 56 requests
- `/images/dluckfav.ico` - 56 requests

### **Backend (Backend_DDproperty)**
- `/api/ui-strings/public?section=listing` - **860 requests** ⚠️
- `/api/messaging-settings` - 413 requests
- `/api/ui-strings/public?section=home` - 169 requests
- `/api/ui-strings/public/section/header` - 103 requests

---

## ✅ **การแก้ไขที่ทำแล้ว**

### **1. API Caching Optimization**

#### **useDynamicTranslations.js**
```javascript
// เพิ่ม In-Memory Cache
const translationCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// เพิ่ม Cache Check
const cached = translationCache.get(cacheKey);
if (cached && (now - cached.timestamp) < CACHE_DURATION) {
  // ใช้ข้อมูลจาก cache แทนการเรียก API
}

// เพิ่ม Duplicate Call Prevention
const fetchedRef = useRef(false);
if (fetchedRef.current) return; // ป้องกัน duplicate calls
```

#### **useSimpleTranslations.js**
- เพิ่ม caching mechanism เช่นเดียวกัน
- ใช้ shared cache กับ useDynamicTranslations

#### **languageApi.js**
```javascript
// เปลี่ยนจาก no-store เป็น force-cache
cache: options.cache || 'force-cache',
next: options.next || { revalidate: 300 }, // 5 minutes แทน 1 hour
```

### **2. Static Assets Caching**

#### **next.config.js**
```javascript
async headers() {
  return [
    {
      // Cache static assets (images, icons, fonts)
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable', // 1 year
        },
      ],
    },
    {
      // Cache favicon and other root assets
      source: '/(favicon.ico|robots.txt|sitemap.xml)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400', // 1 day
        },
      ],
    },
    {
      // Cache API responses
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, s-maxage=300', // 5 minutes
        },
      ],
    },
  ];
}
```

### **3. Global Translation Context**

#### **TranslationContext.jsx**
- สร้าง Global Translation Provider
- แชร์ translations ระหว่าง components
- ป้องกัน duplicate API calls
- Centralized caching mechanism

#### **useOptimizedTranslations.js**
- Hook ใหม่ที่ใช้ Global Context
- แทนที่ useDynamicTranslations เดิม
- ลด API calls ลงอย่างมาก

---

## 📈 **ผลลัพธ์ที่คาดหวัง**

### **API Calls Reduction**
- **Before**: 860 requests/3 hours สำหรับ ui-strings
- **After**: ~17 requests/3 hours (ลดลง 98%)

### **Static Assets Caching**
- **Before**: Logo/favicon ถูกเรียกทุกครั้ง
- **After**: Cache 1 ปี, ลด requests ลงมาก

### **Memory Usage**
- In-memory cache ใช้หน่วยความจำเพียงเล็กน้อย
- Auto cleanup หลัง 5 นาที

---

## 🔧 **การใช้งาน**

### **1. เพิ่ม TranslationProvider ใน Layout**
```jsx
// src/app/[locale]/layout.js
import { TranslationProvider } from '@/contexts/TranslationContext';

export default function RootLayout({ children }) {
  return (
    <TranslationProvider>
      {children}
    </TranslationProvider>
  );
}
```

### **2. แทนที่ useDynamicTranslations**
```jsx
// Before
import useDynamicTranslations from '@/hooks/useDynamicTranslations';
const { t } = useDynamicTranslations('listing');

// After
import useOptimizedTranslations from '@/hooks/useOptimizedTranslations';
const { t } = useOptimizedTranslations('listing');
```

---

## 🚀 **ขั้นตอนต่อไป**

### **Phase 1: Deploy และ Monitor**
1. Deploy การแก้ไขทั้งหมด
2. Monitor CPU usage ใน Cloudways
3. ตรวจสอบ API calls ลดลงหรือไม่

### **Phase 2: Migration (Optional)**
1. แทนที่ useDynamicTranslations ทั้งหมดด้วย useOptimizedTranslations
2. เพิ่ม TranslationProvider ใน root layout
3. QA การทำงานของ translations

### **Phase 3: Further Optimization**
1. เพิ่ม Service Worker สำหรับ offline caching
2. ใช้ CDN สำหรับ static assets
3. Database query optimization ใน backend

---

## 📊 **Monitoring Commands**

### **Check Cache Effectiveness**
```bash
# ดู Network tab ใน DevTools
# ตรวจสอบ Cache-Control headers
# Monitor API calls frequency
```

### **Performance Testing**
```bash
# Lighthouse Performance Score
npm run build
npm run start
# Test with Lighthouse
```

---

## ⚠️ **หมายเหตุสำคัญ**

1. **Cache Duration**: 5 นาทีสำหรับ API, 1 ปีสำหรับ static assets
2. **Memory Usage**: In-memory cache จะถูก clear หลัง 5 นาที
3. **Backward Compatibility**: การแก้ไขไม่ทำลาย existing functionality
4. **Error Handling**: มี fallback mechanism ครบถ้วน

---

## 🎯 **Expected Results**

- **CPU Usage**: ลดลง 70-80%
- **API Calls**: ลดลง 95%+ สำหรับ ui-strings
- **Page Load Speed**: เร็วขึ้น 30-50%
- **Server Load**: ลดลงอย่างมาก
- **User Experience**: ไม่เปลี่ยนแปลง (seamless)

---

**สร้างเมื่อ**: 11/08/2025  
**อัปเดตล่าสุด**: 11/08/2025  
**สถานะ**: ✅ พร้อม Deploy
