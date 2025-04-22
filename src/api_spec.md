Water Service API Specification
Base URL
http://localhost:8081/api/water-service
Endpoints
1. Get All Water Services
Retrieves a list of all water services.

URL: /
Method: GET
Auth required: No
Permissions required: None

Success Response

Code: 200 OK
Content example:

json[
  {
    "serviceId": 1,
    "serviceName": "Cấp nước sinh hoạt",
    "description": "Dịch vụ cung cấp nước sạch cho căn hộ",
    "unit": "m³",
    "priceRates": [
      {
        "rateId": 1,
        "fromAmount": 0,
        "toAmount": 10,
        "unitPrice": 5700,
        "effectiveDate": "2025-01-01",
        "expiryDate": "2025-12-31"
      }
    ]
  },
  {
    "serviceId": 2,
    "serviceName": "Nước sinh hoạt cao cấp",
    "description": "Dịch vụ cung cấp nước sạch cao cấp",
    "unit": "m³",
    "priceRates": []
  }
]

2. Get Water Service By ID
Retrieves a specific water service by its ID.

URL: /{id}
Method: GET
URL Parameters:

id: Integer - ID of the water service to retrieve


Auth required: No
Permissions required: None

Success Response

Code: 200 OK
Content example:

json{
  "serviceId": 1,
  "serviceName": "Cấp nước sinh hoạt",
  "description": "Dịch vụ cung cấp nước sạch cho căn hộ",
  "unit": "m³",
  "priceRates": [
    {
      "rateId": 1,
      "fromAmount": 0,
      "toAmount": 10,
      "unitPrice": 5700,
      "effectiveDate": "2025-01-01",
      "expiryDate": "2025-12-31"
    }
  ]
}
Error Response

Code: 404 NOT FOUND
Content: Empty


3. Create Water Service
Creates a new water service.

URL: /
Method: POST
Auth required: No
Permissions required: None
Content-Type: application/json

Request Body
json{
  "serviceName": "Cấp nước sinh hoạt",
  "description": "Dịch vụ cung cấp nước sạch cho căn hộ",
  "unit": "m³",
  "priceRates": [
    {
      "fromAmount": 0,
      "toAmount": 10,
      "unitPrice": 5700,
      "effectiveDate": "2025-01-01",
      "expiryDate": "2025-12-31"
    }
  ]
}
Success Response

Code: 201 CREATED
Content example:

json{
  "serviceId": 1,
  "serviceName": "Cấp nước sinh hoạt",
  "description": "Dịch vụ cung cấp nước sạch cho căn hộ",
  "unit": "m³",
  "priceRates": [
    {
      "rateId": 1,
      "fromAmount": 0,
      "toAmount": 10,
      "unitPrice": 5700,
      "effectiveDate": "2025-01-01",
      "expiryDate": "2025-12-31"
    }
  ]
}

4. Update Water Service
Updates an existing water service.

URL: /{id}
Method: PUT
URL Parameters:

id: Integer - ID of the water service to update


Auth required: No
Permissions required: None
Content-Type: application/json

Request Body
json{
  "serviceName": "Cấp nước sinh hoạt cao cấp",
  "description": "Dịch vụ cung cấp nước sạch cao cấp cho căn hộ",
  "unit": "m³",
  "priceRates": [
    {
      "fromAmount": 0,
      "toAmount": 10,
      "unitPrice": 6000,
      "effectiveDate": "2025-01-01",
      "expiryDate": "2025-12-31"
    }
  ]
}
Success Response

Code: 200 OK
Content example:

json{
  "serviceId": 1,
  "serviceName": "Cấp nước sinh hoạt cao cấp",
  "description": "Dịch vụ cung cấp nước sạch cao cấp cho căn hộ",
  "unit": "m³",
  "priceRates": [
    {
      "rateId": 1,
      "fromAmount": 0,
      "toAmount": 10,
      "unitPrice": 6000,
      "effectiveDate": "2025-01-01",
      "expiryDate": "2025-12-31"
    }
  ]
}
Error Response

Code: 404 NOT FOUND
Content: Empty


5. Delete Water Service
Deletes a water service by its ID.

URL: /{id}
Method: DELETE
URL Parameters:

id: Integer - ID of the water service to delete


Auth required: No
Permissions required: None

Success Response
    Code: 204 NO CONTENT
    Content: Empty

Error Response
    Code: 404 NOT FOUND
    Content: Empty