import axios from "axios";
import API from "../api/Api";

export const fetchInvoicePerDate = async (
  selectedBranchCode,
  selectedStartDate,
  selectedEndDate
) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/invoice_detail_per_date`, {
      params: {
        branchCode: selectedBranchCode,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching reservation detail per time:", error);
    return [];
  }
};

export const fetchInvoiceSummaryPerDate = async (
  selectedBranchCode,
  selectedMonth,
  selectedYear,
  selectedPaymentChannel,
  selectedPaymentMethod
) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/invoice_summary_per_date`, {
      params: {
        branchCode: selectedBranchCode,
        month: selectedMonth,
        year: selectedYear,
        paymentChannel: selectedPaymentChannel || "All",
        paymentMethod: selectedPaymentMethod || "All",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching invoice summary per date:", error);
    return [];
  }
};

export const fetchReservationSummaryPerDate = async (
  branchCode,
  month,
  year
) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${API}/reservation_summary_per_date?branchCode=${branchCode}&month=${month}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching reservation summary:", error);
    return [];
  }
};

export const fetchReservationDetailPerTime = async (
  selectedBranchCode,
  selectedStartDate,
  selectedEndDate,
  selectedTime
) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/reservation_detail_per_time`, {
      params: {
        branchCode: selectedBranchCode,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        time: selectedTime,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching reservation detail per time:", error);
    return [];
  }
};

export const fetchItemSummaryPerDate = async (
  selectedBranchCode,
  selectedStartDate,
  selectedEndDate
) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/item_summary_per_date`, {
      params: {
        branchCode: selectedBranchCode,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching item summary per date:", error);
    return [];
  }
};

export const fetchRefundDetailPerDate = async (
  selectedBranchCode,
  startDate,
  endDate
) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/refund_detail_per_date`, {
      params: {
        branchCode: selectedBranchCode,
        startDate,
        endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching refund detail per date:", error);
    return [];
  }
};

export const fetchReservationSummaryByBranchAndPhone = async (
  selectedBranchCode
) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${API}/reservation_summary_by_branch_and_phone`,
      {
        params: { branchCode: selectedBranchCode },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching reservation summary:", error);
    return [];
  }
};
