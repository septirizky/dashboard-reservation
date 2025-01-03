/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, useTheme, Button, Typography, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  getRefundByBranchCode,
  updateRefundStatus,
} from "../../data/refundData";
import { fetchReservationsByBranchCodes } from "../../data/reservationData";
import { toast, ToastContainer } from "react-toastify";

const RequestRefunds = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [refunds, setRefunds] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleOpenModal = (reservationCode) => {
    const reservation = reservations.find(
      (res) => res.reservationCode === reservationCode
    );
    setSelectedReservation(reservation || null);
    setSelectedItems(reservation?.items || []);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItems([]);
  };

  const branchCodes =
    JSON.parse(localStorage.getItem("userData"))?.branchCode || [];

  const getRefunds = async () => {
    try {
      const refundPromises = branchCodes.map((branchCode) =>
        getRefundByBranchCode(branchCode)
      );

      const allResponses = await Promise.allSettled(refundPromises);

      const successfulResponses = allResponses
        .filter((res) => res.status === "fulfilled")
        .map((res) => res.value);

      const allRefunds = successfulResponses.flat();

      const requestRefunds = allRefunds.filter(
        (refund) => refund.status === "Request Refund"
      );

      const transformedData = requestRefunds.map((refund) => ({
        ...refund,
        amount: new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(refund.amount || 0),
      }));

      setRefunds(transformedData);
    } catch (error) {
      console.error("Error fetching refunds data:", error);
    }
  };

  const getReservations = async () => {
    try {
      const data = await fetchReservationsByBranchCodes(branchCodes);
      setReservations(data);
    } catch (error) {
      console.error("Error fetching or posting data:", error);
    }
  };

  useEffect(() => {
    getReservations();
    getRefunds();
  }, []);

  const handleApproval = async (reservationCode) => {
    const confirmAction = window.confirm(
      "Apakah Anda yakin sudah refund reservasi ini?"
    );

    if (confirmAction) {
      try {
        await updateRefundStatus(reservationCode, "REFUND");

        toast.success("Refund status updated successfully!", {
          autoClose: 2000,
        });
        setRefunds((prevRefunds) =>
          prevRefunds.map((refund) =>
            refund.reservationCode === reservationCode
              ? { ...refund, status: "Refund" }
              : refund
          )
        );
        getRefunds();
        getReservations();
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Error updating refund status.", { autoClose: 2000 });
      }
    }
  };

  const columns = [
    {
      field: "reservationCode",
      headerName: "Reservation Code",
      flex: 0.6,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "branchName",
      headerName: "Branch Name",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "bank_name",
      headerName: "Bank Name",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "account_number",
      headerName: "Account Number",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "account_holder",
      headerName: "Account Holder",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Refund Status",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "created_at",
      headerName: "Request Date",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const date = new Date(params.row.created_at);
        return date.toLocaleDateString("id-ID");
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleApproval(params.row.reservationCode)}
        >
          DONE
        </Button>
      ),
    },
  ];

  const itemsColumns = [
    {
      field: "MenuName",
      headerName: "Menu Name",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "CategoryName",
      headerName: "Category Name",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "OptionName",
      headerName: "Option Name",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "quantities",
      headerName: "Quantities",
      headerAlign: "center",
      align: "right",
      flex: 0.5,
    },
  ];

  return (
    <Box m="20px">
      <Header title="REQUEST REFUNDS" subtitle="List of Refund Requests" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            color: "#fff",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            color: "#fff",
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
          rows={refunds}
          columns={columns}
          getRowId={(row) => row.reservationCode}
          onRowClick={(params, event) => {
            const isButtonClick = event.target.tagName === "BUTTON";
            if (!isButtonClick) {
              handleOpenModal(params.row.reservationCode);
            }
          }}
        />
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Reservation Details
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap={2}
            mb={3}
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? colors.primary[700]
                  : colors.grey[200],
              color:
                theme.palette.mode === "dark"
                  ? colors.grey[100]
                  : colors.grey[800],
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography>
              <strong>Name:</strong> {selectedReservation?.customer?.name || ""}
            </Typography>
            <Typography>
              <strong>Guest:</strong> {selectedReservation?.guest || ""}
            </Typography>
            <Typography>
              <strong>Phone:</strong>{" "}
              {selectedReservation?.customer?.phone || ""}
            </Typography>
            <Typography>
              <strong>Area Name:</strong>{" "}
              {selectedReservation?.tableAreaName || ""}
            </Typography>
            <Typography>
              <strong>Date:</strong>{" "}
              {new Date(selectedReservation?.date || "").toLocaleDateString(
                "id-ID"
              ) || ""}
            </Typography>
            <Typography>
              <strong>Table Name:</strong>{" "}
              {selectedReservation?.tableName || ""}
            </Typography>
            <Typography>
              <strong>Time:</strong> {selectedReservation?.time || ""}
            </Typography>
            <Typography>
              <strong>Note:</strong> {selectedReservation?.note || ""}
            </Typography>
            <Typography>
              <strong>Note Reservation:</strong>{" "}
              {selectedReservation?.noteReservation || ""}
            </Typography>
          </Box>
          <Box mt={2} height="400px">
            <DataGrid
              rows={selectedItems || []}
              columns={itemsColumns}
              getRowId={(row) => row._id || Math.random()}
              disableSelectionOnClick
              hideFooter={true}
            />
          </Box>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default RequestRefunds;
