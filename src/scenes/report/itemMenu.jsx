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
import { fetchItemSummaryPerDate } from "../../data/reportData";
import * as XLSX from "xlsx";

const ItemMenuReport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [summaryData, setSummaryData] = useState([]);
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
    const fetchSummaryData = async () => {
      if (!selectedBranchCode || !startDate || !endDate) return;

      try {
        const summaryData = await fetchItemSummaryPerDate(
          selectedBranchCode,
          startDate,
          endDate
        );
        setSummaryData(summaryData);
      } catch (error) {
        console.error("Error fetching item summary per date:", error);
      }
    };

    fetchSummaryData();
  }, [selectedBranchCode, startDate, endDate]);

  const handleBranchChange = (event) => {
    setSelectedBranchCode(event.target.value);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(summaryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ItemSummary");
    XLSX.writeFile(workbook, `ItemSummary_${startDate}_to_${endDate}.xlsx`);
  };

  const viewInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write("<h1>Item Summary Report</h1>");
    newWindow.document.write("<table border='1'>");
    newWindow.document.write(
      "<tr><th>Branch Name</th><th>Date</th><th>Category Name</th><th>Menu Name</th><th>QTY</th><th>Menu Price</th><th>Total Amount</th></tr>"
    );
    summaryData.forEach((item) => {
      newWindow.document.write(
        `<tr><td>${item.branchName}</td><td>${item.date}</td><td>${
          item.CategoryName
        }</td><td>${item.MenuName}</td><td>${
          item.quantities
        }</td><td>${formatRupiah(item.MenuPrice)}</td><td>${formatRupiah(
          item.totalAmount
        )}</td></tr>`
      );
    });
    newWindow.document.write("</table>");
    newWindow.document.close();
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
      align: "center",
    },
    {
      field: "CategoryName",
      headerName: "Category Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "MenuName",
      headerName: "Menu Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "quantities",
      headerName: "Quantities",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "MenuPrice",
      headerName: "Menu Price",
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
        title="ITEM SUMMARY PER DATE"
        subtitle="Summary of Items by Date"
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
          getRowId={(row) => `${row.date}-${row.CategoryName}-${row.MenuName}`}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default ItemMenuReport;
