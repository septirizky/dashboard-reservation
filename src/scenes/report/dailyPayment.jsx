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
    const excelHeaders = [
      { header: "Branch Name", key: "branchName" },
      { header: "Branch Code", key: "branchCode" },
      { header: "Date", key: "date" },
      { header: "External ID", key: "external_id" },
      { header: "Reservation Code", key: "reservationCode" },
      { header: "Bank Code", key: "bank_code" },
      { header: "Payment Channel", key: "payment_channel" },
      { header: "Payment Method", key: "payment_method" },
      { header: "Paid Amount (DP)", key: "paid_amount" },
    ];

    const formattedData = invoiceData.map((row) => {
      return excelHeaders.reduce((acc, header) => {
        acc[header.header] = row[header.key];
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentDailyReport");
    XLSX.writeFile(
      workbook,
      `PaymentDailyReport_${startDate}_to_${endDate}.xlsx`
    );
  };

  const handlePrint = () => {
    const printContent = `
      <h2 style="text-align: center;">Payment Daily Report</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 5px;">Branch Name</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Date</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Reservation Code</th>
            <th style="border: 1px solid #ddd; padding: 5px;">External ID</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Bank Code</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Payment Channel</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Payment Method</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData
            .map(
              (row) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.branchName}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.date}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.reservationCode}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.external_id}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.bank_code}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.payment_channel}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.payment_method}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">${row.paid_amount}</td>
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
