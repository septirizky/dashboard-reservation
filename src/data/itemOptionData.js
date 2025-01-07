import axios from "axios";
import API from "../api/Api";

export const createItemOption = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API}/item_option`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating item option:", error);
    throw error;
  }
};

export const getItemOption = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/item_option/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching item option:", error);
    return [];
  }
};

export const updateItemOption = async (itemOptionId, formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${API}/item_option/${itemOptionId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating item option:", error);
    throw error;
  }
};

export const deleteItemOption = async (itemOptionId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${API}/item_option/${itemOptionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting item option:", error);
    throw error;
  }
};

export const getItemOptionGrist = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/item_option_grist/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching item option:", error);
    return [];
  }
};

export const postAllItemOption = async (data) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/item_option/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemOptions: data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateItemOptions = async (data) => {
  try {
    const response = await axios.put(`${API}/item_option/update`, {
      itemOptions: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating item options:", error);
    throw error;
  }
};
