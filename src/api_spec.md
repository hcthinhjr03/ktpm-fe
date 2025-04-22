# Đặc tả API cho hệ thống quản lý nước

## 1. Contract API

### 1.1. Lấy tất cả hợp đồng

- **Endpoint**: `GET /api/contracts`
- **Method**: GET
- **Parameters**: Không có
- **Response**:
  - Status: 200 OK
  - Body: Mảng các đối tượng Contract
  ```json
  [
    {
      "contractId": 1,
      "signDate": "2025-04-01",
      "startDate": "2025-04-05",
      "endDate": "2026-04-05",
      "status": "active",
      "apartment": {
        "apartmentId": 1,
        "apartmentNumber": "A101",
        "building": "Tòa nhà A",
        "area": 85.5,
        "status": "occupied"
      },
      "waterService": {
        "serviceId": 1,
        "serviceName": "Nước sinh hoạt",
        "description": "Dịch vụ cung cấp nước sinh hoạt",
        "unit": "m³",
        "priceRates": [
          {
            "rateId": 1,
            "fromAmount": 0.0,
            "toAmount": 10.0,
            "unitPrice": 5800.0,
            "effectiveDate": "2023-01-01",
            "expiryDate": "2023-12-31"
          }
        ]
      },
      "customer": {
        "customerId": 1,
        "fullName": "Nguyễn Văn A",
        "identityCard": "123456789012",
        "phoneNumber": "0987654321",
        "email": "nguyenvana@example.com",
        "address": "Hà Nội"
      }
    }
  ]
  ```

### 1.2. Lấy hợp đồng theo ID

- **Endpoint**: `GET /api/contracts/{id}`
- **Method**: GET
- **Path Parameters**:
  - `id`: ID của hợp đồng cần lấy
- **Response**:
  - Status: 200 OK nếu tìm thấy
  - Status: 404 Not Found nếu không tìm thấy
  - Body: Đối tượng Contract
  ```json
    {
      "contractId": 1,
      "signDate": "2025-04-01",
      "startDate": "2025-04-05",
      "endDate": "2026-04-05",
      "status": "active",
      "apartment": {
        "apartmentId": 1,
        "apartmentNumber": "A101",
        "building": "Tòa nhà A",
        "area": 85.5,
        "status": "occupied"
      },
      "waterService": {
        "serviceId": 1,
        "serviceName": "Nước sinh hoạt",
        "description": "Dịch vụ cung cấp nước sinh hoạt",
        "unit": "m³",
        "priceRates": [
          {
            "rateId": 1,
            "fromAmount": 0.0,
            "toAmount": 10.0,
            "unitPrice": 5800.0,
            "effectiveDate": "2023-01-01",
            "expiryDate": "2023-12-31"
          }
        ]
      },
      "customer": {
        "customerId": 1,
        "fullName": "Nguyễn Văn A",
        "identityCard": "123456789012",
        "phoneNumber": "0987654321",
        "email": "nguyenvana@example.com",
        "address": "Hà Nội"
      }
    }
  ```

### 1.3. Tạo hợp đồng mới

- **Endpoint**: `POST /api/contracts`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "signDate": "2025-04-01",
    "startDate": "2025-04-05",
    "endDate": "2026-04-05",
    "status": "active",
    "apartment": {
      "apartmentId": 1
    },
    "waterService": {
      "serviceId": 1
    },
    "customer": {
      "customerId": 1
    }
  }
  ```
- **Response**:
  - Status: 201 Created
  - Body: Đối tượng Contract đã tạo

### 1.7. Xóa hợp đồng

- **Endpoint**: `DELETE /api/contracts/{id}`
- **Method**: DELETE
- **Path Parameters**:
  - `id`: ID của hợp đồng cần xóa
- **Response**:
  - Status: 204 No Content nếu xóa thành công
  - Status: 404 Not Found nếu không tìm thấy hợp đồng
  ```

## 2. Customer API

### 2.1. Lấy tất cả khách hàng

- **Endpoint**: `GET /api/customers`
- **Method**: GET
- **Response**:
  - Status: 200 OK
  - Body: Mảng các đối tượng Customer
  ```json
  [
    {
      "customerId": 1,
      "fullName": "Nguyễn Văn A",
      "identityCard": "123456789012",
      "phoneNumber": "0987654321",
      "email": "nguyenvana@example.com",
      "address": "Hà Nội"
    }
  ]
  ```

### 2.2. Lấy khách hàng theo ID

- **Endpoint**: `GET /api/customers/{id}`
- **Method**: GET
- **Path Parameters**:
  - `id`: ID của khách hàng cần lấy
- **Response**:
  - Status: 200 OK nếu tìm thấy
  - Status: 404 Not Found nếu không tìm thấy
  - Body: Đối tượng Customer

### 2.3. Tìm khách hàng theo CMND/CCCD

- **Endpoint**: `GET /api/customers/search/identity-card`
- **Method**: GET
- **Request Parameters**:
  - `identityCard`: Số CMND/CCCD của khách hàng
- **Response**:
  - Status: 200 OK nếu tìm thấy
  - Status: 404 Not Found nếu không tìm thấy
  - Body: Đối tượng Customer

### 2.4. Tìm khách hàng theo số điện thoại

- **Endpoint**: `GET /api/customers/search/phone`
- **Method**: GET
- **Request Parameters**:
  - `phoneNumber`: Số điện thoại của khách hàng
- **Response**:
  - Status: 200 OK nếu tìm thấy
  - Status: 404 Not Found nếu không tìm thấy
  - Body: Đối tượng Customer

### 2.5. Tìm khách hàng theo email

- **Endpoint**: `GET /api/customers/search/email`
- **Method**: GET
- **Request Parameters**:
  - `email`: Email của khách hàng
- **Response**:
  - Status: 200 OK nếu tìm thấy
  - Status: 404 Not Found nếu không tìm thấy
  - Body: Đối tượng Customer

### 2.6. Tìm khách hàng theo tên

- **Endpoint**: `GET /api/customers/search/name`
- **Method**: GET
- **Request Parameters**:
  - `fullName`: Tên đầy đủ hoặc một phần tên của khách hàng
- **Response**:
  - Status: 200 OK
  - Body: Mảng các đối tượng Customer

### 2.7. Tạo khách hàng mới

- **Endpoint**: `POST /api/customers`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "fullName": "Nguyễn Văn B",
    "identityCard": "987654321098",
    "phoneNumber": "0123456789",
    "email": "nguyenvanb@example.com",
    "address": "Hồ Chí Minh"
  }
  ```
- **Response**:
  - Status: 201 Created
  - Body: Đối tượng Customer đã tạo

### 2.8. Cập nhật khách hàng

- **Endpoint**: `PUT /api/customers/{id}`
- **Method**: PUT
- **Path Parameters**:
  - `id`: ID của khách hàng cần cập nhật
- **Request Body**:
  ```json
  {
    "fullName": "Nguyễn Văn B Updated",
    "phoneNumber": "0123456789",
    "email": "nguyenvanb.updated@example.com",
    "address": "Đà Nẵng"
  }
  ```
- **Response**:
  - Status: 200 OK nếu cập nhật thành công
  - Status: 404 Not Found nếu không tìm thấy khách hàng
  - Body: Đối tượng Customer đã cập nhật

### 2.9. Xóa khách hàng

- **Endpoint**: `DELETE /api/customers/{id}`
- **Method**: DELETE
- **Path Parameters**:
  - `id`: ID của khách hàng cần xóa
- **Response**:
  - Status: 204 No Content nếu xóa thành công
  - Status: 404 Not Found nếu không tìm thấy khách hàng

## 3. Apartment API

### 3.1. Lấy tất cả căn hộ

- **Endpoint**: `GET /api/apartments`
- **Method**: GET
- **Response**:
  - Status: 200 OK
  - Body: Mảng các đối tượng Apartment
  ```json
  [
    {
      "apartmentId": 1,
      "apartmentNumber": "A101",
      "building": "Tòa nhà A",
      "area": 85.5,
      "status": "occupied",
      "customer": {
        "customerId": 1,
        "fullName": "Nguyễn Văn A"
      }
    }
  ]
  ```

### 3.2. Lấy căn hộ theo ID

- **Endpoint**: `GET /api/apartments/{id}`
- **Method**: GET
- **Path Parameters**:
  - `id`: ID của căn hộ cần lấy
- **Response**:
  - Status: 200 OK nếu tìm thấy
  - Status: 404 Not Found nếu không tìm thấy
  - Body: Đối tượng Apartment

### 3.3. Lấy căn hộ theo khách hàng

- **Endpoint**: `GET /api/apartments/customer/{customerId}`
- **Method**: GET
- **Path Parameters**:
  - `customerId`: ID của khách hàng
- **Response**:
  - Status: 200 OK
  - Body: Mảng các đối tượng Apartment của khách hàng đó


### 3.6. Tạo căn hộ mới

- **Endpoint**: `POST /api/apartments`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "apartmentNumber": "B202",
    "building": "Tòa nhà B",
    "area": 72.3,
    "status": "vacant",
    "customer": {
      "customerId": 2
    }
  }
  ```
- **Response**:
  - Status: 201 Created
  - Body: Đối tượng Apartment đã tạo

### 3.7. Cập nhật căn hộ

- **Endpoint**: `PUT /api/apartments/{id}`
- **Method**: PUT
- **Path Parameters**:
  - `id`: ID của căn hộ cần cập nhật
- **Request Body**:
  ```json
  {
    "apartmentNumber": "B202",
    "status": "occupied",
    "customer": {
      "customerId": 3
    }
  }
  ```
- **Response**:
  - Status: 200 OK nếu cập nhật thành công
  - Status: 404 Not Found nếu không tìm thấy căn hộ
  - Body: Đối tượng Apartment đã cập nhật

### 3.8. Xóa căn hộ

- **Endpoint**: `DELETE /api/apartments/{id}`
- **Method**: DELETE
- **Path Parameters**:
  - `id`: ID của căn hộ cần xóa
- **Response**:
  - Status: 204 No Content nếu xóa thành công
  - Status: 404 Not Found nếu không tìm thấy căn hộ

## 4. Water Service API

### 4.1. Lấy tất cả dịch vụ nước

- **Endpoint**: `GET /api/water-service`
- **Method**: GET
- **Response**:
  - Status: 200 OK
  - Body: Mảng các đối tượng WaterService

### 4.2. Lấy dịch vụ nước theo ID

- **Endpoint**: `GET /api/water-service/{id}`
- **Method**: GET
- **Path Parameters**:
  - `id`: ID của dịch vụ nước cần lấy
- **Response**:
  - Status: 200 OK nếu tìm thấy
  - Status: 404 Not Found nếu không tìm thấy
  - Body: Đối tượng WaterService