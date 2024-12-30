import axios from "axios";
import API from "../api/Api";
import { toast } from "react-toastify";

export const fetchTeams = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const createUser = async (userData) => {
  try {
    const token = localStorage.getItem("authToken");
    const formattedValues = {
      ...userData,
      branchCode: Object.keys(userData.branchCode).filter(
        (key) => userData.branchCode[key]
      ),
    };

    const response = await axios.post(`${API}/user`, formattedValues, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Gagal membuat user, coba lagi.";
    toast.error(errorMessage);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API}/user/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.patch(
      `${API}/user_status/${userId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};
