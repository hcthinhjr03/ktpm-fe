import { get, post, del, put } from "../utils/request";

const BASE_PATH = "api/water-readings";

// Get all water readings
export const getAllWaterReadings = async () => {
  try {
    const response = await get(BASE_PATH);
    return response;
  } catch (error) {
    console.error("Error fetching water readings:", error);
    throw error;
  }
};

// Get water reading by ID
export const getWaterReadingById = async (id) => {
  try {
    const response = await get(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching water reading with ID ${id}:`, error);
    throw error;
  }
};

// Get water readings by apartment ID
export const getWaterReadingsByApartment = async (apartmentId) => {
  try {
    const response = await get(`${BASE_PATH}/apartment/${apartmentId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching water readings for apartment ID ${apartmentId}:`, error);
    throw error;
  }
};

// Get water readings by apartment ID and date range
export const getWaterReadingsByApartmentAndDateRange = async (apartmentId, startDate, endDate) => {
  try {
    const formattedStartDate = startDate.format('YYYY-MM-DD');
    const formattedEndDate = endDate.format('YYYY-MM-DD');
    const response = await get(
      `${BASE_PATH}/apartment/${apartmentId}/date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching water readings for apartment ID ${apartmentId} in date range:`, error);
    throw error;
  }
};

// Create new water reading
export const createWaterReading = async (waterReadingData) => {
  try {
    const response = await post(BASE_PATH, waterReadingData);
    return response;
  } catch (error) {
    console.error("Error creating water reading:", error);
    throw error;
  }
};

// Update water reading
export const updateWaterReading = async (id, waterReadingData) => {
  try {
    const response = await put(`${BASE_PATH}/${id}`, waterReadingData);
    return response;
  } catch (error) {
    console.error(`Error updating water reading with ID ${id}:`, error);
    throw error;
  }
};

// Delete water reading
export const deleteWaterReading = async (id) => {
  try {
    const response = await del(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting water reading with ID ${id}:`, error);
    throw error;
  }
};