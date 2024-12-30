import axios from "axios";
import API from "../api/Api";

export const fetchInvoicesByBranchCodes = async (branchCodes) => {
  const invoices = [];

  for (const branchCode of branchCodes) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API}/invoice/${branchCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.data && response.data.data) {
        invoices.push(...response.data.data);
      }
    } catch (error) {
      console.error(
        `Error fetching invoices for branchCode ${branchCode}:`,
        error
      );
    }
  }

  return invoices;
};

export const updateRefundStatus = async (externalId, refundStatus) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.patch(
      `${API}/invoices/${externalId}`,
      {
        refund_status: refundStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data; // Mengembalikan respons backend
  } catch (error) {
    console.error("Error updating refund status:", error);
    throw error;
  }
};
