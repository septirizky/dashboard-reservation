import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { fetchInvoicePerDate } from "../../data/reportData";
import * as XLSX from "xlsx";

const PaymentDailyReport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [invoiceData, setInvoiceData] = useState([]);
  const [branchCodes, setBranchCodes] = useState([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-01-01`;
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

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
    const fetchInvoiceData = async () => {
      if (!selectedBranchCode || !startDate || !endDate) return;

      try {
        const details = await fetchInvoicePerDate(
          selectedBranchCode,
          startDate,
          endDate
        );

        setInvoiceData(details);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchInvoiceData();
  }, [selectedBranchCode, startDate, endDate]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(invoiceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentReport");
    XLSX.writeFile(workbook, `PaymentReport_${startDate}_to_${endDate}.xlsx`);
  };

  const viewInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write("<h1>Payment Report</h1>");
    newWindow.document.write("<table border='1'>");
    newWindow.document.write(
      "<tr><th>Branch Name</th><th>Branch Code</th><th>Date</th><th>Reservation Code</th><th>EXTERNAL ID</th><th>Bank Code</th><th>Payment Channel</th><th>Payment Method</th><th>Paid Amount</th></tr>"
    );
    invoiceData.forEach((row) => {
      newWindow.document.write(
        `<tr><td>${row.branchName}</td><td>${row.branchCode}</td><td>${
          row.date
        }</td><td>${row.reservationCode}</td><td>${row.external_id}</td><td>${
          row.bank_code
        }</td><td>${row.payment_channel}</td><td>${
          row.payment_method
        }</td><td>${formatRupiah(row.paid_amount)}</td></tr>`
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
      field: "reservationCode",
      headerName: "Reservation Code",
      flex: 0.4,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "external_id",
      headerName: "External ID",
      flex: 0.5,
      headerAlign: "center",
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
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "payment_method",
      headerName: "Payment Method",
      flex: 0.4,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paid_amount",
      headerName: "Paid Amount",
      flex: 0.4,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => formatRupiah(params.value),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="INVOICE DETAIL REPORT"
        subtitle="Detailed Invoice Data by Date"
      />
      <Box display="flex" alignItems="center" mb="20px" gap="20px">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="branch-select-label">Select Branch</InputLabel>
          <Select
            labelId="branch-select-label"
            value={selectedBranchCode}
            onChange={(e) => setSelectedBranchCode(e.target.value)}
          >
            {branchCodes.map((branch) => (
              <MenuItem key={branch.branchCode} value={branch.branchCode}>
                {branch.branchName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
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
          rows={invoiceData || []}
          columns={columns}
          getRowId={(row) => `${row.reservationCode}-${row.date}`}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default PaymentDailyReport;
