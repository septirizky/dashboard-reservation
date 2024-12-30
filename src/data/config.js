import axios from "axios";
import API from "../api/Api";

// Fetch all configurations
export const fetchConfigs = async () => {
  try {
    const response = await axios.get(`${API}/config`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching configs:", error);
    throw error;
  }
};

// Add a new configuration
export const addConfig = async (newConfig) => {
  try {
    const response = await axios.post(`${API}/config`, newConfig, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding config:", error);
    throw error;
  }
};

// Toggle show status of a configuration
export const toggleConfigShow = async (configId, show) => {
  try {
    const response = await axios.put(
      `${API}/config_show/${configId}`,
      { show },
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating show status:", error);
    throw error;
  }
};

export const updateConfig = async (configId, updatedConfig) => {
  try {
    const response = await axios.put(
      `${API}/config/${configId}`,
      updatedConfig,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating config:", error);
    throw error;
  }
};

// Delete a configuration
export const deleteConfig = async (configId) => {
  try {
    const response = await axios.delete(`${API}/config/${configId}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting config:", error);
    throw error;
  }
};
