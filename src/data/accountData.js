import axios from "axios";
import API from "../api/Api";

export const getAccounts = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
};

export const createAccount = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API}/accounts`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

export const updateAccount = async (accountId, updatedData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${API}/accounts/${accountId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

export const deleteAccount = async (accountId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${API}/accounts/${accountId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
