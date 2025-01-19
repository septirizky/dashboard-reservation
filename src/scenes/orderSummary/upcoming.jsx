import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Button,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { fetchReservationsByBranchAndDate } from "../../data/reservationData";
import * as XLSX from "xlsx";

const UpComingResrvation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [reservationData, setReservationData] = useState([]);
  const [branchCodes, setBranchCodes] = useState([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedDate, setSelectedDate] = useState("today");

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
    const fetchReservations = async () => {
      if (!selectedBranchCode || !selectedDate) return;

      try {
        const today = new Date();
        const targetDate =
          selectedDate === "today"
            ? today.toISOString().split("T")[0]
            : new Date(today.setDate(today.getDate() + 1))
                .toISOString()
                .split("T")[0];

        const reservations = await fetchReservationsByBranchAndDate(
          selectedBranchCode,
          targetDate
        );
        setReservationData(reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [selectedBranchCode, selectedDate]);

  const handleBranchChange = (event) => {
    setSelectedBranchCode(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const exportToExcel = () => {
    const excelHeaders = [
      { header: "Branch Name", key: "branchName" },
      { header: "Date", key: "date" },
      { header: "Time", key: "time" },
      { header: "Name", key: "name" },
      { header: "Area", key: "tableAreaName" },
      { header: "Pax", key: "pax" },
    ];

    const formattedData = reservationData.map((row) => {
      return excelHeaders.reduce((acc, header) => {
        acc[header.header] = row[header.key];
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "UPCOMING_RESERVATION");
    XLSX.writeFile(workbook, `UPCOMING_RESERVATION_${selectedDate}.xlsx`);
  };

  const handleView = () => {
    const selectedDateObj = new Date();
    if (selectedDate === "tomorrow") {
      selectedDateObj.setDate(selectedDateObj.getDate() + 1);
    }

    const formattedDate = selectedDateObj.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const logoUrl = (() => {
      switch (selectedBranchCode) {
        case "AN":
          return "https://image-layanan.nos.jkt-1.neo.id/BDJ_UPDATE_LOGO_Ancol_1.png";
        case "AS":
          return "https://image-layanan.nos.jkt-1.neo.id/BDJ_Update_Logo_Alam_Sutera_Original_1.png";
        case "BK":
          return "https://image-layanan.nos.jkt-1.neo.id/BDJ_UPDATE_LOGO_Bekasi_1.png";
        default:
          return "https://image-layanan.nos.jkt-1.neo.id/Logo_Bandar_Djakarta_Group_Original_1.png";
      }
    })();

    const htmlContent = `
      <html>
        <head>
          <title>Reservation View</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
            }
            .header {
              margin: 20px;
            }
            .logo {
              width: 500px;
              margin-bottom: 20px;
            }
            table {
              width: 80%;
              margin: 20px auto;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #4CAF50;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUrl}" class="logo" alt="Logo Bandar Jakarta" />
            <h2>${formattedDate}</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Name</th>
                <th>Area</th>
                <th>Pax</th>
              </tr>
            </thead>
            <tbody>
              ${reservationData
                .map(
                  (reservation) => `
                    <tr>
                      <td>${reservation.time || "-"}</td>
                      <td>${reservation.name || "-"}</td>
                      <td>${reservation.tableAreaName || "-"}</td>
                      <td>${reservation.pax || "-"}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const columns = [
    {
      field: "time",
      headerName: "Time",
      flex: 0.3,
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
      field: "tableAreaName",
      headerName: "Table Area",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "pax",
      headerName: "Pax",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="FILTER RESERVATIONS BY BRANCH AND DATE"
        subtitle="View Reservations Filtered by Branch and Date"
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
        <Box display="flex" gap="10px">
          <Button
            variant={selectedDate === "today" ? "contained" : "outlined"}
            color="secondary"
            onClick={() => handleDateChange("today")}
          >
            Today
          </Button>
          <Button
            variant={selectedDate === "tomorrow" ? "contained" : "outlined"}
            color="secondary"
            onClick={() => handleDateChange("tomorrow")}
          >
            Tomorrow
          </Button>
        </Box>
        <Box ml="auto">
          <Button
            variant="contained"
            color="secondary"
            onClick={exportToExcel}
            sx={{ marginRight: "10px" }}
          >
            Export to Excel
          </Button>
          <Button variant="contained" color="info" onClick={handleView}>
            VIEW
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
          rows={reservationData || []}
          columns={columns}
          getRowId={(row) => `${row.time}-${row.name}-${row.tableAreaName}`}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default UpComingResrvation;
