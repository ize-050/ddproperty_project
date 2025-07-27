# Issues ที่ต้องแก้ไข - Backoffice System

## วันที่: 22/07/2025

### Priority: HIGH 🔴

#### 1. Property Description - Flag Icons ไม่แสดง
- **Location**: `/backoffice/Property Description`
- **Problem**: ธงชาติยังไม่ขึ้น (ยังใช้ emoji แทนที่จะเป็น flag-icons)
- **Expected**: ใช้ flag-icons CSS library เหมือนส่วนอื่นๆ ของระบบ
- **Files to check**: 
  - Property description component
  - Language switcher ในหน้า property description

#### 2. Property Form - Required Fields ที่ไม่จำเป็น
- **Location**: หน้าเพิ่ม/แก้ไข Property
- **Problem**: ต้องกรอกห้องน้ำ ห้องนอน ชั้น แม้กระทั่งคอนโด (ไม่กรอกก็แอดไม่ได้)
- **Expected**: ปรับให้ fields เหล่านี้เป็น optional
- **Impact**: User experience - บางประเภท property ไม่จำเป็นต้องมีข้อมูลเหล่านี้
- **Files to check**:
  - Property form validation
  - Backend validation rules

#### 3. List Property - Pagination ไม่ทำงาน
- **Location**: หน้า List Property
- **Problem**: Pagination เลื่อนไม่ได้
- **Expected**: สามารถเลื่อนหน้าได้ปกติ
- **Files to check**:
  - List property component
  - Pagination component
  - API pagination logic

### Priority: MEDIUM 🟡

#### 4. Property Duplication - Property ID ไม่แสดง
- **Location**: หน้า Property Duplication
- **Problem**: เมื่อ duplicate property แล้ว property ID ไม่ขึ้นมาทันที ต้องกดเซฟก่อนถึงจะเห็น
- **Expected**: Property ID ควรแสดงทันทีหลัง duplication
- **Files to check**:
  - Property duplication logic
  - Property form state management

#### 5. List Property - ขาด Property ID Column
- **Location**: หน้า List Property
- **Problem**: ไม่มี Property ID แสดงในตาราง
- **Expected**: เพิ่มคอลัมน์ Property ID ในตาราง
- **Files to check**:
  - List property table component
  - Table columns configuration

#### 6. Floor Options - ขาดชั้นสูง
- **Location**: Property Form (Add/Edit)
- **Problem**: Floor dropdown มีแค่ชั้นต่ำ ต้องเพิ่มถึงชั้น 59
- **Expected**: Floor dropdown ควรมีตัวเลือกถึงชั้น 59
- **Files to check**:
  - Property form component
  - Floor dropdown options

#### 7. Community Fees - หน่วยผิด
- **Location**: Property Form (Add/Edit)
- **Problem**: Community Fees แสดงเป็น "Month" ควรเป็น "Sqm."
- **Expected**: เปลี่ยนหน่วยจาก Month เป็น Sqm.
- **Files to check**:
  - Property form component
  - Community fees field label

---

## Frontend Issues

### Priority: HIGH 🔴

#### 8. Price Range - ขาด Comma Formatting
- **Location**: Price Range Modal + หน้าแรก Price Range
- **Problem**: ตัวเลขไม่มี comma (,) เมื่อมากกว่า 1,000
- **Expected**: แสดงตัวเลขแบบ 1,000 / 10,000 / 1,000,000
- **Files to check**:
  - Price range modal component
  - Homepage price range component
  - Number formatting utility

#### 9. Contact Us Form - ไม่ทำงาน
- **Location**: หน้าแรก Contact Us Form
- **Problem**: Form ส่งไม่ได้ (API integration issue)
- **Expected**: สามารถส่ง contact form ได้ปกติ
- **Files to check**:
  - Contact form component
  - API integration
  - Backend contact endpoint

### Priority: MEDIUM 🟡

#### 10. Property Detail - ขาด Contact Links
- **Location**: หน้า Property Detail
- **Problem**: ไม่มี contact link ครบทุกจุดที่ควรมี
- **Expected**: ใส่ contact link ให้ครบทุกจุดที่เหมาะสม
- **Files to check**:
  - Property detail page
  - Contact button components

#### 11. For More Information - เอา +66 ออก + แก้ไข Icon เบลอ
- **Location**: For More Information Section
- **Problem**: มี +66 ที่ไม่ต้องการ และ icon เบลอ
- **Expected**: เอา +66 ออกไม่ต้องมี และแก้ไข icon ให้คมชัด
- **Files to check**:
  - For more information component
  - Icon assets
  - Phone number display format

#### 12. Mobile Menu - แสดง Logo แทน Text ✅
- **Location**: Mobile Navigation Menu
- **Problem**: Mobile menu แสดง "DLUCKPROPERTY" เป็น text
- **Expected**: ใส่ Logo แทน text "DLUCKPROPERTY" ใน mobile menu
- **Files to check**:
  - Mobile navigation component
  - Logo assets
  - Responsive menu layout

#### 13. Icon เบลอ - แก้ไขความคมชัด ✅
- **Location**: Various locations with blurry icons
- **Problem**: Icon ต่างๆ เบลอไม่คมชัด
- **Expected**: แก้ไข icon ให้คมชัดทุกตำแหน่ง
- **Files to check**:
  - Icon assets (SVG/PNG)
  - CSS icon styling
  - Image optimization

#### 14. Property Detail - Contact Agent Links ไม่ครบ ✅
- **Location**: Property Detail Page - Contact Agent Section
- **Problem**: Contact agent ไม่มี link ครบทุกจุดที่ควรมี
- **Expected**: ใส่ contact link ให้ครบทุกจุดใน contact agent section
- **Files to check**:
  - Property detail page
  - Contact agent component
  - Contact links integration

#### 15. RandomProperties Card - Text Readability + Location Display ✅
- **Location**: Homepage RandomProperties Cards
- **Problem**: Text ใน card อ่านยาก และแสดง address แทน location
- **Expected**: 
  - เพิ่ม gradient โปร่งใส สีดำรองบางๆ หน้ารูปเพื่อให้อ่าน text ง่าย
  - แสดง location แทน address
- **Files to check**:
  - RandomProperties component
  - Card styling (CSS)
  - Location vs address data mapping

#### 16. Contact Us Form หน้าแรก - ไม่ทำงาน ✅
- **Location**: Homepage Contact Us Form
- **Problem**: Contact form หน้าแรกไม่ทำงาน
- **Expected**: ให้ทำงานเหมือนหน้า Contact page
- **Files to check**:
  - Homepage contact form component
  - Contact page form logic
  - API integration comparison

---

## Action Plan

### Phase 1: Backoffice Flag Icons Fix
1. หา property description component
2. เพิ่ม flag-icons import
3. แทนที่ emoji flags ด้วย CSS flag classes

### Phase 2: Backoffice Form Improvements
1. ตรวจสอบ frontend validation rules
2. ตรวจสอบ backend validation rules
3. ปรับให้ bathroom/bedroom/floor เป็น optional
4. เพิ่ม Floor options ถึงชั้น 59
5. เปลี่ยน Community Fees หน่วยจาก Month เป็น Sqm.

### Phase 3: Backoffice List & Pagination Fix
1. ตรวจสอบ pagination component
2. ตรวจสอบ API response
3. แก้ไข pagination logic
4. เพิ่ม Property ID column ในหน้า list
5. แก้ไข duplication logic ให้แสดง ID ทันที

### Phase 4: Frontend Price & Contact Fix
1. เพิ่ม comma formatting ในตัวเลข price range
2. แก้ไข Contact Us form API integration
3. เพิ่ม contact links ในหน้า property detail
4. แก้ไข For More Information section (เอา +66 ออก, แก้ icon เบลอ)

---

## Testing Checklist

### Backoffice Tests
- [x] ธงชาติแสดงถูกต้องในหน้า Property Description
- [x] สามารถเพิ่ม property โดยไม่กรอกห้องน้ำ/ห้องนอน/ชั้น (แก้ไข backend validation)
- [x] Floor dropdown มีตัวเลือกถึงชั้น 59
- [x] Community Fees แสดงหน่วยเป็น "Sqm." แทน "Month"
- [x] Pagination ทำงานได้ปกติในหน้า List Property
- [] Property ID แสดงทันทีหลัง duplication
- [x] Property ID แสดงในตารางหน้า List Property

### Frontend Tests
- [ ] Price Range modal แสดง comma (,) ในตัวเลขมากกว่า 1,000
- [ ] Price Range หน้าแรกแสดง comma (,) ในตัวเลขมากกว่า 1,000
- [ ] Contact Us form หน้าแรกส่งได้ปกติ
- [ ] Property detail มี contact links ครบทุกจุดที่เหมาะสม
- [x] For More Information ไม่มี +66 และ icon คมชัด

---

## Notes
- ใช้ flag-icons library ที่ติดตั้งไว้แล้ว
- ตรวจสอบ responsive design หลังแก้ไข
- Test ใน browser ต่างๆ รวมทั้ง Windows
