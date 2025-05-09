import { get, post, del, put } from "../utils/request";

const BASE_PATH = "api/contracts";

// Get all contracts
export const getAllContracts = async () => {
  try {
    const response = await get(BASE_PATH);
    return response;
  } catch (error) {
    console.error("Error fetching contracts:", error);
    throw error;
  }
};

// Get contract by ID
export const getContractById = async (id) => {
  try {
    const response = await get(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching contract with ID ${id}:`, error);
    throw error;
  }
};

// Create new contract
export const createContract = async (contractData) => {
  try {
    // Chuyển đổi dữ liệu để phù hợp với định dạng mà backend mong đợi
    const formattedData = {
      contract: {
        signDate: contractData.signDate,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        status: contractData.status,
        apartment: contractData.apartment,
        waterService: contractData.waterService,
        customer: contractData.customer
      },
      // Gửi initialReading như một giá trị đơn giản
      initialReading: contractData.initialReading
    };
    
    console.log("Sending contract data:", JSON.stringify(formattedData));
    
    const response = await post(BASE_PATH, formattedData);
    return response;
  } catch (error) {
    console.error("Error creating contract:", error);
    throw error;
  }
};

// Update contract
export const updateContract = async (id, contractData) => {
  try {
    const response = await put(`${BASE_PATH}/${id}`, contractData);
    return response;
  } catch (error) {
    console.error(`Error updating contract with ID ${id}:`, error);
    throw error;
  }
};

// Delete contract
export const deleteContract = async (id) => {
  try {
    const response = await del(`${BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting contract with ID ${id}:`, error);
    throw error;
  }
};