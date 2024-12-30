import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { fetchDisbursements } from "../../data/disbursementData";

const DisbursementList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disbursements, setDisbursements] = useState([]);

  const getDisbursements = async () => {
    try {
      const data = await fetchDisbursements();
      if (!Array.isArray(data)) {
        console.error("Invalid data format: Expected an array", data);
        return;
      }
      const formattedData = data.map((disbursement) => ({
        ...disbursement,
        amountFormatted: new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(disbursement.amount),
        createdAtFormatted: new Date(disbursement.createdAt).toLocaleString(
          "id-ID"
        ),
        updatedAtFormatted: new Date(disbursement.updatedAt).toLocaleString(
          "id-ID"
        ),
      }));
      setDisbursements(formattedData);
    } catch (error) {
      console.error("Error fetching disbursements:", error);
    }
  };

  useEffect(() => {
    getDisbursements();
  }, []);

  const columns = [
    { field: "external_id", headerName: "External ID", flex: 1 },
    { field: "bank_code", headerName: "Bank Code", flex: 0.5 },
    { field: "account_holder_name", headerName: "Account Holder", flex: 1 },
    { field: "account_number", headerName: "Account Number", flex: 0.7 },
    {
      field: "amountFormatted",
      headerName: "Amount",
      flex: 0.7,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography
          color={
            params.row.status === "COMPLETED"
              ? colors.greenAccent[500]
              : colors.redAccent[500]
          }
        >
          {params.row.status}
        </Typography>
      ),
    },
    {
      field: "createdAtFormatted",
      headerName: "Created At",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "updatedAtFormatted",
      headerName: "Updated At",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box m="20px">
      <Header title="DISBURSEMENT LIST" subtitle="List of All Disbursements" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
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
          rows={disbursements}
          columns={columns}
          getRowId={(row) => row.external_id}
        />
      </Box>
    </Box>
  );
};

export default DisbursementList;
