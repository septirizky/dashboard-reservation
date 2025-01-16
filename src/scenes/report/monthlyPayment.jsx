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
    const excelHeaders = [
      { header: "Branch Name", key: "branchName" },
      { header: "Branch Code", key: "branchCode" },
      { header: "Date", key: "date" },
      { header: "Bank Code", key: "bank_code" },
      { header: "Payment Channel", key: "payment_channel" },
      { header: "Payment Method", key: "payment_method" },
      { header: "Total Amount (DP)", key: "totalPaidAmount" },
      { header: "Summary Invoice", key: "invoiceCount" },
    ];

    const formattedData = summaryData.map((row) => {
      return excelHeaders.reduce((acc, header) => {
        acc[header.header] = row[header.key];
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentMonthlyReport");
    XLSX.writeFile(
      workbook,
      `PaymentMonthlyReport_${selectedYear}_${selectedMonth}.xlsx`
    );
  };

  const handlePrint = () => {
    const printContent = `
      <h2 style="text-align: center;">Payment Monthly Report</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 5px;">Branch Name</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Date</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Bank Code</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Payment Channel</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Payment Method</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          ${summaryData
            .map(
              (row) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.branchName}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.date}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.bank_code}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.payment_channel}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.payment_method}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">${row.totalPaidAmount}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(`
      <html>
        <head>
          <title>Reservation Monthly Report</title>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    iframeDocument.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    iframe.addEventListener("afterprint", () => {
      document.body.removeChild(iframe);
    });
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
        title="PAYMENT MONTHLY REPORT"
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
          <Select
            labelId="payment-channel-select-label"
            value={selectedPaymentChannel}
            onChange={handlePaymentChannelChange}
            displayEmpty
          >
            {paymentChannels.map((channel) => (
              <MenuItem key={channel.value} value={channel.value}>
                {channel.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <Select
            labelId="payment-method-select-label"
            value={selectedPaymentMethod}
            onChange={handlePaymentMethodChange}
            displayEmpty
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
          <Button variant="contained" color="info" onClick={handlePrint}>
            Print Report
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
