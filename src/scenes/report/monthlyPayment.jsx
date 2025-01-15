import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { fetchInvoiceSummaryPerDate } from "../../data/reportData";
import * as XLSX from "xlsx";

const PaymentMonthlyReport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [summaryData, setSummaryData] = useState([]);
  const [branchCodes, setBranchCodes] = useState([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const years = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
  ];

  const paymentChannels = [
    { value: "", label: "All Channels" },
    { value: "MANDIRI", label: "MANDIRI" },
    { value: "BCA", label: "BCA" },
    { value: "BRI", label: "BRI" },
    { value: "CIMB", label: "CIMB" },
    { value: "SAHABAT_SAMPOERNA", label: "Sahabat Sampoerna" },
  ];

  const paymentMethods = [
    { value: "", label: "All Methods" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "QRIS", label: "QRIS" },
    { value: "RETAIL_OUTLET", label: "Retail Outlet" },
  ];

  const formatRupiah = (number) => {
    if (!number || isNaN(number)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(number)
      .replace("Rp", "Rp ");
  };

  useEffect(() => {
    const userDataRaw = localStorage.getItem("userData");

    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;

    if (
      userData &&
      Array.isArray(userData.branchCode) &&
      Array.isArray(userData.branchName)
    ) {
      const branches = userData.branchCode.map((code, index) => ({
        branchCode: code,
        branchName: userData.branchName[index] || code,
      }));

      setBranchCodes(branches);
      setSelectedBranchCode(branches[0]?.branchCode || "");
    } else {
      console.error(
        "Invalid userData or branchCode/branchName in localStorage"
      );
      setBranchCodes([]);
    }
  }, []);

  useEffect(() => {
    const fetchSummaryData = async () => {
      if (!selectedBranchCode || !selectedMonth || !selectedYear) return;

      try {
        const summaryData = await fetchInvoiceSummaryPerDate(
          selectedBranchCode,
          selectedMonth,
          selectedYear,
          selectedPaymentChannel,
          selectedPaymentMethod
        );
        setSummaryData(summaryData);
      } catch (error) {
        console.error("Error fetching invoice summary per date:", error);
      }
    };

    fetchSummaryData();
  }, [
    selectedBranchCode,
    selectedMonth,
    selectedYear,
    selectedPaymentChannel,
    selectedPaymentMethod,
  ]);

  const handleBranchChange = (event) => {
    setSelectedBranchCode(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handlePaymentChannelChange = (event) => {
    setSelectedPaymentChannel(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(summaryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "InvoiceSummary");
    XLSX.writeFile(
      workbook,
      `InvoiceSummary_${selectedYear}_${selectedMonth}.xlsx`
    );
  };

  const viewInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write("<h1>Payment Report</h1>");
    newWindow.document.write("<table border='1'>");
    newWindow.document.write(
      "<tr><th>Branch Name</th><th>Branch Code</th><th>Date</th><th>Bank Code</th><th>Payment Channel</th><th>Payment Method</th><th>Paid Amount</th></tr>"
    );
    summaryData.forEach((item) => {
      newWindow.document.write(
        `<tr><td>${item.branchName}</td><td>${item.branchCode}</td><td>${
          item.date
        }</td><td>${item.bank_code}</td><td>${item.payment_channel}</td><td>${
          item.payment_method
        }</td><td>${formatRupiah(item.totalPaidAmount)}</td></tr>`
      );
    });
    newWindow.document.write("</table>");
    newWindow.document.close();
  };

  const columns = [
    {
      field: "branchName",
      headerName: "Branch Name",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "bank_code",
      headerName: "Bank Code",
      flex: 0.3,
      headerAlign: "center",
    },
    {
      field: "payment_channel",
      headerName: "Payment Channel",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "payment_method",
      headerName: "Payment Method",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalPaidAmount",
      headerName: "Total Paid Amount",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => formatRupiah(params.value),
    },
    {
      field: "invoiceCount",
      headerName: "Invoice Count",
      flex: 0.3,
      headerAlign: "center",
      align: "right",
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="INVOICE SUMMARY PER DATE"
        subtitle="Summary of Invoices by Date, Payment Method, and Payment Channel"
      />
      <Box display="flex" alignItems="center" mb="20px" gap="20px">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="branch-select-label">Select Branch</InputLabel>
          <Select
            labelId="branch-select-label"
            value={selectedBranchCode}
            onChange={handleBranchChange}
          >
            {branchCodes.map((branch) => (
              <MenuItem key={branch.branchCode} value={branch.branchCode}>
                {branch.branchName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="month-select-label">Select Month</InputLabel>
          <Select
            labelId="month-select-label"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            {Array.from({ length: 12 }, (_, i) => ({
              value: `${i + 1}`.padStart(2, "0"),
              label: new Date(2000, i).toLocaleString("default", {
                month: "long",
              }),
            })).map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="year-select-label">Select Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <MenuItem key={year.value} value={year.value}>
                {year.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="payment-channel-select-label">
            Payment Channel
          </InputLabel>
          <Select
            labelId="payment-channel-select-label"
            value={selectedPaymentChannel}
            onChange={handlePaymentChannelChange}
          >
            {paymentChannels.map((channel) => (
              <MenuItem key={channel.value} value={channel.value}>
                {channel.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="payment-method-select-label">
            Payment Method
          </InputLabel>
          <Select
            labelId="payment-method-select-label"
            value={selectedPaymentMethod}
            onChange={handlePaymentMethodChange}
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box ml="auto">
          <Button
            variant="contained"
            color="secondary"
            onClick={exportToExcel}
            sx={{ marginRight: "10px" }}
          >
            Export to Excel
          </Button>
          <Button variant="contained" color="info" onClick={viewInNewTab}>
            View in New Tab
          </Button>
        </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="68vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            fontSize: "0.9rem",
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid
          rows={summaryData || []}
          columns={columns}
          getRowId={(row) =>
            `${row.date}-${row.payment_method}-${row.bank_code}`
          }
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default PaymentMonthlyReport;
