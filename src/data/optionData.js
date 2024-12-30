import axios from "axios";
import API from "../api/Api";

export const getOption = async (branchCode) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/option/${branchCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching option:", error);
    return [];
  }
};

export const postAllOption = async (data) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/option/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ options: data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
