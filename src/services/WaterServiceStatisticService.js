import { get } from "../utils/request";

const BASE_PATH = "api/statistics/water-service";

// Get all water service statistics
export const getWaterServiceStatistics = async (fromDate, toDate) => {
  let url = BASE_PATH;
  
  // Add query parameters if dates are specified
  if (fromDate && toDate) {
    url += `?fromDate=${fromDate.format('YYYY-MM-DD')}&toDate=${toDate.format('YYYY-MM-DD')}`;
  }
  
  try {
    const response = await get(url);
    return response;
  } catch (error) {
    console.error("Error fetching water service statistics:", error);
    throw error;
  }
};

// Get statistics for a specific water service
export const getWaterServiceStatisticById = async (id, fromDate, toDate) => {
  let url = `${BASE_PATH}/${id}`;
  
  // Add query parameters if dates are specified
  if (fromDate && toDate) {
    url += `?fromDate=${fromDate.format('YYYY-MM-DD')}&toDate=${toDate.format('YYYY-MM-DD')}`;
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
  
  // Add query parameters if dates are specified
  if (fromDate && toDate) {
    url += `?fromDate=${fromDate.format('YYYY-MM-DD')}&toDate=${toDate.format('YYYY-MM-DD')}`;
  }
  
  try {
    const response = await get(url);
    return response;
  } catch (error) {
    console.error(`Error fetching bills for water service ID ${serviceId}:`, error);
    throw error;
  }
};