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
import { fetchReservationSummaryPerDate } from "../../data/reservationData";
import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

const MonthlyReport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [summaryData, setSummaryData] = useState([]);
  const [branchCodes, setBranchCodes] = useState([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const years = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
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
        const summaryData = await fetchReservationSummaryPerDate(
          selectedBranchCode,
          selectedMonth,
          selectedYear
        );
        setSummaryData(summaryData);
      } catch (error) {
        console.error(
          "Error fetching reservation summary per branchCode, month, and year:",
          error
        );
      }
    };

    fetchSummaryData();
  }, [selectedBranchCode, selectedMonth, selectedYear]);

  const handleBranchChange = (event) => {
    setSelectedBranchCode(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(summaryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OrderSummary");
    XLSX.writeFile(
      workbook,
      `OrderSummary_${selectedYear}_${selectedMonth}.xlsx`
    );
  };

  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Order Summary", 14, 10);
  //   doc.autoTable({
  //     startY: 20,
  //     head: [
  //       [
  //         "Branch Name",
  //         "Branch Code",
  //         "Date",
  //         "Total Reservations",
  //         "Total Pax",
  //         "Total Items",
  //         "Total DP",
  //         "Total Amount",
  //       ],
  //     ],
  //     body: summaryData.map((row) => [
  //       row.branchName,
  //       row.branchCode,
  //       row.date,
  //       row.totalReservations,
  //       row.totalPax,
  //       row.totalItems,
  //       formatRupiah(row.totalDP),
  //       formatRupiah(row.totalAmount),
  //     ]),
  //   });
  //   doc.save(`OrderSummary_${selectedYear}_${selectedMonth}.pdf`);
  // };

  const viewInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write("<h1>Order Summary</h1>");
    newWindow.document.write("<table border='1'>");
    newWindow.document.write(
      "<tr><th>Branch Name</th><th>Branch Code</th><th>Date</th><th>Total Reservations</th><th>Total Pax</th><th>Total Items</th><th>Total DP</th><th>Total Amount</th></tr>"
    );
    summaryData.forEach((row) => {
      newWindow.document.write(
        `<tr><td>${row.branchName}</td><td>${row.branchCode}</td><td>${
          row.date
        }</td><td>${row.totalReservations}</td><td>${row.totalPax}</td><td>${
          row.totalItems
        }</td><td>${formatRupiah(row.totalDP)}</td><td>${formatRupiah(
          row.totalAmount
        )}</td></tr>`
      );
    });
    newWindow.document.write("</table>");
    newWindow.document.close();
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

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
      field: "totalReservations",
      headerName: "Total Reservations",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "totalPax",
      headerName: "Total Pax",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "totalItems",
      headerName: "Total Items",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "totalDP",
      headerName: "Total DP",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => formatRupiah(params.value),
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => formatRupiah(params.value),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="REPORT SUMMARY PER BRANCH AND MONTH"
        subtitle="Summary of Orders by Branch and Month"
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
            {months.map((month) => (
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
          getRowId={(row) => `${row.branchCode}-${row.date}`}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default MonthlyReport;
