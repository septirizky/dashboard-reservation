import axios from "axios";
import API from "../api/Api";

export const createOptionPackage = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API}/option_package`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating option package:", error);
    throw error;
  }
};

export const getOptionPackage = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/option_package/${branchCode}`, {
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

export const updateOptionPackage = async (optionPackageId, formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${API}/option_package/${optionPackageId}`,
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
    console.error("Error updating option:", error);
    throw error;
  }
};

export const updateMenuToggle = async (optionPackageId, data) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.patch(
      `${API}/option_package/update_toggle/${optionPackageId}`,
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

export const deleteOptionPackage = async (optionPackageId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(
      `${API}/option_package/${optionPackageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting option:", error);
    throw error;
  }
};

export const getOptionPackageGrist = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${API}/option_package_grist/${branchCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching option:", error);
    return [];
  }
};

export const postAllOptionPackage = async (data) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/option_package/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ optionPackages: data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
