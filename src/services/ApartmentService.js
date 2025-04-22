import { get, post, del, put } from "../utils/request";

const BASE_PATH = "api/apartments";

// Get all apartments
export const getAllApartments = async () => {
  try {
    const response = await get(BASE_PATH);
    return response;
  } catch (error) {
    console.error("Error fetching apartments:", error);
    throw error;
  }
};

// Get apartment by ID
export const getApartmentById = async (id) => {
  try {
    const response = await get(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching apartment with ID ${id}:`, error);
    throw error;
  }
};

// Get apartments by customer ID
export const getApartmentsByCustomerId = async (customerId) => {
  try {
    const response = await get(`${BASE_PATH}/customer/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching apartments for customer ID ${customerId}:`, error);
    throw error;
  }
};

// Create new apartment
export const createApartment = async (apartmentData) => {
  try {
    const response = await post(BASE_PATH, apartmentData);
    return response;
  } catch (error) {
    console.error("Error creating apartment:", error);
    throw error;
  }
};

// Update apartment
export const updateApartment = async (id, apartmentData) => {
  try {
    const response = await put(`${BASE_PATH}/${id}`, apartmentData);
    return response;
  } catch (error) {
    console.error(`Error updating apartment with ID ${id}:`, error);
    throw error;
  }
};

// Delete apartment
export const deleteApartment = async (id) => {
  try {
    const response = await del(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting apartment with ID ${id}:`, error);
    throw error;
  }
};