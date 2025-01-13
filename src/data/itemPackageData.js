import axios from "axios";
import API from "../api/Api";

export const createItemPackage = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API}/item_package`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating item package:", error);
    throw error;
  }
};

export const getItemPackage = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/item_package/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching item package:", error);
    return [];
  }
};

export const updateItemPackage = async (itemPackageId, formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${API}/item_package/${itemPackageId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating item package:", error);
    throw error;
  }
};

export const deleteItemPackage = async (itemPackageId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(
      `${API}/item_package/${itemPackageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting item package:", error);
    throw error;
  }
};

export const getItemPackageGrist = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${API}/item_package_grist/${branchCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching item Package:", error);
    return [];
  }
};

export const postAllItemPackage = async (data) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/item_package/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemPackages: data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
