# DD Property API Collection

## วิธีนำเข้า Collection นี้ใน Postman
1. สร้าง Collection ใหม่ใน Postman
2. แบ่งโครงสร้าง Folders ตามหัวข้อด้านล่าง
3. คัดลอกข้อมูลแต่ละ Request ไปสร้างใน Postman
4. อย่าลืมสร้างตัวแปร Environment ใน Postman:
   - `baseUrl`: URL หลักของ API เช่น http://localhost:5000 หรือ URL ของ server
   - `apiKey`: API Key สำหรับเรียก API ที่ต้องการการยืนยันตัวตน
   - `authToken`: JWT Token ที่ได้จากการ login สำหรับ API ที่ต้องการการยืนยันตัวตนของผู้ใช้

## ตัวแปรที่ใช้ใน Environment
- `baseUrl`: URL หลักของ API (เช่น http://localhost:5000)
- `apiKey`: API Key สำหรับเรียก API
- `authToken`: Token JWT สำหรับการยืนยันตัวตน

---

## 1. Authentication

### 1.1 Login
- **Method**: POST
- **URL**: `{{baseUrl}}/api/auth/login`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response Example**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "your-jwt-token",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "role": "USER"
    }
  }
  ```

### 1.2 Get Profile
- **Method**: GET
- **URL**: `{{baseUrl}}/api/auth/profile`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```
- **Response Example**:
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "role": "USER"
    }
  }
  ```

---

## 2. Properties

### 2.1 Get All Properties
- **Method**: GET
- **URL**: `{{baseUrl}}/api/properties`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```
- **Query Parameters**:
  - `limit`: จำนวนข้อมูลต่อหน้า (optional)
  - `page`: หน้าที่ต้องการ (optional)
  - `sort`: ฟิลด์ที่ต้องการเรียง (optional)
  - `order`: ลำดับการเรียง asc หรือ desc (optional)

### 2.2 Get Property by ID
- **Method**: GET
- **URL**: `{{baseUrl}}/api/properties/:id`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```
- **Response Example**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "Luxury Villa",
      "description": "Beautiful villa with amazing views",
      "price": 5000000,
      "address": "123 Main Street",
      "bedrooms": 4,
      "bathrooms": 3,
      "area": 250,
      "status": "AVAILABLE",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### 2.3 Create Property
- **Method**: POST
- **URL**: `{{baseUrl}}/api/properties`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  Content-Type: multipart/form-data
  ```
- **Body** (form-data):
  - `title`: ชื่อทรัพย์สิน
  - `description`: รายละเอียดทรัพย์สิน
  - `price`: ราคา
  - `address`: ที่อยู่
  - `bedrooms`: จำนวนห้องนอน
  - `bathrooms`: จำนวนห้องน้ำ
  - `area`: พื้นที่ (ตร.ม.)
  - `zoneId`: รหัสโซน
  - `propertyTypeId`: รหัสประเภททรัพย์สิน
  - `propertyPriceTypeId`: รหัสประเภทราคา
  - `status`: สถานะ (AVAILABLE, SOLD, RENTED)
  - `images`: ไฟล์รูปภาพ (สามารถอัพโหลดได้หลายไฟล์)

### 2.4 Update Property
- **Method**: PUT
- **URL**: `{{baseUrl}}/api/properties/:id`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  Content-Type: multipart/form-data
  ```
- **Body** (form-data): เหมือนกับ Create Property

### 2.5 Delete Property
- **Method**: DELETE
- **URL**: `{{baseUrl}}/api/properties/:id`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```

### 2.6 Add Property Image
- **Method**: POST
- **URL**: `{{baseUrl}}/api/properties/:id/images`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  Content-Type: multipart/form-data
  ```
- **Body** (form-data):
  - `images`: ไฟล์รูปภาพ (สามารถอัพโหลดได้หลายไฟล์)

### 2.7 Delete Property Image
- **Method**: DELETE
- **URL**: `{{baseUrl}}/api/properties/images/:id`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```

### 2.8 Get Random Properties
- **Method**: GET
- **URL**: `{{baseUrl}}/api/properties/random`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```
- **Query Parameters**:
  - `limit`: จำนวนข้อมูลที่ต้องการ (optional)

### 2.9 Get Property Types
- **Method**: GET
- **URL**: `{{baseUrl}}/api/properties/types`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```

### 2.10 Get Property Price Types
- **Method**: GET
- **URL**: `{{baseUrl}}/api/properties/price-types`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```

### 2.11 Get My Properties
- **Method**: GET
- **URL**: `{{baseUrl}}/api/properties/backoffice/my-properties`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```

### 2.12 Get Next Property Code
- **Method**: GET
- **URL**: `{{baseUrl}}/api/properties/next-property-code`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```

---

## 3. Zones

### 3.1 Get All Zones
- **Method**: GET
- **URL**: `{{baseUrl}}/api/zones`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```

### 3.2 Get Cities with Zones
- **Method**: GET
- **URL**: `{{baseUrl}}/api/zones/cities`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```

### 3.3 Get Explore Locations
- **Method**: GET
- **URL**: `{{baseUrl}}/api/zones/explore`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```

### 3.4 Get Zone by ID
- **Method**: GET
- **URL**: `{{baseUrl}}/api/zones/:id`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```

### 3.5 Get Properties by Zone
- **Method**: GET
- **URL**: `{{baseUrl}}/api/zones/:id/properties`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```
- **Query Parameters**:
  - `limit`: จำนวนข้อมูลต่อหน้า (optional)
  - `page`: หน้าที่ต้องการ (optional)

---

## 4. Search

### 4.1 Search Properties
- **Method**: GET
- **URL**: `{{baseUrl}}/api/search/properties`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```
- **Query Parameters**:
  - `keyword`: คำค้นหา (optional)
  - `zoneId`: รหัสโซน (optional)
  - `propertyTypeId`: รหัสประเภททรัพย์สิน (optional)
  - `minPrice`: ราคาต่ำสุด (optional)
  - `maxPrice`: ราคาสูงสุด (optional)
  - `bedrooms`: จำนวนห้องนอน (optional)
  - `bathrooms`: จำนวนห้องน้ำ (optional)
  - `minArea`: พื้นที่ต่ำสุด (optional)
  - `maxArea`: พื้นที่สูงสุด (optional)
  - `limit`: จำนวนข้อมูลต่อหน้า (optional)
  - `page`: หน้าที่ต้องการ (optional)

---

## 5. Users

### 5.1 Get All Users
- **Method**: GET
- **URL**: `{{baseUrl}}/api/users`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```

### 5.2 Get Current User
- **Method**: GET
- **URL**: `{{baseUrl}}/api/users/me`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```

### 5.3 Change Password
- **Method**: PUT
- **URL**: `{{baseUrl}}/api/users/me/password`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "currentPassword": "current-password",
    "newPassword": "new-password",
    "confirmPassword": "new-password"
  }
  ```

### 5.4 Get User by ID
- **Method**: GET
- **URL**: `{{baseUrl}}/api/users/:id`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```

### 5.5 Create User
- **Method**: POST
- **URL**: `{{baseUrl}}/api/users`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "name": "User Name",
    "email": "new-user@example.com",
    "password": "password",
    "role": "USER",
    "phone": "0899999999"
  }
  ```

### 5.6 Update User
- **Method**: PUT
- **URL**: `{{baseUrl}}/api/users/:id`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "name": "Updated Name",
    "email": "updated-email@example.com",
    "role": "USER"
  }
  ```

---

## 6. Blogs

### 6.1 Get All Blogs
- **Method**: GET
- **URL**: `{{baseUrl}}/api/blogs`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```
- **Query Parameters**:
  - `limit`: จำนวนข้อมูลต่อหน้า (optional)
  - `page`: หน้าที่ต้องการ (optional)

### 6.2 Get Blog by ID
- **Method**: GET
- **URL**: `{{baseUrl}}/api/blogs/:id`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```

---

## 7. Messages

### 7.1 Create Message
- **Method**: POST
- **URL**: `{{baseUrl}}/api/messages`
- **Headers**:
  ```
  Content-Type: application/json
  x-api-key: {{apiKey}}
  ```
- **Body** (raw JSON):
  ```json
  {
    "name": "Sender Name",
    "email": "sender@example.com",
    "phone": "0899999999",
    "subject": "Message Subject",
    "message": "Message content here",
    "propertyId": 1
  }
  ```

### 7.2 Get All Messages
- **Method**: GET
- **URL**: `{{baseUrl}}/api/messages`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```
- **Query Parameters**:
  - `limit`: จำนวนข้อมูลต่อหน้า (optional)
  - `page`: หน้าที่ต้องการ (optional)

---

## 8. Dashboard

### 8.1 Get Dashboard Stats
- **Method**: GET
- **URL**: `{{baseUrl}}/api/dashboard/stats`
- **Headers**:
  ```
  Authorization: Bearer {{authToken}}
  ```

---

## 9. Currencies

### 9.1 Get All Currencies
- **Method**: GET
- **URL**: `{{baseUrl}}/api/currencies`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```

### 9.2 Get Currency Rates
- **Method**: GET
- **URL**: `{{baseUrl}}/api/currencies/rates`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```

---

## 10. Icons

### 10.1 Get All Icons
- **Method**: GET
- **URL**: `{{baseUrl}}/api/icons`
- **Headers**:
  ```
  x-api-key: {{apiKey}}
  ```
