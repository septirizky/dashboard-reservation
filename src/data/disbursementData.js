import axios from "axios";
import API from "../api/Api";

export const fetchDisbursements = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/disbursements`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching disbursements:", error);
    throw error;
  }
};

export const createDisbursement = async (disbursementData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
      `${API}/create_disbursement`,
      disbursementData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating disbursement:", error);
    throw error;
  }
};
