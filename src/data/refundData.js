import axios from "axios";
import API from "../api/Api";

export const getRefundByBranchCode = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/refunds/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching refund for branchCode ${branchCode}:`, error);
    throw error;
  }
};

export const createRefundRequest = async (refundData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API}/refund`, refundData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating refund request:", error);
    throw error;
  }
};

export const updateRefundStatus = async (reservationCode, refundStatus) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.patch(
      `${API}/refund/${reservationCode}`,
      { status: refundStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating refund status:", error);
    throw error;
  }
};
