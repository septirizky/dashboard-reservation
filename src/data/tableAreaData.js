import axios from "axios";
import API from "../api/Api";

export const fetchTableAreasByBranchCode = async (branchCode) => {
  try {
    const response = await axios.get(`${API}/table_area/${branchCode}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching table areas:", error);
    throw error;
  }
};
