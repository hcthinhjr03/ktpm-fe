import { get } from "../utils/request";

const BASE_PATH = "api/statistics/water-service";

// Get all water service statistics
export const getWaterServiceStatistics = async (fromDate, toDate, strategy = "total") => {
  let url = BASE_PATH;
  
  // Build query parameter string
  const params = [];
  
  if (fromDate && toDate) {
    params.push(`fromDate=${fromDate.format('YYYY-MM-DD')}`);
    params.push(`toDate=${toDate.format('YYYY-MM-DD')}`);
  }
  
  if (strategy) {
    params.push(`strategy=${strategy}`);
  }
  
  // Add query parameters to URL if any exist
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  try {
    const response = await get(url);
    return response;
  } catch (error) {
    console.error("Error fetching water service statistics:", error);
    throw error;
  }
};

// Get statistics for a specific water service with strategy
export const getWaterServiceStatisticById = async (id, fromDate, toDate, strategy = "total") => {
  let url = `${BASE_PATH}/${id}`;
  
  // Build query parameter string
  const params = [];
  
  if (fromDate && toDate) {
    params.push(`fromDate=${fromDate.format('YYYY-MM-DD')}`);
    params.push(`toDate=${toDate.format('YYYY-MM-DD')}`);
  }
  
  if (strategy) {
    params.push(`strategy=${strategy}`);
  }
  
  // Add query parameters to URL if any exist
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  try {
    const response = await get(url);
    return response;
  } catch (error) {
    console.error(`Error fetching statistics for water service ID ${id}:`, error);
    throw error;
  }
};

// Get detailed bills for a specific water service
export const getWaterServiceBills = async (serviceId, fromDate, toDate) => {
  let url = `${BASE_PATH}/${serviceId}/bills`;
  
  // Build query parameter string
  const params = [];
  
  if (fromDate && toDate) {
    params.push(`fromDate=${fromDate.format('YYYY-MM-DD')}`);
    params.push(`toDate=${toDate.format('YYYY-MM-DD')}`);
  }
  
  // Add query parameters to URL if any exist
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  try {
    const response = await get(url);
    return response;
  } catch (error) {
    console.error(`Error fetching bills for water service ID ${serviceId}:`, error);
    throw error;
  }
};