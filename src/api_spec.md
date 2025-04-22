API Specification for WaterServiceStatisticsController
Overview
The WaterServiceStatisticsController provides endpoints to retrieve statistical information about water services, including revenue, contract counts, and related bills. It supports date filtering to analyze data within specific time periods.
Base URL
/api/statistics/water-service
Endpoints
1. Get All Water Service Statistics
Retrieves statistical information for all water services with optional date filtering.

URL: /
Method: GET
Query Parameters:

fromDate (optional): Start date for statistics calculation (format: yyyy-MM-dd)
toDate (optional): End date for statistics calculation (format: yyyy-MM-dd)


Response: List of WaterServiceStatistics objects
Status Codes:

200 OK: Successfully retrieved statistics


Response Example:

json[
  {
    "serviceId": 1,
    "serviceName": "Regular Water Supply",
    "description": "Standard water supply service",
    "unit": "m3",
    "priceRates": [...],
    "revenue": 2500.50,
    "fromDate": "2023-01-01",
    "toDate": "2023-03-31",
    "totalContracts": 15
  },
  {
    "serviceId": 2,
    "serviceName": "Premium Water Supply",
    "description": "High-quality filtered water",
    "unit": "m3",
    "priceRates": [...],
    "revenue": 4200.75,
    "fromDate": "2023-01-01",
    "toDate": "2023-03-31",
    "totalContracts": 8
  }
]
2. Get Statistics for a Specific Water Service
Retrieves statistical information for a single water service with optional date filtering.

URL: /{id}
Method: GET
Path Parameters:

id: Unique identifier of the water service


Query Parameters:

fromDate (optional): Start date for statistics calculation (format: yyyy-MM-dd)
toDate (optional): End date for statistics calculation (format: yyyy-MM-dd)


Response: A WaterServiceStatistics object
Status Codes:

200 OK: Successfully retrieved statistics
404 Not Found: Water service with the specified ID was not found


Response Example:

json{
  "serviceId": 1,
  "serviceName": "Regular Water Supply",
  "description": "Standard water supply service",
  "unit": "m3",
  "priceRates": [...],
  "revenue": 2500.50,
  "fromDate": "2023-01-01",
  "toDate": "2023-03-31",
  "totalContracts": 15
}
3. Get Detailed Bills for a Specific Water Service
Retrieves all bills associated with a specific water service within an optional date range.

URL: /{id}/bills
Method: GET
Path Parameters:

id: Unique identifier of the water service


Query Parameters:

fromDate (optional): Start date for filtering bills (format: yyyy-MM-dd)
toDate (optional): End date for filtering bills (format: yyyy-MM-dd)


Response: List of Bill objects
Status Codes:

200 OK: Successfully retrieved bills


Response Example:

json[
  {
    "billId": 1,
    "billDate": "2023-01-15",
    "amount": 150.25
  },
  {
    "billId": 2,
    "billDate": "2023-02-15",
    "amount": 165.75
  },
  {
    "billId": 3,
    "billDate": "2023-03-15",
    "amount": 142.30
  }
]