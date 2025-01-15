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
import { fetchReservationDetailPerTime } from "../../data/reservationData";
import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

const DailyReport = () => {
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
        const details = await fetchReservationDetailPerTime(
          selectedBranchCode,
          startDate,
          endDate
        );
        setDetailsData(details);
      } catch (error) {
        console.error("Error fetching reservation detail per time:", error);
      }
    };

    fetchDetails();
  }, [selectedBranchCode, startDate, endDate]);

  const handleBranchChange = (event) => {
    setSelectedBranchCode(event.target.value);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(detailsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DailyReport");
    XLSX.writeFile(workbook, `DailyReport_${startDate}_to_${endDate}.xlsx`);
  };

  //   const exportToPDF = () => {
  //     const doc = new jsPDF();
  //     doc.text("Daily Report", 14, 10);
  //     doc.autoTable({
  //       startY: 20,
  //       head: [
  //         [
  //           "Branch Name",
  //           "Branch Code",
  //           "Date",
  //           "Time",
  //           "Reservation Code",
  //           "Customer Name",
  //           "Phone",
  //           "Pax",
  //           "DP",
  //           "Amount",
  //         ],
  //       ],
  //       body: detailsData.map((row) => [
  //         row.branchName,
  //         row.branchCode,
  //         row.date,
  //         row.time,
  //         row.reservationCode,
  //         row.name,
  //         row.phone,
  //         row.pax,
  //         formatRupiah(row.totalDP),
  //         formatRupiah(row.totalAmount),
  //       ]),
  //     });
  //     doc.save(`DailyReport_${startDate}_to_${endDate}.pdf`);
  //   };

  const viewInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write("<h1>Daily Report</h1>");
    newWindow.document.write("<table border='1'>");
    newWindow.document.write(
      "<tr><th>Branch Name</th><th>Branch Code</th><th>Date</th><th>Time</th><th>Reservation Code</th><th>Customer Name</th><th>Phone</th><th>Pax</th><th>DP</th><th>Amount</th></tr>"
    );
    detailsData.forEach((row) => {
      newWindow.document.write(
        `<tr><td>${row.branchName}</td><td>${row.branchCode}</td><td>${
          row.date
        }</td><td>${row.time}</td><td>${row.reservationCode}</td><td>${
          row.name
        }</td><td>${row.phone}</td><td>${row.pax}</td><td>${formatRupiah(
          row.totalDP
        )}</td><td>${formatRupiah(row.totalAmount)}</td></tr>`
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
      field: "branchCode",
      headerName: "Branch Code",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
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
        title="RESERVATION DETAIL PER TIME"
        subtitle="Detailed Reservation Data by Time"
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
        <Box ml="auto">
          <Button
            variant="contained"
            color="secondary"
            onClick={exportToExcel}
            sx={{ marginRight: "10px" }}
          >
            Export to Excel
          </Button>
          {/* <Button
            variant="contained"
            color="secondary"
            onClick={exportToPDF}
            sx={{ marginRight: "10px" }}
          >
            Export to PDF
          </Button> */}
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

export default DailyReport;
