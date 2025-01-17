import axios from "axios";
import API from "../api/Api";

export const createCategory = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API}/category`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const getCategory = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/category/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return [];
  }
};

export const updateCategoryToggle = async (categoryId, data) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.patch(
      `${API}/category/update_toggle/${categoryId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating toggle:", error);
    throw error;
  }
};

export const updateCategory = async (categoryId, formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${API}/category/${categoryId}`,
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
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${API}/category/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const getCategoryGrist = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${API}/category_item_menu/${branchCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return [];
  }
};

export const postAllCategories = async (data) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/category/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
