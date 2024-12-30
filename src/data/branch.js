import axios from "axios";
import API from "../api/Api";

export const getBranch = async (branchCode, date) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/branch`, {
      params: { branchCode, date },
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching branch quota:", error);
    return [];
  }
};

export const updateBranchShow = async (branchId, branchShow) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${API}/branch_show/${branchId}`,
      { branchShow },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating branchShow:", error);
    throw error;
  }
};

export const updateBranchData = async (branchId, updatedData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API}/branch/${branchId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating branch data:", error);
    throw error;
  }
};
