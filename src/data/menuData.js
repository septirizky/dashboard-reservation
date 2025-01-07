import axios from "axios";
import API from "../api/Api";

export const createMenu = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API}/menu`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating menu:", error);
    throw error;
  }
};

export const getMenu = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/menu/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
};

export const updateMenuToggle = async (menuId, data) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.patch(
      `${API}/menu/update_toggle/${menuId}`,
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

export const updateMenu = async (menuId, formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API}/menu/${menuId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating menu:", error);
    throw error;
  }
};

export const deleteMenu = async (menuId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${API}/menu/${menuId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
};

export const getMenuGrist = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/item_menu/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
};

export const postAllMenu = async (data) => {
  try {
    const response = await fetch(`${API}/menu/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ menus: data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
