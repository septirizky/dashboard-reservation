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
import { fetchRefundDetailPerDate } from "../../data/reportData";
import * as XLSX from "xlsx";

const ListCancel = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [refundData, setRefundData] = useState([]);
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
    const fetchDetails = async () => {
      if (!selectedBranchCode || !startDate || !endDate) return;

      try {
        const refunds = await fetchRefundDetailPerDate(
          selectedBranchCode,
          startDate,
          endDate
        );
        setRefundData(refunds);
      } catch (error) {
        console.error("Error fetching refund detail per date:", error);
      }
    };

    fetchDetails();
  }, [selectedBranchCode, startDate, endDate]);

  const handleBranchChange = (event) => {
    setSelectedBranchCode(event.target.value);
  };

  const exportToExcel = () => {
    const excelHeaders = [
      { header: "Branch Name", key: "branchName" },
      { header: "Branch Code", key: "branchCode" },
      { header: "Date", key: "date" },
      { header: "Reason", key: "reason" },
      { header: "Amount", key: "amount" },
      { header: "Status", key: "status" },
    ];

    const formattedData = refundData.map((row) => {
      return excelHeaders.reduce((acc, header) => {
        acc[header.header] = row[header.key];
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "CancellationListReport");
    XLSX.writeFile(
      workbook,
      `CancellationListReport_${startDate}_to_${endDate}.xlsx`
    );
  };

  const handlePrint = () => {
    const printContent = `
      <h2 style="text-align: center;">Cancellation List Report</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 5px;">Branch Name</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Date</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Reason</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Amount</th>
            <th style="border: 1px solid #ddd; padding: 5px;">status</th>
          </tr>
        </thead>
        <tbody>
          ${refundData
            .map(
              (row) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.branchName}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.date}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.reason}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">${row.amount}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.status}</td>
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
          <title>Cancellation List Report</title>
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
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => formatRupiah(params.value),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="CANCELLATION LIST REPORT"
        subtitle="Detail of Cancels by Date"
      />
      <Box display="flex" gap="20px" mb="20px">
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
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
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
        }}
      >
        <DataGrid
          rows={refundData || []}
          columns={columns}
          getRowId={(row) => `${row.date}-${row.reason}`}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default ListCancel;
