# Dynamic Translation System Implementation

## Overview

ระบบแปลภาษาแบบ Dynamic ที่ดึงข้อมูลจากฐานข้อมูลแทนการใช้ไฟล์ static JSON สำหรับ section "listing" ของเว็บไซต์อสังหาริมทรัพย์

## Architecture

### 1. Backend API Integration
- **Endpoint**: `/api/ui-strings/public?section=listing`
- **Response Format**: 
```json
{
  "data": [
    {
      "slug": "property-type-condo",
      "en": "Condominium",
      "th": "คอนโดมิเนียม", 
      "zhCN": "公寓",
      "ru": "Кондоминиум"
    }
  ]
}
```

### 2. Frontend Components

#### A. Custom Hook: `useDynamicTranslations`
**Location**: `/src/hooks/useDynamicTranslations.js`

**Features**:
- Fetches translations from backend API
- Provides fallback mechanism (current locale → English → fallback text)
- Caches translations in component state
- Handles loading and error states

**Usage**:
```javascript
const { t, getPropertyTypeText, getListingTypeText, loading } = useDynamicTranslations('listing');
```

#### B. Utility Functions: `propertyTypeUtils`
**Location**: `/src/utils/propertyTypeUtils.js`

**Features**:
- Transform static data to use dynamic translations
- Property type mapping for dropdowns
- Apartment type transformation

#### C. Demo Component: `DynamicPropertyTypes`
**Location**: `/src/components/common/DynamicPropertyTypes.jsx`

**Features**:
- Demonstrates dynamic translation usage
- Shows before/after comparison
- Grid display of property types

## Implementation Examples

### 1. Property Detail Page Integration

**Before** (Hardcoded):
```javascript
const getPropertyTypeText = (propertyType) => {
  const types = {
    CONDO: { th: 'คอนโดมิเนียม', en: 'Condominium' }
  };
  return types[propertyType]?.[locale] || propertyType;
};
```

**After** (Dynamic):
```javascript
const { getPropertyTypeText } = useDynamicTranslations('listing');
// Function now pulls from database automatically
```

### 2. Static Data Transformation

**Before**:
```javascript
const apartmentTypes = [
  { title: "Houses", count: 22 },
  { title: "Apartments", count: 22 }
];
```

**After**:
```javascript
const { transformApartmentTypes } = usePropertyTypeUtils();
const dynamicApartmentTypes = transformApartmentTypes(apartmentTypes);
// Titles are now translated dynamically
```

## Database Schema

### Table: `ui_string`
```sql
CREATE TABLE ui_string (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section VARCHAR(50) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  en TEXT,
  th TEXT,
  zhCN TEXT,
  ru TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_section_slug (section, slug)
);
```

### Sample Data (section: 'listing'):
```sql
INSERT INTO ui_string (section, slug, en, th, zhCN, ru) VALUES
('listing', 'property-type-condo', 'Condominium', 'คอนโดมิเนียม', '公寓', 'Кондоминиум'),
('listing', 'property-type-house', 'House', 'บ้านเดี่ยว', '独立屋', 'Дом'),
('listing', 'listing-type-sale', 'For Sale', 'ขาย', '出售', 'Продажа'),
('listing', 'listing-type-rent', 'For Rent', 'เช่า', '出租', 'Аренда');
```

## Testing

### Test Page: `/test-translations`
**Location**: `/src/app/test-translations/page.jsx`

**Features**:
- Real-time translation testing
- Raw database data display
- Property type translation examples
- Listing type translation examples
- Multi-language support verification

### Test Commands:
```bash
# Start development server
npm run dev

# Open test page
http://localhost:3002/test-translations
```

## Integration Points

### 1. Components to Update:
- `PropertyDetailPage.jsx` ✅ (In Progress)
- Property filter components
- Property listing components
- Search result components

### 2. Static Data Files to Replace:
- `/src/data/apartmentType.js`
- `/src/data/apartmentTypes2.js`
- Property type dropdowns

### 3. Translation Keys Mapping:

| Static Text | Database Slug | Supported Languages |
|-------------|---------------|-------------------|
| Condominium | property-type-condo | en, th, zhCN, ru |
| House | property-type-house | en, th, zhCN, ru |
| For Sale | listing-type-sale | en, th, zhCN, ru |
| For Rent | listing-type-rent | en, th, zhCN, ru |

## Performance Considerations

### 1. Caching Strategy:
- Component-level state caching
- API response caching
- Fallback to hardcoded values during loading

### 2. Error Handling:
- Graceful degradation to hardcoded translations
- Loading states for better UX
- Error logging for debugging

### 3. Optimization:
- Single API call per section
- Memoized translation functions
- Lazy loading for non-critical translations

## Migration Strategy

### Phase 1: ✅ Core Infrastructure
- [x] Create `useDynamicTranslations` hook
- [x] Create utility functions
- [x] Create test components
- [x] Set up test page

### Phase 2: 🔄 Component Integration
- [x] Update `PropertyDetailPage.jsx`
- [ ] Update property filter components
- [ ] Update property listing components

### Phase 3: 📋 Data Migration
- [ ] Replace static data files
- [ ] Update dropdown components
- [ ] Update search components

### Phase 4: 📋 Testing & Optimization
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Error handling improvements

## Benefits

### 1. Maintainability:
- Centralized translation management
- Database-driven content updates
- No code deployment for translation changes

### 2. Scalability:
- Easy addition of new languages
- Dynamic content management
- Admin interface integration

### 3. Consistency:
- Single source of truth
- Standardized translation keys
- Fallback mechanism ensures reliability

## Next Steps

1. **Complete PropertyDetailPage Integration**: Ensure all hardcoded translations are replaced
2. **Update Filter Components**: Apply dynamic translations to property search filters
3. **Create Admin Interface**: Allow non-technical users to manage translations
4. **Performance Testing**: Optimize API calls and caching strategy
5. **Documentation**: Create user guide for content managers

## API Documentation

### Fetch Translations:
```javascript
GET /api/ui-strings/public?section=listing
Response: { data: [{ slug, en, th, zhCN, ru }] }
```

### Error Handling:
```javascript
try {
  const response = await fetch('/api/ui-strings/public?section=listing');
  const data = await response.json();
} catch (error) {
  // Fallback to hardcoded translations
}
```

---

**Implementation Date**: July 28, 2025  
**Status**: Phase 1 Complete, Phase 2 In Progress  
**Next Review**: After Phase 2 completion
