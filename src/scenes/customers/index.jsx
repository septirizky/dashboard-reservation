import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { fetchCustomers } from "../../data/customerData";
import { fetchReservationCountByCustomerId } from "../../data/reservationData";

const Customers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [customers, setCustomers] = useState([]);

  const getCustomersWithReservationCount = async () => {
    try {
      const customerData = await fetchCustomers();

      const customerWithCounts = await Promise.all(
        customerData.map(async (customer) => {
          const reservationCount = await fetchReservationCountByCustomerId(
            customer.customerId
          );
          return {
            ...customer,
            reservationCount,
          };
        })
      );

      setCustomers(customerWithCounts);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    getCustomersWithReservationCount();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "firstVisit",
      headerName: "First Visit",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "lastVisit",
      headerName: "Last Visit",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "reservationCount",
      headerName: "Total Reservations",
      headerAlign: "center",
      flex: 1,
      align: "center",
    },
  ];

  return (
    <Box m="20px">
      <Header title="CUSTOMERS" subtitle="Managing the Customers" />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            display: "flex",
            fontSize: "0.9rem",
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid
          rows={customers}
          columns={columns}
          getRowId={(row) => row.customerId}
        />
      </Box>
    </Box>
  );
};

export default Customers;
