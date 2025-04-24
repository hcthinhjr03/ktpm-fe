import { get, post, del, put } from "../utils/request";

const BASE_PATH = "api/water-service";

// Get all water services
export const getAllWaterServices = async () => {
  try {
    const response = await get(BASE_PATH);
    return response;
  } catch (error) {
    console.error("Error fetching water services:", error);
    throw error;
  }
};

// Get water service by ID
export const getWaterServiceById = async (id) => {
  try {
    const response = await get(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching water service with ID ${id}:`, error);
    throw error;
  }
};

// Create new water service
export const createWaterService = async (waterServiceData) => {
  try {
    const response = await post(BASE_PATH, waterServiceData);
    return response;
  } catch (error) {
    console.error("Error creating water service:", error);
    throw error;
  }
};

// Update water service
export const updateWaterService = async (id, waterServiceData) => {
  try {
    const response = await put(`${BASE_PATH}/${id}`, waterServiceData);
    return response;
  } catch (error) {
    console.error(`Error updating water service with ID ${id}:`, error);
    throw error;
  }
};

// Delete water service
export const deleteWaterService = async (id) => {
    try {
      // Call the delete API
      const response = await del(`${BASE_PATH}/${id}`);
      
      // Add a small delay to ensure the server has processed the deletion
      // This can help with synchronization issues
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return response;
    } catch (error) {
      console.error(`Error deleting water service with ID ${id}:`, error);
      throw error;
    }
  };
