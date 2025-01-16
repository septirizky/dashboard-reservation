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
import { fetchReservationDetailPerTime } from "../../data/reportData";
import * as XLSX from "xlsx";

const ReservationDailyReport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [detailsData, setDetailsData] = useState([]);
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
  const [selectedTime, setSelectedTime] = useState("");

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

  const timeOptions = [
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

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
        const details = await fetchReservationDetailPerTime(
          selectedBranchCode,
          startDate,
          endDate,
          selectedTime
        );
        setDetailsData(details);
      } catch (error) {
        console.error("Error fetching reservation detail per time:", error);
      }
    };

    fetchDetails();
  }, [selectedBranchCode, startDate, endDate, selectedTime]);

  const handleBranchChange = (event) => {
    setSelectedBranchCode(event.target.value);
  };

  const exportToExcel = () => {
    const excelHeaders = [
      { header: "Branch Name", key: "branchName" },
      { header: "Branch Code", key: "branchCode" },
      { header: "Date", key: "date" },
      { header: "Reservation Code", key: "reservationCode" },
      { header: "Name", key: "name" },
      { header: "Pax", key: "pax" },
      { header: "Phone", key: "phone" },
      { header: "Time", key: "time" },
      { header: "Total DP", key: "totalDP" },
      { header: "Total Amount", key: "totalAmount" },
    ];

    const formattedData = detailsData.map((row) => {
      return excelHeaders.reduce((acc, header) => {
        acc[header.header] = row[header.key];
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "ReservationDailyReport");
    XLSX.writeFile(
      workbook,
      `ReservationDailyReport_${startDate}_to_${endDate}.xlsx`
    );
  };

  const handlePrint = () => {
    const printContent = `
      <h2 style="text-align: center;">Reservation Daily Report</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 5px;">Branch Name</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Date</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Time</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Reservstion Code</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Name</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Phone</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Pax</th>
            <th style="border: 1px solid #ddd; padding: 5px;">DP</th>
            <th style="border: 1px solid #ddd; padding: 5px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${detailsData
            .map(
              (row) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.branchName}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.date}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.time}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.reservationCode}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.name}</td>
              <td style="border: 1px solid #ddd; padding: 5px;">${row.phone}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">${row.pax}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">${row.totalDP}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">${row.totalAmount}</td>
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
      field: "time",
      headerName: "Time",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reservationCode",
      headerName: "Reservation Code",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Customer Name",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pax",
      headerName: "Pax",
      flex: 0.3,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "totalDP",
      headerName: "DP",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => formatRupiah(params.value),
    },
    {
      field: "totalAmount",
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
        title="RESERVATION DAILY REPORT"
        subtitle="Detailed Reservations Data by Time"
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
        <FormControl sx={{ minWidth: 200 }}>
          <Select
            labelId="time-select-label"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Times</MenuItem>
            {timeOptions.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
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
        }}
      >
        <DataGrid
          rows={detailsData || []}
          columns={columns}
          getRowId={(row) => `${row.reservationCode}-${row.date}-${row.time}`}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default ReservationDailyReport;
