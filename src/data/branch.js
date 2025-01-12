import axios from "axios";
import API from "../api/Api";

export const getBranch = async (branchCode, date) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/branch`, {
      params: { branchCode, date },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching branch quota:", error);
    return [];
  }
};

export const updateBranchShow = async (branchId, data) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.patch(`${API}/branch_show/${branchId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating branchShow:", error);
    throw error;
  }
};

export const updateBranchData = async (branchId, formData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API}/branch/${branchId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating branch data:", error);
    throw error;
  }
};
