import { get, post, del, put } from "../utils/request";

const BASE_PATH = "api/customers";

// Get all customers
export const getAllCustomers = async () => {
  try {
    const response = await get(BASE_PATH);
    return response;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// Get customer by ID
export const getCustomerById = async (id) => {
  try {
    const response = await get(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error);
    throw error;
  }
};

// Search customers by identity card
export const searchCustomerByIdentityCard = async (identityCard) => {
  try {
    const response = await get(`${BASE_PATH}/search/identity-card?identityCard=${identityCard}`);
    return response;
  } catch (error) {
    console.error("Error searching customer by identity card:", error);
    throw error;
  }
};

// Search customers by phone number
export const searchCustomerByPhone = async (phoneNumber) => {
  try {
    const response = await get(`${BASE_PATH}/search/phone?phoneNumber=${phoneNumber}`);
    return response;
  } catch (error) {
    console.error("Error searching customer by phone:", error);
    throw error;
  }
};

// Search customers by email
export const searchCustomerByEmail = async (email) => {
  try {
    const response = await get(`${BASE_PATH}/search/email?email=${email}`);
    return response;
  } catch (error) {
    console.error("Error searching customer by email:", error);
    throw error;
  }
};

// Search customers by name
export const searchCustomerByName = async (fullName) => {
  try {
    const response = await get(`${BASE_PATH}/search/name?fullName=${fullName}`);
    return response;
  } catch (error) {
    console.error("Error searching customer by name:", error);
    throw error;
  }
};

// Create new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await post(BASE_PATH, customerData);
    return response;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Update customer
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await put(`${BASE_PATH}/${id}`, customerData);
    return response;
  } catch (error) {
    console.error(`Error updating customer with ID ${id}:`, error);
    throw error;
  }
};

// Delete customer
export const deleteCustomer = async (id) => {
  try {
    const response = await del(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting customer with ID ${id}:`, error);
    throw error;
  }
};