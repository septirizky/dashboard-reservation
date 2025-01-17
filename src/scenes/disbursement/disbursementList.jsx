/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { fetchDisbursements } from "../../data/disbursementData";
import { fetchReservationDetails } from "../../data/reservationData";

const DisbursementList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disbursements, setDisbursements] = useState([]);
  const [selectedDisbursement, setSelectedDisbursement] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [reservationDetails, setReservationDetails] = useState([]);

  const handleRowClick = async (row) => {
    setSelectedDisbursement(row);
    try {
      const reservationDetails = await fetchReservationDetails(
        row.reservationCode
      );
      setReservationDetails(reservationDetails);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching reservation details:", error);
    }
  };

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);

  const getDisbursements = async () => {
    try {
      const data = await fetchDisbursements();
      if (!Array.isArray(data)) {
        console.error("Invalid data format: Expected an array", data);
        return;
      }
      const formattedData = data.map((disbursement) => ({
        ...disbursement,
        amountFormatted: formatRupiah(disbursement.amount),
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
    {
      field: "branchName",
      headerName: "Branch Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "external_id",
      headerName: "External ID",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "bank_code",
      headerName: "Bank Code",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "account_holder_name",
      headerName: "Account Holder",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "account_number",
      headerName: "Account Number",
      flex: 0.7,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "amountFormatted",
      headerName: "Amount",
      flex: 0.7,
      headerAlign: "center",
      align: "right",
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
      field: "name",
      headerName: "Name",
      flex: 0.7,
      headerAlign: "center",
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

  const tableModal = [
    {
      field: "reservationCode",
      headerName: "Reservation Code",
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
      field: "pax",
      headerName: "Pax",
      flex: 0.2,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "dp",
      headerName: "Amount",
      flex: 0.4,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => `Rp ${params.row.dp.toLocaleString()}`,
    },
  ];

  return (
    <Box m="20px">
      <Header title="DISBURSEMENT LIST" subtitle="List of All Disbursements" />
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
          rows={disbursements}
          columns={columns}
          getRowId={(row) => row.external_id}
          onRowClick={(params) => handleRowClick(params.row)}
        />
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Reservation Details for {selectedDisbursement?.branchName || ""}
          </Typography>
          {reservationDetails?.length > 0 ? (
            <DataGrid
              rows={reservationDetails.map((reservation) => ({
                id: reservation.reservationCode,
                ...reservation,
              }))}
              columns={tableModal}
              autoHeight
              disableSelectionOnClick
              hideFooter={true}
            />
          ) : (
            <Typography>No Reservations Found</Typography>
          )}
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenModal(false)}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default DisbursementList;
