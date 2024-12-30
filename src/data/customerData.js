import axios from "axios";
import API from "../api/Api";

export const fetchCustomers = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/customer`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};
