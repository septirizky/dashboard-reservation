import axios from "axios";
import API from "../api/Api";

export const getBranchQuota = async (branchCode, date) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/branch_quota`, {
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

export const getAllBranchQuotas = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/branch_quota_all`, {
      params: { branchCode },
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching all branch quotas:", error);
    return [];
  }
};

export const postBranchQuota = async (payload) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API}/branch_quota`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting branch quota:", error);
    throw error;
  }
};
