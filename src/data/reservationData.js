import axios from "axios";
import API from "../api/Api";

export const fetchReservationsByBranchCodes = async (branchCodes) => {
  const reservations = [];

  for (const branchCode of branchCodes) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API}/reservation_dashboard/${branchCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (response.data && response.data.data) {
        reservations.push(...response.data.data);
      }
    } catch (error) {
      console.error(
        `Error fetching reservations for branchCode ${branchCode}:`,
        error
      );
    }
  }
  return reservations;
};

export const updateReservation = async (reservationId, updatedData) => {
  try {
    const response = await axios.put(
      `${API}/reservation/${reservationId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    console.log(
      `Reservation ${reservationId} updated successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating reservation ${reservationId}:`, error);
    throw error;
  }
};

export const fetchReservationCountByCustomerId = async (customerId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/reservation_count/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (response.data && response.data.reservationCount !== undefined) {
      return response.data.reservationCount;
    }
    return 0;
  } catch (error) {
    console.error(
      `Error fetching reservation count for customerId ${customerId}:`,
      error
    );
    return 0;
  }
};

export const fetchReservationSummary = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/reservation_summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (response.data && response.data.data) {
      return response.data.data; // Mengembalikan data summary dari backend
    }
    return [];
  } catch (error) {
    console.error("Error fetching reservation summary:", error);
    return [];
  }
};
