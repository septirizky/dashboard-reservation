import axios from "axios";
import API from "../api/Api";

export const createOption = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API}/option`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating option:", error);
    throw error;
  }
};

export const getOption = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/option/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching option:", error);
    return [];
  }
};

export const updateOption = async (optionId, formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API}/option/${optionId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating option:", error);
    throw error;
  }
};

export const deleteOption = async (optionId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${API}/option/${optionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting option:", error);
    throw error;
  }
};

export const getOptionGrist = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/option_grist/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching option:", error);
    return [];
  }
};

export const postAllOption = async (data) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/option/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ options: data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
